"use client";

import { motion } from "framer-motion";
import { Edit2, MoreVertical, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { ProductResponseSchema } from "@/schemas/product";

interface ProductCardProps {
  product: ProductResponseSchema;
  onEdit: (product: ProductResponseSchema) => void;
  onDelete: (productId: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = () => {
    onDelete(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <Card className="h-full border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white">
        {/* Admin Controls - Absolute positioned */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 right-3 z-10"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleEdit}
                className="cursor-pointer"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <CardHeader className="pb-3">
          <div className="space-y-2">
            {/* Product Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-slate-400 text-sm">No Image</div>
              )}
            </div>

            {/* Priority Badge */}
            <div className="flex justify-between items-start">
              <Badge 
                variant="outline" 
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                Priority: {product.priority}
              </Badge>
              {product.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600"
                  asChild
                >
                  <a href={product.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Product Name */}
            <div>
              <h3 className="font-semibold text-slate-900 text-lg leading-tight line-clamp-2">
                {product.name}
              </h3>
              {product.brandName && (
                <p className="text-sm text-slate-600 mt-1">
                  {product.brandName}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-slate-600 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Category and Section Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {product.section && (
                  <Badge variant="secondary" className="text-xs">
                    {product.section.slug}
                  </Badge>
                )}
                {product.category && (
                  <Badge variant="outline" className="text-xs">
                    {product.category.slug}
                  </Badge>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 text-xs">
              {product.hasPricing && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Has Pricing
                </Badge>
              )}
              {product.showVendor && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  Show Vendor
                </Badge>
              )}
              {product.engagementBlock && (
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                  Engagement
                </Badge>
              )}
            </div>

            {/* Industry */}
            {product.industry && (
              <div className="text-xs text-slate-500">
                Industry: {product.industry}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
