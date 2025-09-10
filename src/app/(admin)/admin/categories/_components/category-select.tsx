"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orpcQC } from "@/lib/orpc";
import { CategoryWithRelationsSchema } from "@/schemas/category";

interface CategorySelectProps {
  value?: string; // categoryId
  onValueChange: (categoryId: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  showSubcategories?: boolean; // If true, enables two-level selection
  sectionId?: string; // Filter categories by section
  className?: string;
}

export default function CategorySelect({
  value,
  onValueChange,
  placeholder = "Select category",
  disabled = false,
  showSubcategories = false,
  sectionId,
  className = "",
}: CategorySelectProps) {
  const [selectedRoot, setSelectedRoot] = useState<string | undefined>();
  const [selectedSub, setSelectedSub] = useState<string | undefined>();
  // Track which level was most recently selected to control where the check icon appears
  const [lastSelectedLevel, setLastSelectedLevel] = useState<
    "root" | "sub" | null
  >(null);

  // Fetch root categories (level 0)
  const { data: rootCategories, isLoading: rootLoading } = useQuery(
    orpcQC.category.get.queryOptions({
      input: { level: 0, pageSize: 100, sectionId },
      enabled: !!sectionId,
    })
  );

  // Fetch subcategories when root is selected
  const { data: subCategories, isLoading: subLoading } = useQuery(
    orpcQC.category.get.queryOptions({
      input: { parentId: selectedRoot, level: 1, pageSize: 100, sectionId },
      enabled: !!selectedRoot && showSubcategories && !!sectionId,
    })
  );

  // Fallback: fetch all level 1 categories in the section to resolve pre-filled subcategory values
  const { data: allSectionSubcategories } = useQuery(
    orpcQC.category.get.queryOptions({
      input: { level: 1, pageSize: 100, sectionId },
      enabled: !!sectionId && !!value && showSubcategories && !selectedRoot,
    })
  );

  // Auto-population logic
  useEffect(() => {
    if (!value) {
      // When waiting for a subcategory selection, keep the current root selection.
      // We'll reset on section change explicitly.
      return;
    }

    if (rootCategories?.data?.content) {
      const rootCategoriesList = rootCategories.data.content;

      // Check if the value is a root category
      const rootCategory = rootCategoriesList.find((cat) => cat.id === value);
      if (rootCategory) {
        if (selectedRoot !== rootCategory.id) {
          setSelectedRoot(rootCategory.id);
        }
        if (selectedSub !== undefined) {
          setSelectedSub(undefined);
        }
        if (lastSelectedLevel !== "root") setLastSelectedLevel("root");
        return;
      }

      // If not a root category and we have subcategories for current root, check there
      if (subCategories?.data?.content) {
        const subCategoriesList = subCategories.data.content;
        const subCategory = subCategoriesList.find((cat) => cat.id === value);
        if (subCategory) {
          if (selectedRoot !== subCategory.parent?.id) {
            setSelectedRoot(subCategory.parent?.id);
          }
          if (selectedSub !== subCategory.id) {
            setSelectedSub(subCategory.id);
          }
          if (lastSelectedLevel !== "sub") setLastSelectedLevel("sub");
          return;
        }
      }

      // Fallback: search across all section subcategories
      if (allSectionSubcategories?.data?.content) {
        const allSubs = allSectionSubcategories.data.content;
        const subCategory = allSubs.find((cat) => cat.id === value);
        if (subCategory) {
          if (selectedRoot !== subCategory.parent?.id) {
            setSelectedRoot(subCategory.parent?.id);
          }
          if (selectedSub !== subCategory.id) {
            setSelectedSub(subCategory.id);
          }
          return;
        }
      }
    }
  }, [
    value,
    rootCategories?.data?.content,
    subCategories?.data?.content,
    allSectionSubcategories?.data?.content,
    selectedRoot,
    selectedSub,
    lastSelectedLevel,
  ]);

  // Reset states when sectionId changes
  useEffect(() => {
    setSelectedRoot(undefined);
    setSelectedSub(undefined);
    onValueChange(undefined);
  }, [sectionId]); // Removed onValueChange from dependencies

  const handleRootChange = useCallback(
    (rootId: string) => {
      setSelectedRoot(rootId);
      setSelectedSub(undefined);

      if (!showSubcategories) {
        // If no subcategories, directly select the root category
        onValueChange(rootId);
        setLastSelectedLevel("root");
      } else {
        // Check if this root category has children
        const rootCategory = rootCategories?.data?.content?.find(
          (cat) => cat.id === rootId
        );
        const hasChildren = (rootCategory?.childrenLength ?? 0) > 0;

        if (hasChildren) {
          // If has children, wait for subcategory selection
          onValueChange(undefined);
          setLastSelectedLevel("root");
        } else {
          // If no children, select the root category directly
          onValueChange(rootId);
          setLastSelectedLevel("root");
        }
      }
    },
    [showSubcategories, onValueChange, rootCategories?.data?.content]
  );

  const handleSubChange = useCallback(
    (subId: string) => {
      setSelectedSub(subId);
      onValueChange(subId);
      setLastSelectedLevel("sub");
    },
    [onValueChange]
  );

  const rootCategoriesList = rootCategories?.data?.content || [];
  const subCategoriesList = subCategories?.data?.content || [];

  // Check if selected root category has children
  const selectedRootCategory = rootCategoriesList.find(
    (cat) => cat.id === selectedRoot
  );
  const shouldShowSubcategories =
    showSubcategories &&
    !!selectedRoot &&
    (selectedRootCategory?.childrenLength ?? 0) > 0;

  if (!showSubcategories) {
    // Single level selection
    return (
      <Select
        value={selectedRoot}
        onValueChange={handleRootChange}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={rootLoading ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {rootCategoriesList.length === 0 ? (
            <SelectItem value="0" disabled>
              No categories available
            </SelectItem>
          ) : (
            rootCategoriesList.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  {lastSelectedLevel === "root" &&
                    selectedRoot === category.id && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  }

  // Two-level selection
  return (
    <div className="space-y-2">
      <Select
        value={selectedRoot}
        onValueChange={handleRootChange}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue
            placeholder={rootLoading ? "Loading..." : "Select root category"}
          />
        </SelectTrigger>
        <SelectContent>
          {rootCategoriesList.length === 0 ? (
            <SelectItem value="0" disabled>
              No categories available
            </SelectItem>
          ) : (
            rootCategoriesList.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  {lastSelectedLevel === "root" &&
                    selectedRoot === category.id && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {shouldShowSubcategories && (
        <Select
          value={selectedSub}
          onValueChange={handleSubChange}
          disabled={disabled}
        >
          <SelectTrigger className={className}>
            <SelectValue
              placeholder={subLoading ? "Loading..." : "Select subcategory"}
            />
          </SelectTrigger>
          <SelectContent>
            {subCategoriesList.length === 0 ? (
              <SelectItem value="0" disabled>
                No subcategories available
              </SelectItem>
            ) : (
              subCategoriesList.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{category.name}</span>
                    {lastSelectedLevel === "sub" &&
                      selectedSub === category.id && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
