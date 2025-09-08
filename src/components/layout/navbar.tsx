"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Search,
  Menu,
  Building2
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatePresence } from "framer-motion";
import ProfileDropdown from "./profile-dropdown";

// Logo Component
const Logo = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center space-x-2 cursor-pointer"
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
      <Building2 className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Marketplace
    </span>
  </motion.div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  
  // Mock user state - replace with your auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-border/50 shadow-lg" 
          : "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ y: -1 }}>
              <a 
                href="/dashboard" 
                className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
              >
                Dashboard
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"
                  layoutId="navbar-underline"
                />
              </a>
            </motion.div>
            
            <motion.div whileHover={{ y: -1 }}>
              <a 
                href="/products" 
                className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
              >
                Products
                <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
              </a>
            </motion.div>
            
            <motion.div whileHover={{ y: -1 }}>
              <a 
                href="/analytics" 
                className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
              >
                Analytics
                <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
              </a>
            </motion.div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Input
                      placeholder="Search..."
                      className="w-full pl-4 pr-10 bg-muted/50 border-border/50 focus:border-blue-400"
                      autoFocus
                      onBlur={() => setSearchOpen(false)}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

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

            {/* Mobile Sheet Menu */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
              </SheetTrigger>

              <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-l border-border/50"
              >
                <SheetHeader className="border-b border-border/20 pb-4">
                  <SheetTitle className="text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Marketplace
                      </span>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="text-left text-muted-foreground">
                    Navigate through your marketplace
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Input
                      placeholder="Search..."
                      className="w-full pl-4 pr-10 bg-muted/30 border-border/50 focus:border-blue-400"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-2">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a 
                        href="/dashboard" 
                        className="block py-3 px-4 text-lg font-medium hover:bg-muted/50 rounded-lg transition-colors"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        Dashboard
                      </a>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a 
                        href="/products" 
                        className="block py-3 px-4 text-lg font-medium hover:bg-muted/50 rounded-lg transition-colors"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        Products
                      </a>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a 
                        href="/analytics" 
                        className="block py-3 px-4 text-lg font-medium hover:bg-muted/50 rounded-lg transition-colors"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        Analytics
                      </a>
                    </motion.div>
                  </nav>

                  {/* Profile Section for mobile */}
                  {isLoggedIn ? (
                    <div className="border-t border-border/20 pt-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground px-4">Account</h3>
                        <ProfileDropdown />
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-border/20 pt-6">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => setMobileSheetOpen(false)}
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
