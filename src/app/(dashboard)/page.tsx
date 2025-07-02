"use client";
import Grid from "@/components/handson-table/dataGrid";
import { data } from "./data";
import { AiOutlineDatabase } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, RefreshCcw, Search } from "lucide-react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useHeaderStore } from "@/store/useHeaderStore";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/data-table";
import { useState } from "react";

export default function Home() {
  const { isHeaderVisible, toggleHeader } = useHeaderStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="flex flex-col w-full h-full bg-gray-50">
      <div className="flex justify-between items-center w-full px-6 py-2 h-14 border-b border-gray-200 bg-white">
        <section className="flex gap-2 items-center text-gray-700 font-medium">
          <AiOutlineDatabase size={18} className="text-gray-500" />
          <p>dfxapp/documents</p>
        </section>
    
        <section className="flex gap-4 items-center">
          <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-3 py-1 rounded-md border border-gray-300  text-sm w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent  side="bottom">Reload data</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleHeader()}
                className="text-gray-500 hover:bg-gray-100"
              >
                {isHeaderVisible ? <IoChevronUp className="w-4 h-4" />  : <IoChevronDown className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isHeaderVisible ? "Hide header" : "Show header"}
            </TooltipContent>
          </Tooltip>
        </section>
      </div>
      <div className="w-full h-full">
        <DataTable searchQuery={searchQuery} />
      </div>
    </main>
  );
}
