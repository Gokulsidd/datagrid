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
    <div className="h-14 w-full border-b border-gray-200 flex justify-between gap-4 items-center px-3 pr-6 transition-all duration-500">
      <div onMouseEnter={() => !sidebarFixed && setHovering(true)}>
        <button
          onClick={() => {
            setSidebarFixed(!sidebarFixed);
            setHovering(false);
          }}
          className="bg-white p-2 rounded-md border border-gray-200 cursor-pointer"
        >
          <PanelLeftOpen className="w-5 h-5 text-accent-foreground" />
        </button>
      </div>
      <div className="flex items-center">
        <div className="flex mx-4 gap-1">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="text-slate-700 ">
                    Table
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Select Table</TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-40" align="end">
              {collections?.map((collection: any) => (
                <DropdownMenuItem key={collection.Id}>
                  {collection.Name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
