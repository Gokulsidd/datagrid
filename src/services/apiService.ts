import axios from "axios";
import { useDataStore } from "@/store/useDataStore";

const getApiInstance = () => {
  const { configs } = useDataStore.getState();
  return axios.create({
    baseURL: configs?.NEXT_PUBLIC_API_URL || "",
  });
};

export const getTableCollections = () => {
  const api = getApiInstance();
  const { configs } = useDataStore.getState();
  const endpoint =
    configs?.GET_TABLE_COLLECTIONS_ENDPOINT || "/collections.json";
  return api.get(endpoint);
};

export const getTableData = (tableName: string = "log") => {
  const api = getApiInstance();
  const { configs } = useDataStore.getState();
  const endpoint = configs?.GET_TABLE_DATA_ENDPOINT || "/tableData.json";
  return api.get(`${endpoint}?table=${tableName}`);
};
