"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
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

interface NetworkHardwareFormProps {
  form: UseFormReturn<z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>>;
}

export default function NetworkHardwareForm({ form }: NetworkHardwareFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Network & Hardware Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure specifications for network and hardware products
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model */}
          <FormField
            control={form.control}
            name="networkHardwareDetails.model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., RouterX-3000, SwitchPro-24P"
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground">
                  Specific model number or name of the hardware
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Features */}
          <FormField
            control={form.control}
            name="networkHardwareDetails.features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hardware Features</FormLabel>
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
                  Separate multiple features with commas (e.g., "24 ports, PoE+, Layer 3 routing")
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Display current features */}
          {Array.isArray(form.watch("networkHardwareDetails.features")) &&
            form.watch("networkHardwareDetails.features").length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Current Features:</div>
                <div className="flex flex-wrap gap-2">
                  {form.watch("networkHardwareDetails.features").map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Feature Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-amber-600 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900">Feature Guidelines</p>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              <li>• Include technical specifications (ports, power, speed)</li>
              <li>• Mention key capabilities (Layer 2/3, PoE, management)</li>
              <li>• Add form factor details (rack-mount, desktop, etc.)</li>
              <li>• Include compliance standards (IEEE, FCC, etc.)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example Features */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="text-sm font-medium text-slate-900 mb-2">Example Features:</div>
        <div className="text-sm text-slate-600 space-y-1">
          <div><strong>Switch:</strong> 24x 1GbE ports, 4x 10GbE SFP+, PoE+ 380W, Layer 3 routing</div>
          <div><strong>Router:</strong> Dual WAN, VPN support, 802.11ax WiFi 6, 4x Gigabit LAN</div>
          <div><strong>Firewall:</strong> 1Gbps throughput, IPS/IDS, VPN concentrator, HA support</div>
        </div>
      </div>
    </div>
  );
}
