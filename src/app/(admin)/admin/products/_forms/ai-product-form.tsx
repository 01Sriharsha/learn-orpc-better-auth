"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface AIProductFormProps {
  form: UseFormReturn<z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>>;
}

export default function AIProductForm({ form }: AIProductFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Product Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Specific details for AI products including ratings, certifications, and special offers
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Include Details Toggle */}
          <FormField
            control={form.control}
            name="aiProductDetails.includeDetails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Include AI Details</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Enable enhanced AI product information display
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

          {/* Basic AI Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="aiProductDetails.rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="4.5"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aiProductDetails.reviewCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Count</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="123"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Taglines */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="aiProductDetails.tagline1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Primary marketing message" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aiProductDetails.tagline2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Secondary marketing message" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Special Features */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              Special Features
              <Badge variant="secondary">Optional</Badge>
            </h4>

            {/* Claimable */}
            <FormField
              control={form.control}
              name="aiProductDetails.isClaimable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Claimable Product</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Allow users to claim this product
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

            {/* Startup Offer */}
            <FormField
              control={form.control}
              name="aiProductDetails.showStartupOffer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Startup Offer</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Display special offers for startups
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

            {/* Special Offer */}
            <FormField
              control={form.control}
              name="aiProductDetails.showSpecialOffer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Special Offer</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Display limited-time offers
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

            {/* Trial */}
            <FormField
              control={form.control}
              name="aiProductDetails.showStartTrial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Start Trial</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Enable trial start button
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

            {/* Demo */}
            <FormField
              control={form.control}
              name="aiProductDetails.showBookDemo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Book Demo</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Enable demo booking button
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

            {/* Quote */}
            <FormField
              control={form.control}
              name="aiProductDetails.showQuote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Request Quote</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Enable quote request button
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

            {/* Callback */}
            <FormField
              control={form.control}
              name="aiProductDetails.showCallBack"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Request Callback</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Enable callback request button
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

            {/* Chat */}
            <FormField
              control={form.control}
              name="aiProductDetails.showChat"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Live Chat</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Enable live chat button
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

            {/* Discount */}
            <FormField
              control={form.control}
              name="aiProductDetails.showDiscount"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Special Discount</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Display discount information
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

            {/* Webinar */}
            <FormField
              control={form.control}
              name="aiProductDetails.showWebinar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Webinar</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Enable webinar registration
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
          </div>

          {/* Solid Dot Color */}
          <FormField
            control={form.control}
            name="aiProductDetails.solidDotColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Color (Hex)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="#000000"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
