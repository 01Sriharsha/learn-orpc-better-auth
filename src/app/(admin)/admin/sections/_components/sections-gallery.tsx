"use client";

import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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

import { orpcQC } from "@/lib/orpc";
import { SectionSchema } from "@/schemas/section";
import { useSectionContext } from "../context";
import SectionCard from "./section-card";

export default function SectionsGallery() {
  const { sections, loading, openDialog, deleteSection } = useSectionContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<SectionSchema | null>(
    null
  );
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const deleteMutation = useMutation(
    orpcQC.section.delete.mutationOptions({
      onSuccess: (data, varibales) => {
        deleteSection(varibales.params.id);
        toast.success("Section deleted successfully");
        setDeleteDialogOpen(false);
        setSectionToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete section");
      },
    })
  );

  const handleEdit = (section: SectionSchema) => {
    openDialog("update", section);
  };

  const handleDeleteClick = (section: SectionSchema) => {
    setSectionToDelete(section);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sectionToDelete) {
      deleteMutation.mutate({ params: { id: sectionToDelete.id } });
    }
  };

  const formatSectionType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading sections...</span>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MoreVertical className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No sections found
          </h3>
          <p className="text-slate-600 mb-4">
            Get started by creating your first section to organize your content.
          </p>
          <Button
            onClick={() => openDialog("create")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Create Your First Section
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <Accordion type="single" collapsible className="w-full">
        <AnimatePresence>
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AccordionItem
                value={section.id}
                className="border-b border-slate-100 last:border-b-0"
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="relative">
                  <AccordionTrigger className="hover:no-underline hover:bg-slate-50/50 transition-colors duration-200 px-6 py-4">
                    <div className="flex items-center justify-between w-full pr-8">
                      <div className="flex items-center gap-4">
                        {/* Section Info */}
                        <div className="text-left">
                          <h3 className="font-semibold text-slate-800 text-base">
                            {section.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 text-xs"
                            >
                              {formatSectionType(section.type)}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              Priority: {section.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* Admin Controls */}
                  <AnimatePresence>
                    {hoveredSection === section.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-slate-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={() => handleEdit(section)}
                              className="cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(section)}
                              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AccordionContent className="px-6 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionCard title={section.name} />
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </Accordion>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sectionToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
