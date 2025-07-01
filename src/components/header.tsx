"use client";
import { PanelLeftOpen, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useMockData, { collection } from "@/hooks/useMockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface HeaderProps {
  sidebarFixed: boolean;
  setSidebarFixed: Function;
  hovering: boolean;
  setHovering: Function;
}

const Header = ({
  sidebarFixed,
  setSidebarFixed,
  hovering,
  setHovering,
}: HeaderProps) => {
  const { collections } = useMockData();
  

  return (
    <div className="h-14 w-full bg-white border-b border-gray-200 flex justify-between items-center px-4 transition-all duration-500">
      <div className="flex items-center gap-4">
        <div onMouseEnter={() => !sidebarFixed && setHovering(true)}>
          <button
            onClick={() => {
              setSidebarFixed(!sidebarFixed);
              setHovering(false);
            }}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <PanelLeftOpen className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-100">
                    Table
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Select Table</TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-40 bg-white shadow-lg rounded-md border border-gray-200" align="end">
              {collections?.map((collection: any) => (
                <DropdownMenuItem key={collection.Id} className="text-gray-700 hover:bg-gray-100 cursor-pointer">
                  {collection.Name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
