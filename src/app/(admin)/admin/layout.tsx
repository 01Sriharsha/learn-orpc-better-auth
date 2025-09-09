import { PropsWithChildren } from "react";
import Link from "next/link";
import { Shield, Home, Layers, Grid3x3, Package } from "lucide-react";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-1 ml-8">
                <Link 
                  href="/admin/sections"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  Sections
                </Link>
                <Link 
                  href="/admin/categories"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Grid3x3 className="h-4 w-4" />
                  Categories
                </Link>
                <Link 
                  href="/admin/products"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
              </nav>
            </div>
            
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-8">
        {children}
      </main>
    </div>
  );
}
