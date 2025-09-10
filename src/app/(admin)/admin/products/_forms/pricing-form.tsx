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

import { CreateProductSchema, UpdateProductSchema } from "@/schemas/product";

interface PricingFormProps {
  form: UseFormReturn<z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>>;
}

const currencies = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
] as const;

export default function PricingForm({ form }: PricingFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure pricing details for this product
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Starting Price Toggle */}
          <FormField
            control={form.control}
            name="pricing.isStartingPrice"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Starting Price</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Show "Starting from" before the price
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

          {/* Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="pricing.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pricing.currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price Text */}
          <FormField
            control={form.control}
            name="pricing.priceText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Text</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., per month, per user, one-time, etc."
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground">
                  Additional text to display with the price
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button Text & Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pricing.btnText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Get Started" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing.btnLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/signup"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Free Demo Toggle */}
          <FormField
            control={form.control}
            name="pricing.hasFreeDemo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Free Demo Available</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Offer a free demo option
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

          {/* Free Demo Link */}
          {form.watch("pricing.hasFreeDemo") && (
            <FormField
              control={form.control}
              name="pricing.freeDemoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Demo Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/demo"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Pricing Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Pricing Best Practices</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Use clear, descriptive button text like "Get Started" or "Buy Now"</li>
              <li>• Include pricing period in price text (per month, per year, etc.)</li>
              <li>• Test your pricing and demo links before publishing</li>
              <li>• Consider offering a free demo to increase conversions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
