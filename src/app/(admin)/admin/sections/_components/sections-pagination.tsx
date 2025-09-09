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
import { useSectionContext } from "../context";

export default function SectionsPagination() {
  const { pagination, filters, setSections, setLoading } = useSectionContext();
  const queryClient = useQueryClient();

  const handlePageChange = useCallback(
    async (page: number) => {
      if (
        page !== pagination.page &&
        page >= 1 &&
        page <= pagination.totalPages
      ) {
        setLoading(true);

        try {
          const searchParams = {
            page,
            pageSize: pagination.pageSize,
            keyword: filters.keyword || "",
            type: filters.type as any,
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
        } catch (error) {
          console.error("Pagination failed:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [
      pagination.page,
      pagination.totalPages,
      pagination.pageSize,
      setLoading,
      setSections,
      filters,
      queryClient,
    ]
  );

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const { page: currentPage, totalPages } = pagination;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Show first pages + ellipsis + last page
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("ellipsis");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last pages
        pages.push(1);
        if (totalPages > 4) {
          pages.push("ellipsis");
        }
        for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first + ellipsis + current range + ellipsis + last
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (pagination.totalPages <= 1) {
    return null;
  }

  const pageNumbers = generatePageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-slate-600"
        >
          Showing{" "}
          <span className="font-medium text-slate-800">
            {(pagination.page - 1) * pagination.pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-slate-800">
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-800">{pagination.total}</span>{" "}
          sections
        </motion.div>

        {/* Pagination Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className={`cursor-pointer transition-colors ${
                    pagination.page === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  aria-disabled={pagination.page === 1}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {pageNumbers.map((pageNumber, index) => (
                <PaginationItem key={index}>
                  {pageNumber === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber as number)}
                        isActive={pageNumber === pagination.page}
                        className={`cursor-pointer transition-all duration-200 ${
                          pageNumber === pagination.page
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                            : "hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </motion.div>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className={`cursor-pointer transition-colors ${
                    pagination.page === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  aria-disabled={pagination.page === pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      </div>
    </motion.div>
  );
}
