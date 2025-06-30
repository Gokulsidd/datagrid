'use client'

import Link from "next/link"
import { HomeIcon, FolderIcon, DatabaseIcon } from "lucide-react"
import DottedSeparator from "../dotted-separator"
import Navigation from "./navigation"

const Sidebar = () => {
    return (
        <aside className="h-full bg-white w-full min-w-[264px] p-2 px-4 text-sm z-50">
            <Navigation />
        </aside>
    )
}



export default Sidebar
