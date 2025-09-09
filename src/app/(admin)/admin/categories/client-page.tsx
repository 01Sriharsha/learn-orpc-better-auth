"use client";

import { CategoryWithRelationsSchema } from "@/schemas/category";
import { CategoryProvider } from "./context";
import CategoriesToolbar from "./_components/categories-toolbar";
import CategoriesTable from "./_components/categories-table";
import CategoriesPagination from "./_components/categories-pagination";
import CategoryDialogForm from "./_components/category-dialog-form";

interface ClientPageProps {
  initialCategories: CategoryWithRelationsSchema[];
  initialPagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  initialSections: any[];
}

export default function ClientPage({ 
  initialCategories, 
  initialPagination, 
  initialSections 
}: ClientPageProps) {
  return (
    <CategoryProvider 
      initialCategories={initialCategories}
      initialPagination={initialPagination}
      initialSections={initialSections}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        <CategoriesToolbar />
        <CategoriesTable />
        <CategoriesPagination />
        <CategoryDialogForm />
      </div>
    </CategoryProvider>
  );
}
