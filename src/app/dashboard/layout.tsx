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
      <div className="flex w-full min-h-[100dvh] relative overflow-hidden">
        <AppSidebar />
        <main className="flex-1 min-w-0 bg-muted/10 flex flex-col p-2 sm:p-4 overflow-x-hidden">
          <SidebarTrigger className="w-11 h-11 sm:w-10 sm:h-10 mb-3 shrink-0 shadow-sm border bg-background self-end" />
          <div className="flex flex-1 rounded-xl bg-background border p-3 sm:p-4 shadow-sm w-full relative overflow-y-auto overflow-x-hidden">
            {children}
            <PomodoroTimer />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
