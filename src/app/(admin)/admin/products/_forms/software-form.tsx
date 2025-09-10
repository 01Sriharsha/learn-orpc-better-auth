"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Plus, Trash2, GripVertical } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CreateProductSchema, UpdateProductSchema } from "@/schemas/product";

interface SoftwareFormProps {
  form: UseFormReturn<z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>>;
}

export default function SoftwareForm({ form }: SoftwareFormProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "softwareDetails.softwarePlans",
  });

  const addSoftwarePlan = () => {
    append({
      name: "",
      priority: fields.length,
      features: [],
      id : ""
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Software Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure software-specific information including plans and features
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* View Link */}
          <FormField
            control={form.control}
            name="softwareDetails.viewLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>View Link</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/software-demo"
                    type="url"
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground">
                  Link to software demo or detailed view
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Software Plans */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Software Plans</h4>
                <p className="text-xs text-muted-foreground">
                  Configure different pricing plans or tiers
                </p>
              </div>
              <Button
                type="button"
                onClick={addSoftwarePlan}
                className="flex items-center gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Plan
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <div className="text-muted-foreground mb-4">
                  No software plans added yet
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSoftwarePlan}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Plan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Plan {index + 1}</span>
                            <Badge variant="outline">
                              {form.watch(`softwareDetails.softwarePlans.${index}.name`) || "Unnamed"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Plan Name */}
                        <FormField
                          control={form.control}
                          name={`softwareDetails.softwarePlans.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Plan Name *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Basic, Pro, Enterprise" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Priority */}
                        <FormField
                          control={form.control}
                          name={`softwareDetails.softwarePlans.${index}.priority`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Priority</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="0"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <div className="text-xs text-muted-foreground">
                                Lower numbers appear first
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Features */}
                      <FormField
                        control={form.control}
                        name={`softwareDetails.softwarePlans.${index}.features`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Features</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter features separated by commas"
                                onChange={(e) => {
                                  const features = e.target.value.split(',').map(f => f.trim()).filter(Boolean);
                                  field.onChange(features);
                                }}
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                              />
                            </FormControl>
                            <div className="text-xs text-muted-foreground">
                              Separate multiple features with commas
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Display current features */}
                      {Array.isArray(form.watch(`softwareDetails.softwarePlans.${index}.features`)) &&
                        form.watch(`softwareDetails.softwarePlans.${index}.features`).length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">Current Features:</div>
                            <div className="flex flex-wrap gap-1">
                              {form.watch(`softwareDetails.softwarePlans.${index}.features`).map((feature: string, featureIndex: number) => (
                                <Badge key={featureIndex} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {fields.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Software Plan Tips</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Use clear, descriptive plan names</li>
                <li>• Set priorities to control display order</li>
                <li>• Include key differentiating features</li>
                <li>• Keep feature descriptions concise</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
