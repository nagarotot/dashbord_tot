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
  useSidebar,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useData } from "@/lib/data-context"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { sysSettings } = useData()
  const { setOpenMobile, isMobile } = useSidebar()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    if (isMobile) setOpenMobile(false)
    router.push("/login")
  }

  const handleNav = (url: string) => {
    if (isMobile) setOpenMobile(false)
    router.push(url)
  }

  const items = [
    { title: "סקירה כללית", url: "/dashboard", icon: LayoutDashboard },
    { title: "לוח משימות ולוז", url: "/dashboard/agenda", icon: Calendar },
    { title: "כל הסיכומים", url: "/dashboard/notes", icon: FolderPen },
    { title: "הקורסים שלי", url: "/dashboard/courses", icon: BookOpen },
    { title: "הגדרות חשבון", url: "/dashboard/settings", icon: Settings },
  ]

  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarHeader className="border-b p-4 min-h-[64px] flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg cursor-pointer shrink-0">
            {sysSettings?.username ? sysSettings.username.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm leading-tight truncate">שלום, {sysSettings?.username || "Admin"}</span>
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
                      className="cursor-pointer py-3 text-base"
                      onClick={() => handleNav(item.url)}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem className="mt-8">
                <ThemeToggle />
              </SidebarMenuItem>
              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer py-3">
                  <LogOut className="w-5 h-5 shrink-0" />
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

