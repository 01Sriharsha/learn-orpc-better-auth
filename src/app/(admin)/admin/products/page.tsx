import { Metadata } from "next";
import { client } from "@/lib/orpc";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Products Management | Admin Panel",
  description: "Manage and organize products",
};

async function fetchProducts() {
  try {
    const response = await client.product.get({
      page: 1,
      pageSize: 50,
      keyword: "",
    });

    console.log("Server-side products response:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch products:", error);
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

async function fetchCategories() {
  try {
    const params: any = {
      page: 1,
      pageSize: 100,
      keyword: "",
    };

    const response = await client.category.get(params);
    return response;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
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

export default async function ProductsPage() {
  const [productsData, sectionsData, categoriesData] = await Promise.all([
    fetchProducts(),
    fetchSections(),
    fetchCategories(),
  ]);

  return (
    <ClientPage
      initialProducts={productsData.data?.content || []}
      initialPagination={{
        total: productsData.data?.total || 0,
        page: productsData.data?.page || 1,
        pageSize: productsData.data?.pageSize || 50,
        totalPages: productsData.data?.totalPages || 0,
      }}
      initialSections={sectionsData.data?.content || []}
      initialCategories={categoriesData.data?.content || []}
    />
  );
}
