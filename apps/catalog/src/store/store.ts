/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import CatalogApis from "../api/catalogApis";
import { message } from "antd";

export type CatalogItem = {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string[];
};

interface BearState {
  setIsLoading: any;
  catalogs: CatalogItem[];
  fetchApi: () => void;
  isLoading: boolean;
  deleteCatalog: (id: number) => void;
  addCatalog: (data: Omit<CatalogItem, "key">) => void;
  editCatalog: (id: number, data: Omit<CatalogItem, "key">) => void;
  // fetchOneCatalog: (id: number) => void;
}

const useMyStore = create<BearState>((set, get) => ({
  catalogs: (window as any).yayCatalogData.initialCatalogs,
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  fetchApi: async () => {
    try {
      set({ isLoading: true });
      const result = await CatalogApis.get();
      set({
        catalogs: result,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  addCatalog: async (data) => {
    try {
      set({ isLoading: true });
      await CatalogApis.add(data).then((response: any) => {
        message.success({
          content: response.message,
          style: { marginTop: "50px" },
          duration: 2,
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
    get().fetchApi();
  },
  editCatalog: async (id: number, data) => {
    try {
      set({ isLoading: true });
      await CatalogApis.edit(id, data).then((response: any) => {
        message.success({
          content: response.message,
          style: { marginTop: "50px" },
          duration: 2,
        });
      }); //check response error -> not fetch
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
    get().fetchApi();
  },
  deleteCatalog: async (id: number) => {
    try {
      set({ isLoading: true });
      await CatalogApis.delete(Number(id));
      //check response error -> not fetch
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
    get().fetchApi();
  },
}));

export default useMyStore;
