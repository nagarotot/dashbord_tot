import { CalendarWidget } from "@/components/calendar-widget"
import { TaskBoard } from "@/components/task-board"

export default function AgendaPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 w-full h-full p-4">
      <div className="flex justify-between items-center border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">לוח משימות וזמנים</h1>
          <p className="text-muted-foreground mt-1 font-medium">נהל את היעדים שלך, שריין זמנים ביומן וייצא הכל ל-Google Calendar.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Task Board */}
        <div className="flex flex-col h-full section-wrapper">
          <TaskBoard />
        </div>

        {/* Calendar */}
        <div className="flex flex-col h-full section-wrapper">
          <CalendarWidget />
        </div>
      </div>
    </div>
  )
}
