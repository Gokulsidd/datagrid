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

export default function Home() {
  const { isHeaderVisible, toggleHeader } = useHeaderStore();

  return (
    <main className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center w-full px-6 py-1 h-12 border-b border-gray-200">
        <section className="flex gap-2 items-center ">
          <AiOutlineDatabase size={16} />
          <p className="text-slate-700">dfxapp/documents</p>
        </section>
    
        <section className="flex gap-3 items-center text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <RefreshCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Reload data</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleHeader()}
              >
                {isHeaderVisible ? <IoChevronUp />  : <IoChevronDown  />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isHeaderVisible ? "Hide header" : "Show header"}
            </TooltipContent>
          </Tooltip>
        </section>
      </div>
      <div className="w-full h-full justify-center items-center">
        {/* <Grid data={data}></Grid> */}
        <DataTable />
      </div>
    </main>
  );
}
