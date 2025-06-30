import { useEffect, useState } from "react";

export type collection = {
  "Name" : string,
  "Id": string
}

export type collections = {
  collections: [collection]
};

export type tableData = {
  columns: [],
  results: []
}


function useMockData() {
  const [collections, setCollections] = useState<any>(null)
  const [tableData, setTableData ] = useState<any>(null)
  const [error, setError] = useState<string | null>(null);

  const fetchTableData = async () => {
      try {
        const response = await fetch("/tableData.json");
        const result = await response.json();
        setTableData(result as tableData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    const fetchCollections = async () => {
      try {
        const response = await fetch("/collections.json");
        const result = await response.json();
        setCollections(result as collections);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

  useEffect(() => {
    
    fetchCollections();
    fetchTableData();

  }, []);

  return { collections, tableData, error };
}

export default useMockData;
