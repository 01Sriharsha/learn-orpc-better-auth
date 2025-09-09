"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { CategoryWithRelationsSchema } from "@/schemas/category";

interface CategoryContextState {
  categories: CategoryWithRelationsSchema[];
  sections: any[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: {
    keyword?: string;
    level?: string; // 'all' | '0' | '1'
    sectionId?: string;
  };
  loading: boolean;
  selectedCategory: CategoryWithRelationsSchema | null;
  isDialogOpen: boolean;
  dialogMode: "create" | "update";
  hasInitialData: boolean;
}

type CategoryAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CATEGORIES"; payload: { categories: CategoryWithRelationsSchema[]; pagination: any } }
  | { type: "SET_FILTERS"; payload: { keyword?: string; level?: string; sectionId?: string } }
  | { type: "OPEN_DIALOG"; payload: { mode: "create" | "update"; category?: CategoryWithRelationsSchema } }
  | { type: "CLOSE_DIALOG" }
  | { type: "ADD_CATEGORY"; payload: CategoryWithRelationsSchema }
  | { type: "UPDATE_CATEGORY"; payload: CategoryWithRelationsSchema }
  | { type: "DELETE_CATEGORY"; payload: string };

const initialState: CategoryContextState = {
  categories: [],
  sections: [],
  pagination: {
    total: 0,
    page: 1,
    pageSize: 50,
    totalPages: 0,
  },
  filters: {
    level: "all", // Explicitly set to "all" to show all levels by default
  },
  loading: false,
  selectedCategory: null,
  isDialogOpen: false,
  dialogMode: "create",
  hasInitialData: false,
};

function categoryReducer(state: CategoryContextState, action: CategoryAction): CategoryContextState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload.categories,
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
        selectedCategory: action.payload.category || null,
      };
    
    case "CLOSE_DIALOG":
      return {
        ...state,
        isDialogOpen: false,
        selectedCategory: null,
      };
    
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [action.payload, ...state.categories],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };
    
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };
    
    default:
      return state;
  }
}

interface CategoryContextValue {
  categories: CategoryWithRelationsSchema[];
  sections: any[];
  pagination: CategoryContextState["pagination"];
  filters: CategoryContextState["filters"];
  loading: boolean;
  selectedCategory: CategoryWithRelationsSchema | null;
  isDialogOpen: boolean;
  dialogMode: "create" | "update";
  hasInitialData: boolean;
  setLoading: (loading: boolean) => void;
  setCategories: (categories: CategoryWithRelationsSchema[], pagination: any) => void;
  setFilters: (filters: { keyword?: string; level?: string; sectionId?: string }) => void;
  openDialog: (mode: "create" | "update", category?: CategoryWithRelationsSchema) => void;
  closeDialog: () => void;
  addCategory: (category: CategoryWithRelationsSchema) => void;
  updateCategory: (category: CategoryWithRelationsSchema) => void;
  deleteCategory: (categoryId: string) => void;
}

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

export function CategoryProvider({ 
  children, 
  initialCategories = [], 
  initialPagination = initialState.pagination,
  initialSections = []
}: { 
  children: ReactNode;
  initialCategories?: CategoryWithRelationsSchema[];
  initialPagination?: CategoryContextState["pagination"];
  initialSections?: any[];
}) {
  const [state, dispatch] = useReducer(categoryReducer, {
    ...initialState,
    categories: initialCategories,
    sections: initialSections,
    pagination: initialPagination,
    hasInitialData: initialCategories.length > 0,
  });

  const value: CategoryContextValue = {
    ...state,
    setLoading: (loading) => {
      dispatch({ type: "SET_LOADING", payload: loading });
    },
    setCategories: (categories, pagination) => {
      dispatch({ type: "SET_CATEGORIES", payload: { categories, pagination } });
    },
    setFilters: (filters) => {
      dispatch({ type: "SET_FILTERS", payload: filters });
    },
    openDialog: (mode, category) => {
      dispatch({ type: "OPEN_DIALOG", payload: { mode, category } });
    },
    closeDialog: () => {
      dispatch({ type: "CLOSE_DIALOG" });
    },
    addCategory: (category) => {
      dispatch({ type: "ADD_CATEGORY", payload: category });
    },
    updateCategory: (category) => {
      dispatch({ type: "UPDATE_CATEGORY", payload: category });
    },
    deleteCategory: (categoryId) => {
      dispatch({ type: "DELETE_CATEGORY", payload: categoryId });
    },
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return context;
}
