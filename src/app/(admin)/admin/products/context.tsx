"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { ProductResponseSchema } from "@/schemas/product";

interface ProductContextState {
  products: ProductResponseSchema[];
  sections: any[];
  categories: any[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: {
    keyword?: string;
    sectionId?: string;
    categoryId?: string;
  };
  loading: boolean;
  selectedProduct: ProductResponseSchema | null;
  isDialogOpen: boolean;
  dialogMode: "create" | "update";
  hasInitialData: boolean;
}

type ProductAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PRODUCTS"; payload: { products: ProductResponseSchema[]; pagination: any } }
  | { type: "SET_FILTERS"; payload: { keyword?: string; sectionId?: string; categoryId?: string } }
  | { type: "OPEN_DIALOG"; payload: { mode: "create" | "update"; product?: ProductResponseSchema } }
  | { type: "CLOSE_DIALOG" }
  | { type: "ADD_PRODUCT"; payload: ProductResponseSchema }
  | { type: "UPDATE_PRODUCT"; payload: ProductResponseSchema }
  | { type: "DELETE_PRODUCT"; payload: string };

const initialState: ProductContextState = {
  products: [],
  sections: [],
  categories: [],
  pagination: {
    total: 0,
    page: 1,
    pageSize: 50,
    totalPages: 0,
  },
  filters: {},
  loading: false,
  selectedProduct: null,
  isDialogOpen: false,
  dialogMode: "create",
  hasInitialData: false,
};

function productReducer(state: ProductContextState, action: ProductAction): ProductContextState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false,
        hasInitialData: true,
      };
    
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case "OPEN_DIALOG":
      return {
        ...state,
        isDialogOpen: true,
        dialogMode: action.payload.mode,
        selectedProduct: action.payload.product || null,
      };
    
    case "CLOSE_DIALOG":
      return {
        ...state,
        isDialogOpen: false,
        selectedProduct: null,
      };
    
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [action.payload, ...state.products],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };
    
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };
    
    default:
      return state;
  }
}

interface ProductContextValue {
  products: ProductResponseSchema[];
  sections: any[];
  categories: any[];
  pagination: ProductContextState["pagination"];
  filters: ProductContextState["filters"];
  loading: boolean;
  selectedProduct: ProductResponseSchema | null;
  isDialogOpen: boolean;
  dialogMode: "create" | "update";
  hasInitialData: boolean;
  setLoading: (loading: boolean) => void;
  setProducts: (products: ProductResponseSchema[], pagination: any) => void;
  setFilters: (filters: { keyword?: string; sectionId?: string; categoryId?: string }) => void;
  openDialog: (mode: "create" | "update", product?: ProductResponseSchema) => void;
  closeDialog: () => void;
  addProduct: (product: ProductResponseSchema) => void;
  updateProduct: (product: ProductResponseSchema) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ 
  children, 
  initialProducts = [], 
  initialPagination = initialState.pagination,
  initialSections = [],
  initialCategories = []
}: { 
  children: ReactNode;
  initialProducts?: ProductResponseSchema[];
  initialPagination?: ProductContextState["pagination"];
  initialSections?: any[];
  initialCategories?: any[];
}) {
  const [state, dispatch] = useReducer(productReducer, {
    ...initialState,
    products: initialProducts,
    sections: initialSections,
    categories: initialCategories,
    pagination: initialPagination,
    hasInitialData: initialProducts.length > 0,
  });

  const value: ProductContextValue = {
    ...state,
    setLoading: (loading) => {
      dispatch({ type: "SET_LOADING", payload: loading });
    },
    setProducts: (products, pagination) => {
      dispatch({ type: "SET_PRODUCTS", payload: { products, pagination } });
    },
    setFilters: (filters) => {
      dispatch({ type: "SET_FILTERS", payload: filters });
    },
    openDialog: (mode, product) => {
      dispatch({ type: "OPEN_DIALOG", payload: { mode, product } });
    },
    closeDialog: () => {
      dispatch({ type: "CLOSE_DIALOG" });
    },
    addProduct: (product) => {
      dispatch({ type: "ADD_PRODUCT", payload: product });
    },
    updateProduct: (product) => {
      dispatch({ type: "UPDATE_PRODUCT", payload: product });
    },
    deleteProduct: (productId) => {
      dispatch({ type: "DELETE_PRODUCT", payload: productId });
    },
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}
