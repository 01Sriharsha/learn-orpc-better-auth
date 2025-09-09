import { Suspense } from "react";

import { client } from "@/lib/orpc";

import { safe } from "@orpc/client";
import SectionDialogForm from "./_components/section-dialog-form";
import SectionsGallery from "./_components/sections-gallery";
import SectionsPagination from "./_components/sections-pagination";
import SectionsToolbar from "./_components/sections-toolbar";
import { SectionProvider } from "./context";

interface SearchParams {
  page?: string;
  pageSize?: string;
  keyword?: string;
  type?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata = {
  title: "Sections Management - Admin",
  description: "Manage and organize your website sections",
};

export default async function SectionsPage() {
  const [error, data] = await safe(
    client.section.get({ pageSize: 10, page: 1 })
  );

  const paginationdata = data?.data;
  const sections = paginationdata?.content || [];
  const pagination = {
    total: paginationdata?.total || 0,
    page: paginationdata?.page || 1,
    pageSize: paginationdata?.pageSize || 10,
    totalPages: paginationdata?.totalPages || 0,
  };

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SectionProvider
        initialSections={sections}
        initialPagination={pagination}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Toolbar */}
            <SectionsToolbar />

            {/* Main Content */}

            <div className="grid gap-6">
              {/* Sections Gallery */}
              <SectionsGallery />

              {/* Pagination */}
              <SectionsPagination />
            </div>
          </div>

          {/* Hidden Dialog Form - Triggered by context */}
          <SectionDialogForm trigger={<div />} />
        </div>
      </SectionProvider>
    </Suspense>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toolbar Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-48"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-slate-200 rounded w-64"></div>
              <div className="h-10 bg-slate-200 rounded w-48"></div>
              <div className="h-10 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-b border-slate-100 pb-4 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded w-48"></div>
            <div className="h-10 bg-slate-200 rounded w-64"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
