import { create } from "zustand";
import { getTableCollections, getTableData } from "@/services/apiService";
import { devtools } from "zustand/middleware";

interface DataState {
  tableCollections: any;
  tableData: any;
  isLoading: boolean;
  error: Error | null;
  configs: Record<string, any>;
  setConfigs: (configs: Record<string, any>) => void;
  fetchTableCollections: () => Promise<void>;
  fetchTableData: (tableName: string) => Promise<void>;
}

export const useDataStore = create<DataState>()(
  devtools(
    (set) => ({
      tableCollections: null,
      tableData: null,
      isLoading: false,
      error: null,
      configs: {},

      setConfigs: (configs) => set({ configs }),

      fetchTableCollections: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getTableCollections();
          set({ tableCollections: response.data, isLoading: false });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
        }
      },

      fetchTableData: async (tableName: string = "log") => {
        set({ isLoading: true, error: null });
        try {
          const response = await getTableData(tableName);
          set({ tableData: response.data, isLoading: false });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
        }
      },
    }),
    {
      name: "DataStore",
    }
  )
);