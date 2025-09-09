"use client";

import { SectionType } from "@generated/client/enums";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import React, { useCallback, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { orpcQC } from "@/lib/orpc";
import { useSectionContext } from "../context";

export default function SectionsToolbar() {
  const {
    filters,
    setFilters,
    openDialog,
    setSections,
    setLoading,
    hasInitialData,
    pagination,
  } = useSectionContext();
  const [searchValue, setSearchValue] = useState(filters.keyword || "");
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(searchValue, 500);

  // Only perform search when debounced value is different from current filter
  useEffect(() => {
    if (hasInitialData && debouncedSearch !== filters.keyword) {
      const performSearch = async () => {
        setLoading(true);
        try {
          const searchParams = {
            keyword: debouncedSearch || "",
            type: filters.type as SectionType,
            page: 1,
            pageSize: pagination.pageSize,
          };

          const response = await queryClient.fetchQuery(
            orpcQC.section.get.queryOptions({ input: searchParams })
          );

          if (response?.data) {
            setSections(response.data.content, {
              total: response.data.total,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            });
          }

          // Update filters to match current search
          setFilters({ keyword: debouncedSearch, type: filters.type });
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      };

      performSearch();
    }
  }, [debouncedSearch, hasInitialData]); // Removed filters dependency to prevent loop

  const handleTypeFilter = useCallback(
    async (type: string) => {
      const newType = type === "all" ? "" : type;
      setLoading(true);

      try {
        const searchParams = {
          keyword: filters.keyword || "",
          type: newType as SectionType,
          page: 1,
          pageSize: pagination.pageSize,
        };

        const response = await queryClient.fetchQuery(
          orpcQC.section.get.queryOptions({
            input: searchParams,
          })
        );

        if (response?.data) {
          setSections(response.data.content, {
            total: response.data.total,
            page: response.data.page,
            pageSize: response.data.pageSize,
            totalPages: response.data.totalPages,
          });
        }

        setFilters({ type: newType });
      } catch (error) {
        console.error("Filter failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      filters.keyword,
      pagination.pageSize,
      queryClient,
      setSections,
      setFilters,
      setLoading,
    ]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sections Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage and organize your website sections
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search Bar */}
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search sections..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 w-full sm:w-64 border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200"
            />
          </motion.div>

          {/* Type Filter */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Select
              value={filters.type || "all"}
              onValueChange={handleTypeFilter}
            >
              <SelectTrigger className="w-full sm:w-48 border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(SectionType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Create Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => openDialog("create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Section
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
