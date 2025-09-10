"use client";

import { ProductResponseSchema } from "@/schemas/product";
import { ProductProvider } from "./context";
import ProductsToolbar from "./_components/products-toolbar";
import ProductsGallery from "./_components/products-gallery";
import ProductsPagination from "./_components/products-pagination";
import ProductDialogForm from "./_components/product-dialog-form";

interface ClientPageProps {
  initialProducts: ProductResponseSchema[];
  initialPagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  initialSections: any[];
  initialCategories: any[];
}

export default function ClientPage({ 
  initialProducts, 
  initialPagination, 
  initialSections,
  initialCategories 
}: ClientPageProps) {
  return (
    <ProductProvider 
      initialProducts={initialProducts}
      initialPagination={initialPagination}
      initialSections={initialSections}
      initialCategories={initialCategories}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        <ProductsToolbar />
        <ProductsGallery />
        <ProductsPagination />
        <ProductDialogForm />
      </div>
    </ProductProvider>
  );
}
