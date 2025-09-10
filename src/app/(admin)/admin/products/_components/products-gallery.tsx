"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { orpcQC } from "@/lib/orpc";
import { ProductResponseSchema } from "@/schemas/product";
import { useProductContext } from "../context";
import ProductCard from "./product-card";

export default function ProductsGallery() {
  const { products, loading, openDialog, deleteProduct } = useProductContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductResponseSchema | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpcQC.product.delete.mutationOptions({
      onSuccess: (data, variables) => {
        deleteProduct(variables.params.id);
        toast.success("Product deleted successfully");
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        
        // Invalidate product queries to refresh the list
        queryClient.invalidateQueries({
          queryKey: orpcQC.product.get.key()
        });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete product");
      },
    })
  );

  const handleEdit = (product: ProductResponseSchema) => {
    openDialog("update", product);
  };

  const handleDeleteClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setProductToDelete(product);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate({ params: { id: productToDelete.id } });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-slate-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l3-3 3 3"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-4">Get started by creating your first product.</p>
          <Button onClick={() => openDialog("create")}>
            Create Product
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        {/* Gallery Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Products Gallery
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
                layout
              >
                <ProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
              All associated product details, pricing, and engagement blocks will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
