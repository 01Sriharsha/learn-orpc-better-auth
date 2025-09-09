"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  className?: string;
}

export default function CategorySelect({
  value,
  onValueChange,
  placeholder = "Select category",
  disabled = false,
  showSubcategories = false,
  className = "",
}: CategorySelectProps) {
  const [selectedRoot, setSelectedRoot] = useState<string | undefined>();
  const [selectedSub, setSelectedSub] = useState<string | undefined>();

  // Fetch root categories (level 0)
  const { data: rootCategories } = useQuery(
    orpcQC.category.get.queryOptions({
      input: { level: 0, pageSize: 100 },
      enabled: true,
    })
  );

  // Fetch subcategories when root is selected
  const { data: subCategories } = useQuery(
    orpcQC.category.get.queryOptions({
      input: { parentId: selectedRoot, level: 1, pageSize: 100 },
      enabled: !!selectedRoot && showSubcategories,
    })
  );

  // Auto-population logic
  useEffect(() => {
    if (value && rootCategories?.data?.content) {
      const findCategoryById = (
        id: string
      ): CategoryWithRelationsSchema | undefined => {
        // Search in root categories first
        let category = rootCategories.data?.content.find(
          (cat) => cat.id === id
        );
        if (category) return category;

        // If not found and we have subcategories, search there too
        if (subCategories?.data?.content) {
          category = subCategories.data.content.find((cat) => cat.id === id);
        }
        return category;
      };

      const category = findCategoryById(value);
      if (category) {
        if (category.level === 0) {
          setSelectedRoot(category.id);
          setSelectedSub(undefined);
        } else {
          // For level 1 categories, find their parent
          setSelectedRoot(category.parent?.id);
          setSelectedSub(category.id);
        }
      }
    }
  }, [value, rootCategories?.data?.content, subCategories?.data?.content]);

  const handleRootChange = (rootId: string) => {
    setSelectedRoot(rootId);
    setSelectedSub(undefined);

    if (!showSubcategories) {
      onValueChange(rootId);
    } else {
      onValueChange(undefined); // Wait for subcategory selection
    }
  };

  const handleSubChange = (subId: string) => {
    setSelectedSub(subId);
    onValueChange(subId);
  };

  const rootCategoriesList = rootCategories?.data?.content || [];
  const subCategoriesList = subCategories?.data?.content || [];

  if (!showSubcategories) {
    // Single level selection
    return (
      <Select
        value={selectedRoot}
        onValueChange={handleRootChange}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {rootCategoriesList.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
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
          <SelectValue placeholder="Select root category" />
        </SelectTrigger>
        <SelectContent>
          {rootCategoriesList.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedRoot && subCategoriesList.length > 0 && (
        <Select
          value={selectedSub}
          onValueChange={handleSubChange}
          disabled={disabled}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subCategoriesList.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
