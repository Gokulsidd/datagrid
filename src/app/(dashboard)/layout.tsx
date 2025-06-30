"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/header";
import { useHeaderStore } from "@/store/useHeaderStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarFixed, setSidebarFixed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { isHeaderVisible } = useHeaderStore()
  

  useEffect(() => {
    setMounted(true);
  }, []);

  // prevent hydration mismatch
  if (!mounted) return null;

  const isSidebarVisible = sidebarFixed || hovering;

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      {isHeaderVisible && (
        <Header
          sidebarFixed={sidebarFixed}
          setSidebarFixed={setSidebarFixed}
          hovering={hovering}
          setHovering={setHovering}
        />
      )}

      {/* Sidebar - floated above content */}
      <div
        className={`fixed  -left-1 h-full z-50 transition-all duration-300 border-r border-gray-200
          ${isHeaderVisible ? "top-14" : "top-0"}
          ${isSidebarVisible ? "w-[264px]" : "w-0"}
          ${sidebarFixed ? "" : isSidebarVisible ? "shadow-2xl" : ""}
          overflow-hidden`}
        onMouseEnter={() => !sidebarFixed && setHovering(true)}
        onMouseLeave={() => !sidebarFixed && setHovering(false)}
      >
        <Sidebar />
      </div>

      {/* Main content - never shifts unless sidebar is fixed */}
      <div
        className={`relative ${sidebarFixed ? "pl-[260px]" : ""}`}
        onMouseEnter={() => {
          if (isSidebarVisible) {
            setHovering(false);
          }
        }}
      >
        <div className="mx-auto max-w-screen-2xl h-full">
          <main className="h-full flex flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
