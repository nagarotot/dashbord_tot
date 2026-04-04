"use client"

import { LogOut, LayoutDashboard, FolderPen, BookOpen, Settings, Calendar } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useData } from "@/lib/data-context"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { sysSettings } = useData()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const items = [
    { title: "סקירה כללית", url: "/dashboard", icon: LayoutDashboard },
    { title: "לוח משימות ולוז", url: "/dashboard/agenda", icon: Calendar },
    { title: "כל הסיכומים", url: "/dashboard/notes", icon: FolderPen },
    { title: "הקורסים שלי", url: "/dashboard/courses", icon: BookOpen },
    { title: "הגדרות חשבון", url: "/dashboard/settings", icon: Settings },
  ]

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="border-b p-4 min-h-[64px] flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg cursor-pointer">
            {sysSettings?.username ? sysSettings.username.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight">שלום, {sysSettings?.username || "Admin"}</span>
            <span className="text-xs text-muted-foreground">משתמש פרימיום</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>תפריט ראשי</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      isActive={isActive}
                      className="cursor-pointer"
                      onClick={() => router.push(item.url)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem className="mt-8">
                <ThemeToggle />
              </SidebarMenuItem>
              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                  <LogOut />
                  <span>התנתקות</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
