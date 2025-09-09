import { Metadata } from "next";
import { client } from "@/lib/orpc";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Categories Management | Admin Panel",
  description: "Manage and organize categories",
};

async function fetchCategories() {
  try {
    // Create params object without level to get all categories
    const params: any = {
      page: 1,
      pageSize: 50,
      keyword: "",
    };
    
    const response = await client.category.get(params);
    
    console.log("Server-side categories response:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return {
      data: {
        content: [],
        total: 0,
        page: 1,
        pageSize: 50,
        totalPages: 0,
      },
    };
  }
}

async function fetchSections() {
  try {
    const response = await client.section.get({
      page: 1,
      pageSize: 100,
      keyword: "",
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch sections:", error);
    return {
      data: {
        content: [],
        total: 0,
        page: 1,
        pageSize: 100,
        totalPages: 0,
      },
    };
  }
}

export default async function CategoriesPage() {
  const [categoriesData, sectionsData] = await Promise.all([
    fetchCategories(),
    fetchSections(),
  ]);

  return (
    <ClientPage 
      initialCategories={categoriesData.data?.content || []}
      initialPagination={{
        total: categoriesData.data?.total || 0,
        page: categoriesData.data?.page || 1,
        pageSize: categoriesData.data?.pageSize || 50,
        totalPages: categoriesData.data?.totalPages || 0,
      }}
      initialSections={sectionsData.data?.content || []}
    />
  );
}
