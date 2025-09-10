"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface EngagementBlockFormProps {
  form: UseFormReturn<z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>>;
}

const embedTypes = [
  { value: "LINK", label: "Link" },
  { value: "EMBEDDABLE", label: "Embeddable" },
  { value: "FILE", label: "File" },
] as const;

export default function EngagementBlockForm({ form }: EngagementBlockFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Block</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure engagement features to interact with potential customers
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="engagementBlock.showInfo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Info</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Display information section
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

            {form.watch("engagementBlock.showInfo") && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <h4 className="text-sm font-medium">Info Details</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="engagementBlock.infoDetails.infoType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Info Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {embedTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementBlock.infoDetails.info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Info Content</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Information content" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementBlock.infoDetails.infoText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Info Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Display text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementBlock.infoDetails.infoLinkButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Learn More" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Brochure Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="engagementBlock.showBrochure"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Brochure</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Display brochure download option
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

            {form.watch("engagementBlock.showBrochure") && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <h4 className="text-sm font-medium">Brochure Details</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="engagementBlock.brochureDetails.brochureType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brochure Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {embedTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementBlock.brochureDetails.brochureUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brochure URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/brochure.pdf" type="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="engagementBlock.showForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Form</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Display contact or lead form
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

            {form.watch("engagementBlock.showForm") && (
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <h4 className="text-sm font-medium">Form Details</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="engagementBlock.formDetails.formType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {embedTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementBlock.formDetails.formValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Value</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Form embed code or URL" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Calendar Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="engagementBlock.showCalendar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Calendar</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Display calendar booking option
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

            {form.watch("engagementBlock.showCalendar") && (
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <h4 className="text-sm font-medium">Calendar Details</h4>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="engagementBlock.calendarDetails.calendarLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calendar Link</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://calendly.com/your-link" type="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Badge Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="engagementBlock.showBadge"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Badge</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Display promotional badge
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

            {form.watch("engagementBlock.showBadge") && (
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <h4 className="text-sm font-medium">Badge Details</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="engagementBlock.badgeDetails.badgeText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="New, Featured, Hot, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engagementBlock.badgeDetails.badgeColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge Color</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="#ff0000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
