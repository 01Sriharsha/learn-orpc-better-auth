"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ShoppingBag } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Dummy data for categories and products
const DUMMY_CATEGORIES = [
  { id: "1", name: "Electronics", children: [
    { id: "1-1", name: "Smartphones" },
    { id: "1-2", name: "Laptops" },
    { id: "1-3", name: "Tablets" }
  ]},
  { id: "2", name: "Software", children: [
    { id: "2-1", name: "Business Software" },
    { id: "2-2", name: "Security Software" },
    { id: "2-3", name: "Development Tools" }
  ]},
  { id: "3", name: "Network Hardware", children: [
    { id: "3-1", name: "Routers" },
    { id: "3-2", name: "Switches" },
    { id: "3-3", name: "Access Points" }
  ]},
];

const DUMMY_PRODUCTS = [
  { id: "1", name: "Enterprise Router X1", price: "$2,999", image: "/placeholder-product.jpg" },
  { id: "2", name: "Business Software Suite", price: "$599", image: "/placeholder-product.jpg" },
  { id: "3", name: "Security Platform Pro", price: "$1,299", image: "/placeholder-product.jpg" },
  { id: "4", name: "Network Switch 24-Port", price: "$899", image: "/placeholder-product.jpg" },
  { id: "5", name: "Cloud Management Tool", price: "$399", image: "/placeholder-product.jpg" },
];

interface SectionCardProps {
  title: string;
  className?: string;
}

export default function SectionCard({ title, className = "" }: SectionCardProps) {
  const [selectedRootCategory, setSelectedRootCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const handleRootCategoryChange = (categoryId: string) => {
    setSelectedRootCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory when root changes
  };

  const selectedRootCategoryData = DUMMY_CATEGORIES.find(cat => cat.id === selectedRootCategory);
  const availableSubCategories = selectedRootCategoryData?.children || [];

  // Filter products based on selected category (dummy logic)
  const filteredProducts = selectedSubCategory ? 
    DUMMY_PRODUCTS.slice(0, 3) : // Show 3 products when subcategory is selected
    DUMMY_PRODUCTS.slice(0, 2); // Show 2 products when only root category is selected

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Live
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Category Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Root Category Selector */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Select value={selectedRootCategory} onValueChange={handleRootCategoryChange}>
                <SelectTrigger className="border-slate-200 focus:border-blue-400 transition-colors">
                  <SelectValue placeholder="Select category" />
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  {DUMMY_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Subcategory Selector */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Select 
                value={selectedSubCategory} 
                onValueChange={setSelectedSubCategory}
                disabled={!selectedRootCategory}
              >
                <SelectTrigger className="border-slate-200 focus:border-blue-400 transition-colors disabled:opacity-50">
                  <SelectValue placeholder="Select subcategory" />
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubCategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Products Carousel */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                Featured Products ({filteredProducts.length})
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <Card className="border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardContent className="p-3">
                      {/* Product Image Placeholder */}
                      <div className="w-full h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-2 flex items-center justify-center group-hover:from-blue-50 group-hover:to-purple-50 transition-colors duration-200">
                        <ShoppingBag className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      
                      <h4 className="font-medium text-xs text-slate-800 line-clamp-2 mb-1">
                        {product.name}
                      </h4>
                      
                      <p className="text-sm font-semibold text-blue-600">
                        {product.price}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            {(selectedRootCategory || selectedSubCategory) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-center"
              >
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  View all products in this category →
                </button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
