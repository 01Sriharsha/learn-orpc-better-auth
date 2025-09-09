"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
import { useCategoryContext } from "../context";

export default function CategoriesToolbar() {
  const {
    filters,
    sections,
    openDialog,
    setCategories,
    setLoading,
    hasInitialData,
    pagination,
    setFilters,
  } = useCategoryContext();
  const [searchValue, setSearchValue] = useState(filters.keyword || "");
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(searchValue, 500);

  // Only perform search when debounced value is different from current filter
  useEffect(() => {
    if (hasInitialData && debouncedSearch !== filters.keyword) {
      const performSearch = async () => {
        setLoading(true);
        try {
          const searchParams: any = {
            keyword: debouncedSearch || "",
            page: 1,
            pageSize: pagination.pageSize,
          };

          // Only include level if it's not 'all' or undefined
          if (filters.level && filters.level !== "all") {
            searchParams.level = Number(filters.level);
          }

          // Only include sectionId if it's not undefined
          if (filters.sectionId) {
            searchParams.sectionId = filters.sectionId;
          }

          const response = await queryClient.fetchQuery(
            orpcQC.category.get.queryOptions({ input: searchParams })
          );

          if (response?.data) {
            setCategories(response.data.content, {
              total: response.data.total,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            });
          }

          // Update filters to match current search
          setFilters({ ...filters, keyword: debouncedSearch });
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      };

      performSearch();
    }
  }, [debouncedSearch, hasInitialData]); // Removed filters dependency to prevent loop

  const handleLevelFilter = useCallback(
    async (level: string) => {
      setLoading(true);

      try {
        const searchParams: any = {
          keyword: filters.keyword || "",
          page: 1,
          pageSize: pagination.pageSize,
        };

        // Only include level if it's not 'all'
        if (level !== "all") {
          searchParams.level = Number(level);
        }

        // Only include sectionId if it's not undefined
        if (filters.sectionId) {
          searchParams.sectionId = filters.sectionId;
        }

        const response = await queryClient.fetchQuery(
          orpcQC.category.get.queryOptions({ input: searchParams })
        );

        if (response?.data) {
          setCategories(response.data.content, {
            total: response.data.total,
            page: response.data.page,
            pageSize: response.data.pageSize,
            totalPages: response.data.totalPages,
          });
        }

        setFilters({ ...filters, level });
      } catch (error) {
        console.error("Filter failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      filters.keyword,
      filters.sectionId,
      pagination.pageSize,
      queryClient,
      setCategories,
      setFilters,
      setLoading,
    ]
  );

  const handleSectionFilter = useCallback(
    async (sectionId: string) => {
      setLoading(true);

      try {
        const searchParams: any = {
          keyword: filters.keyword || "",
          page: 1,
          pageSize: pagination.pageSize,
        };

        // Only include level if it's not 'all' or undefined
        if (filters.level && filters.level !== "all") {
          searchParams.level = Number(filters.level);
        }

        // Only include sectionId if it's not 'all'
        if (sectionId !== "all") {
          searchParams.sectionId = sectionId;
        }

        const response = await queryClient.fetchQuery(
          orpcQC.category.get.queryOptions({ input: searchParams })
        );

        if (response?.data) {
          setCategories(response.data.content, {
            total: response.data.total,
            page: response.data.page,
            pageSize: response.data.pageSize,
            totalPages: response.data.totalPages,
          });
        }

        setFilters({
          ...filters,
          sectionId: sectionId === "all" ? undefined : sectionId,
        });
      } catch (error) {
        console.error("Section filter failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      filters.keyword,
      filters.level,
      pagination.pageSize,
      queryClient,
      setCategories,
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
      className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm"
    >
      <div className="space-y-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Categories Management
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Manage and organize your categories hierarchy
          </p>
        </motion.div>

        {/* Controls - Responsive Layout */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Left Section - Search and Filters */}
          <div className="flex flex-col sm:flex-row lg:flex-row gap-3 flex-1 lg:max-w-4xl">
            {/* Search Bar */}
            <motion.div
              className="relative flex-1 min-w-0 lg:max-w-xs"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search categories..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 w-full border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200"
              />
            </motion.div>

            {/* Filters Row */}
            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 lg:gap-3">
              {/* Level Filter */}
              <motion.div
                className="flex-1 min-w-0 lg:min-w-[160px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Select
                  value={filters.level || "all"}
                  onValueChange={handleLevelFilter}
                >
                  <SelectTrigger className="w-full border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="0">Root Categories (Level 0)</SelectItem>
                    <SelectItem value="1">Subcategories (Level 1)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Section Filter */}
              <motion.div
                className="flex-1 min-w-0 lg:min-w-[160px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Select
                  value={filters.sectionId || "all"}
                  onValueChange={handleSectionFilter}
                >
                  <SelectTrigger className="w-full border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200">
                    <SelectValue placeholder="Filter by section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections?.map((section: any) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </div>

          {/* Right Section - Create Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => openDialog("create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto lg:w-auto whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
