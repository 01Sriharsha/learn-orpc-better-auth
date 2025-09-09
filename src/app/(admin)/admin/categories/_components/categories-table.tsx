"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { orpcQC } from "@/lib/orpc";
import { CategoryWithRelationsSchema } from "@/schemas/category";
import { useCategoryContext } from "../context";

export default function CategoriesTable() {
  const { categories, loading, openDialog, deleteCategory } = useCategoryContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithRelationsSchema | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Debug logging
  console.log("Categories in table:", categories);
  console.log("Categories count by level:", {
    level0: categories.filter(c => c.level === 0).length,
    level1: categories.filter(c => c.level === 1).length,
    total: categories.length
  });

  const deleteMutation = useMutation(
    orpcQC.category.delete.mutationOptions({
      onSuccess: (data, variables) => {
        deleteCategory(variables.params.id);
        toast.success("Category deleted successfully");
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        
        // Invalidate category queries to refresh the list
        queryClient.invalidateQueries({
          queryKey: orpcQC.category.get.key()
        });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete category");
      },
    })
  );

  const handleEdit = (category: CategoryWithRelationsSchema) => {
    openDialog("update", category);
  };

  const handleDeleteClick = (category: CategoryWithRelationsSchema) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteMutation.mutate({ params: { id: categoryToDelete.id } });
    }
  };

  // Sort categories to show hierarchical structure
  const sortedCategories = () => {
    const result: CategoryWithRelationsSchema[] = [];
    
    // First, get all root categories (level 0) sorted by priority
    const rootCategories = categories
      .filter(cat => cat.level === 0)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
    
    // For each root category, add it and then its children
    rootCategories.forEach(rootCategory => {
      result.push(rootCategory);
      
      // Find and add all children of this root category
      const children = categories
        .filter(cat => cat.level === 1 && cat.parent?.id === rootCategory.id)
        .sort((a, b) => (a.priority || 0) - (b.priority || 0));
      
      result.push(...children);
    });
    
    // Add any orphaned level 1 categories (those without a parent in the current list)
    const orphanedChildren = categories
      .filter(cat => cat.level === 1 && !categories.some(parent => parent.id === cat.parent?.id))
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
    
    result.push(...orphanedChildren);
    
    return result;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-slate-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center"
      >
        <h3 className="text-lg font-medium text-slate-900 mb-2">No categories found</h3>
        <p className="text-slate-600 mb-4">Get started by creating your first category.</p>
        <Button onClick={() => openDialog("create")}>
          Create Category
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700 min-w-[150px]">Name</TableHead>
                <TableHead className="font-semibold text-slate-700 min-w-[200px] hidden sm:table-cell">Description</TableHead>
                <TableHead className="font-semibold text-slate-700 min-w-[80px]">Level</TableHead>
                <TableHead className="font-semibold text-slate-700 min-w-[80px] hidden md:table-cell">Priority</TableHead>
                <TableHead className="font-semibold text-slate-700 min-w-[120px] hidden lg:table-cell">Parent Category</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right min-w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            <AnimatePresence>
              {sortedCategories().map((category, index) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group hover:bg-slate-50 transition-colors duration-200"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <TableCell>
                    <div
                      className={`font-medium text-slate-900 ${
                        category.level === 1 ? "pl-8 text-slate-700" : ""
                      }`}
                    >
                      {category.level === 1 && (
                        <span className="text-slate-400 mr-2">└─</span>
                      )}
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-slate-600 max-w-xs truncate">
                      {category.description || "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={category.level === 0 ? "default" : "secondary"}
                      className={
                        category.level === 0
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }
                    >
                      Level {category.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-slate-600">{category.priority}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-slate-600">
                      {category.parent?.slug || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: hoveredCategory === category.id ? 1 : 0 
                      }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex gap-1"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(category)}
                            className="cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(category)}
                            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
              {categoryToDelete?.childrenLength! > 0 && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                  <strong>Warning:</strong> This category has {categoryToDelete?.childrenLength!} subcategories 
                  that will also be affected.
                </div>
              )}
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
