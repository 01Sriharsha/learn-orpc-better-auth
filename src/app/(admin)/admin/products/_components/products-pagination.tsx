"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { orpcQC } from "@/lib/orpc";
import { useProductContext } from "../context";
import z from "zod";
import { ProductSchema } from "@/schemas/product";

export default function ProductsPagination() {
  const { pagination, filters, setProducts, setLoading } = useProductContext();
  const queryClient = useQueryClient();

  const handlePageChange = useCallback(
    async (newPage: number) => {
      if (newPage < 1 || newPage > pagination.totalPages) return;

      setLoading(true);
      try {
        const searchParams: any = {
          keyword: filters.keyword || "",
          page: newPage,
          pageSize: pagination.pageSize,
        };

        if (filters.sectionId) {
          searchParams.sectionId = filters.sectionId;
        }

        if (filters.categoryId) {
          searchParams.categoryId = filters.categoryId;
        }

        const response = await queryClient.fetchQuery(
          orpcQC.product.get.queryOptions({ input: searchParams })
        );

        const { content, ...newPagination } = response.data;
        const parsed = z.array(ProductSchema).parse(content);

        if (response?.data) {
          setProducts(parsed, {
            total: newPagination.total,
            page: newPagination.page,
            pageSize: newPagination.pageSize,
            totalPages: newPagination.totalPages,
          });
        }
      } catch (error) {
        console.error("Pagination failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      pagination.pageSize,
      pagination.totalPages,
      filters,
      queryClient,
      setProducts,
      setLoading,
    ]
  );

  const handlePageSizeChange = useCallback(
    async (newPageSize: string) => {
      setLoading(true);
      try {
        const searchParams: any = {
          keyword: filters.keyword || "",
          page: 1, // Reset to first page when changing page size
          pageSize: parseInt(newPageSize),
        };

        if (filters.sectionId) {
          searchParams.sectionId = filters.sectionId;
        }

        if (filters.categoryId) {
          searchParams.categoryId = filters.categoryId;
        }

        const response = await queryClient.fetchQuery(
          orpcQC.product.get.queryOptions({ input: searchParams })
        );

        const { content, ...newPagination } = response.data;
        const parsed = z.array(ProductSchema).parse(content);

        if (response?.data) {
          setProducts(parsed, {
            total: newPagination.total,
            page: newPagination.page,
            pageSize: newPagination.pageSize,
            totalPages: newPagination.totalPages,
          });
        }
      } catch (error) {
        console.error("Page size change failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, queryClient, setProducts, setLoading]
  );

  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  );

  if (pagination.total === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results Info */}
        <div className="text-sm text-slate-600">
          Showing {startItem} to {endItem} of {pagination.total} products
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col xs:flex-row items-center gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">
              Show:
            </span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(pagination.totalPages, 5) },
                (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNumber = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNumber = pagination.totalPages - 4 + i;
                  } else {
                    pageNumber = pagination.page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        pagination.page === pageNumber ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Page Info */}
          <div className="text-sm text-slate-600 whitespace-nowrap">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
