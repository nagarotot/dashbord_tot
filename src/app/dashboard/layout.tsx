import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { PomodoroTimer } from "@/components/pomodoro-timer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen relative">
        <AppSidebar />
        <main className="flex-1 w-full bg-muted/10 h-full flex flex-col p-4">
          <SidebarTrigger className="w-10 h-10 -mr-2 mb-4 shrink-0 shadow-sm border bg-background" />
          <div className="flex flex-1 rounded-xl bg-background border p-4 shadow-sm w-full relative">
            {children}
            <PomodoroTimer />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
