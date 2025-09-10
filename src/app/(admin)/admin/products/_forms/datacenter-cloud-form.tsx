"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { CreateProductSchema, UpdateProductSchema } from "@/schemas/product";

interface DatacenterCloudFormProps {
  form: UseFormReturn<z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>>;
}

export default function DatacenterCloudForm({ form }: DatacenterCloudFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datacenter & Cloud Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Specific details for datacenter and cloud infrastructure products
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Selection */}
          <FormField
            control={form.control}
            name="datacenterCloudDetails.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Infrastructure Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DATA_CENTER">Data Center</SelectItem>
                    <SelectItem value="CLOUD">Cloud</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="EDGE">Edge Computing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Certifications */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              Certifications & Compliance
              <Badge variant="secondary">Optional</Badge>
            </h4>

            {/* AI Certified */}
            <FormField
              control={form.control}
              name="datacenterCloudDetails.isAiCertified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">AI Certified</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Certified for AI workloads
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* AI Certification Link */}
            {form.watch("datacenterCloudDetails.isAiCertified") && (
              <FormField
                control={form.control}
                name="datacenterCloudDetails.aiCertifiedLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Certification Link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com/ai-certification"
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Green Compatible */}
            <FormField
              control={form.control}
              name="datacenterCloudDetails.isGreenCompatible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Green Compatible</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Environmentally friendly infrastructure
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Green Certification Link */}
            {form.watch("datacenterCloudDetails.isGreenCompatible") && (
              <FormField
                control={form.control}
                name="datacenterCloudDetails.greenCompatibleLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Green Certification Link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com/green-certification"
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Features */}
          <FormField
            control={form.control}
            name="datacenterCloudDetails.features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Features</FormLabel>
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

          {/* Additional Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certifications Label/Link */}
            <FormField
              control={form.control}
              name="datacenterCloudDetails.certifications.label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., ISO 27001, SOC 2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datacenterCloudDetails.certifications.link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/certifications"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Locations */}
            <FormField
              control={form.control}
              name="datacenterCloudDetails.locations.label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locations Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Global, US, EU" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datacenterCloudDetails.locations.link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locations Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/locations"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services */}
            <FormField
              control={form.control}
              name="datacenterCloudDetails.services.label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Compute, Storage, Network" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datacenterCloudDetails.services.link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/services"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expertise */}
            <FormField
              control={form.control}
              name="datacenterCloudDetails.expertise.label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., AI/ML, Big Data" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datacenterCloudDetails.expertise.link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/expertise"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
