"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  Cpu, 
  Car, 
  HardDrive, 
  Smartphone, 
  Search, 
  Bell, 
  Menu,
  X,
  Bot,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SearchBar from "@/components/ui/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Intelligence", href: "/dashboard/ai", icon: Bot },
  { name: "Developer & Intelligence", href: "/categories/1", icon: Layers },
  { name: "Physical AI & Robotics", href: "/categories/2", icon: Cpu },
  { name: "Mobility & SDV", href: "/categories/3", icon: Car },
  { name: "Edge & Hardware", href: "/categories/4", icon: HardDrive },
  { name: "Mobile & Electronics", href: "/categories/5", icon: Smartphone },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:flex flex-col border-r border-white/10 glass-panel z-40"
          >
            <div className="h-16 flex items-center px-6 border-b border-white/10">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">TechIntel</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                Menu
              </div>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                      {item.name}
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active" 
                          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="glass-card p-4 rounded-xl bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-xs font-medium text-success">System Online</span>
                </div>
                <p className="text-xs text-muted-foreground">Last updated: 2 mins ago</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex">
              <Menu className="w-5 h-5" />
            </Button>
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 border border-white/10 cursor-pointer hover:ring-2 ring-primary/50 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>TI</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel border-white/10">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5" asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
