"use client";

import { motion } from "framer-motion";
import { Bell, Menu } from "lucide-react";

import ProfileDropdown from "@/components/layout/profile-dropdown"; // Adjust import path as needed
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orpcQC } from "@/lib/orpc/orpc.client";
import { useQuery } from "@tanstack/react-query";

export default function NavbarActions() {
  const { data: response } = useQuery(orpcQC.auth.me.queryOptions());
  const user = response?.data;

  const isLoggedIn = !!user;

  return (
    <div className="flex items-center space-x-4">
      {isLoggedIn ? (
        <>
          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-blue-600 to-purple-600">
                3
              </Badge>
            </Button>
          </motion.div>

          {/* Profile Dropdown - Desktop */}
          <div className="hidden md:block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileDropdown />
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hidden sm:flex">
            Sign In
          </Button>
        </motion.div>
      )}
    </div>
  );
}
