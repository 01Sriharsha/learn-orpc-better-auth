"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { orpcQC } from "@/lib/orpc";
import { useCategoryContext } from "../context";

export default function CategoriesPagination() {
  const { pagination, filters, setCategories, setLoading } = useCategoryContext();
  const queryClient = useQueryClient();

  const handlePageChange = useCallback(
    async (page: number) => {
      console.log("handlePageChange called with page:", page);
      console.log("Current pagination:", pagination);
      console.log("Current filters:", filters);

      if (
        page !== pagination.page &&
        page >= 1 &&
        page <= pagination.totalPages
      ) {
        setLoading(true);

        try {
          console.log("Making ORPC call for page:", page);

          const searchParams = {
            page,
            pageSize: pagination.pageSize,
            keyword: filters.keyword || "",
            level: filters.level === 'all' ? undefined : Number(filters.level),
          };

          const response = await queryClient.fetchQuery(
            orpcQC.category.get.queryOptions({ input: searchParams })
          );

          console.log("ORPC response:", response);

          if (response?.data) {
            setCategories(response.data.content, {
              total: response.data.total,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            });
          }
        } catch (error) {
          console.error("Pagination failed:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [pagination.page, pagination.totalPages, pagination.pageSize, setLoading, setCategories, filters, queryClient]
  );

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const { page, totalPages } = pagination;
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages;
  };

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>
          Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
          {pagination.total} results
        </span>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(pagination.page - 1)}
              className={
                pagination.page === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-slate-100"
              }
            />
          </PaginationItem>

          {generatePageNumbers().map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(pageNum as number)}
                  isActive={pageNum === pagination.page}
                  className="cursor-pointer hover:bg-slate-100"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(pagination.page + 1)}
              className={
                pagination.page === pagination.totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-slate-100"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
}
