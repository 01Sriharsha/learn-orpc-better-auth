"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { SectionSchema, SectionQueryParamsSchema } from "@/schemas/section";
import { PaginationResponseSchema } from "@/schemas";

interface SectionContextState {
  sections: SectionSchema[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: {
    keyword?: string;
    type?: string;
  };
  loading: boolean;
  selectedSection: SectionSchema | null;
  isDialogOpen: boolean;
  dialogMode: "create" | "update";
  hasInitialData: boolean; // Add this to track if we have server-side data
}

type SectionAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SECTIONS"; payload: { sections: SectionSchema[]; pagination: any } }
  | { type: "SET_FILTERS"; payload: { keyword?: string; type?: string } }
  | { type: "OPEN_DIALOG"; payload: { mode: "create" | "update"; section?: SectionSchema } }
  | { type: "CLOSE_DIALOG" }
  | { type: "ADD_SECTION"; payload: SectionSchema }
  | { type: "UPDATE_SECTION"; payload: SectionSchema }
  | { type: "DELETE_SECTION"; payload: string };

const initialState: SectionContextState = {
  sections: [],
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  },
  filters: {},
  loading: false,
  selectedSection: null,
  isDialogOpen: false,
  dialogMode: "create",
  hasInitialData: false,
};

function sectionReducer(state: SectionContextState, action: SectionAction): SectionContextState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    
    case "SET_SECTIONS":
      return {
        ...state,
        sections: action.payload.sections,
        pagination: action.payload.pagination,
        loading: false,
      };
    
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case "OPEN_DIALOG":
      return {
        ...state,
        isDialogOpen: true,
        dialogMode: action.payload.mode,
        selectedSection: action.payload.section || null,
      };
    
    case "CLOSE_DIALOG":
      return {
        ...state,
        isDialogOpen: false,
        selectedSection: null,
      };
    
    case "ADD_SECTION":
      return {
        ...state,
        sections: [action.payload, ...state.sections],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };
    
    case "UPDATE_SECTION":
      return {
        ...state,
        sections: state.sections.map(section =>
          section.id === action.payload.id ? action.payload : section
        ),
      };
    
    case "DELETE_SECTION":
      return {
        ...state,
        sections: state.sections.filter(section => section.id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };
    
    default:
      return state;
  }
}

interface SectionContextValue extends SectionContextState {
  dispatch: React.Dispatch<SectionAction>;
  setSections: (sections: SectionSchema[], pagination: any) => void;
  setFilters: (filters: { keyword?: string; type?: string }) => void;
  openDialog: (mode: "create" | "update", section?: SectionSchema) => void;
  closeDialog: () => void;
  addSection: (section: SectionSchema) => void;
  updateSection: (section: SectionSchema) => void;
  deleteSection: (sectionId: string) => void;
  setLoading: (loading: boolean) => void;
}

const SectionContext = createContext<SectionContextValue | undefined>(undefined);

export function SectionProvider({ children, initialSections, initialPagination }: {
  children: ReactNode;
  initialSections?: SectionSchema[];
  initialPagination?: any;
}) {
  const [state, dispatch] = useReducer(sectionReducer, {
    ...initialState,
    sections: initialSections || [],
    pagination: initialPagination || initialState.pagination,
    hasInitialData: !!(initialSections && initialSections.length > 0), // Set based on whether we have data
  });

  const contextValue: SectionContextValue = {
    ...state,
    dispatch,
    setSections: (sections, pagination) => {
      dispatch({ type: "SET_SECTIONS", payload: { sections, pagination } });
    },
    setFilters: (filters) => {
      dispatch({ type: "SET_FILTERS", payload: filters });
    },
    openDialog: (mode, section) => {
      dispatch({ type: "OPEN_DIALOG", payload: { mode, section } });
    },
    closeDialog: () => {
      dispatch({ type: "CLOSE_DIALOG" });
    },
    addSection: (section) => {
      dispatch({ type: "ADD_SECTION", payload: section });
    },
    updateSection: (section) => {
      dispatch({ type: "UPDATE_SECTION", payload: section });
    },
    deleteSection: (sectionId) => {
      dispatch({ type: "DELETE_SECTION", payload: sectionId });
    },
    setLoading: (loading) => {
      dispatch({ type: "SET_LOADING", payload: loading });
    },
  };

  return (
    <SectionContext.Provider value={contextValue}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSectionContext must be used within a SectionProvider");
  }
  return context;
}
