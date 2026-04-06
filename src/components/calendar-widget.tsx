"use client"
import { useState, useMemo } from "react"
import { Calendar as CalendarIcon, Plus, Clock, Tag, ExternalLink, CalendarDays, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useData } from "@/lib/data-context"
import { useEffect } from "react"

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { he } from 'date-fns/locale'
import "react-big-calendar/lib/css/react-big-calendar.css"
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import "./calendar-overrides.css"

const locales = { 'he': he }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })
const DnDCalendar = withDragAndDrop(Calendar)

export function CalendarWidget() {
  const { events, addEvent, deleteEvent, updateEvent, tasks, updateTask } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [title, setTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [color, setColor] = useState("bg-blue-500")
  const [recurrence, setRecurrence] = useState("none")
  
  const [droppingTaskId, setDroppingTaskId] = useState<string | null>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [view, setView] = useState<any>(Views.MONTH)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(true)
  }
  const handleDragLeave = () => setIsDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    const taskId = e.dataTransfer.getData("taskId")
    if (!taskId) return;
    const taskObj = tasks.find(t => t.id === taskId)
    if (taskObj) {
       setTitle(taskObj.title)
       setTopic("משימות כלליות")
       setColor(taskObj.color) // Keep tailwind format exactly
       setDroppingTaskId(taskId)
       const now = new Date()
       const d = now.toISOString().split("T")[0]
       setDate(d); setEndDate(d)
       setStartTime(now.toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' }))
       setIsDialogOpen(true)
    }
  }

  const handleAddEvent = () => {
    if (!title || !date || !startTime) return;
    
    if (droppingTaskId) {
       updateTask(droppingTaskId, { isScheduled: true })
    }

    // Auto-stretch end time if none provided
    let finalEnd = `${date}T${startTime}`
    if (endTime) {
       finalEnd = `${endDate || date}T${endTime}`
    } else {
       // Append 1 hour explicitly
       const parsedStart = new Date(`${date}T${startTime}`);
       parsedStart.setHours(parsedStart.getHours() + 1);
       const stretchH = parsedStart.getHours().toString().padStart(2, '0');
       const stretchM = parsedStart.getMinutes().toString().padStart(2, '0');
       finalEnd = `${date}T${stretchH}:${stretchM}`;
    }

    if (editingEventId && updateEvent) {
       updateEvent(editingEventId, {
         title,
         topic: topic || "כללי",
         start: `${date}T${startTime}`,
         end: finalEnd,
         color: color || '#3b82f6'
       })
    } else {
       addEvent({
         id: crypto.randomUUID(),
         title,
         topic: topic || "כללי",
         start: `${date}T${startTime}`,
         end: finalEnd,
         // if color is still just `#3b82f6` or a native tailwind string like `bg-rose-500`, we pass it:
         color: color || '#3b82f6',
         isTask: !!droppingTaskId,
         taskId: droppingTaskId || undefined
       })
    }
    
    setTitle(""); setTopic(""); setDate(""); setEndDate(""); setStartTime(""); setEndTime(""); setDroppingTaskId(null); setEditingEventId(null);
    setRecurrence("none")
    setIsDialogOpen(false)
  }

  // Handle mobile drop via custom event
  useEffect(() => {
    const handleTouchDrop: EventListener = (e) => {
      const customEvent = e as CustomEvent;
      const taskObj = customEvent.detail?.task;
      
      if (taskObj) {
         setTitle(taskObj.title)
         setTopic("משימות כלליות")
         setColor(taskObj.color)
         setDroppingTaskId(taskObj.id)
         const now = new Date()
         const d = now.toISOString().split("T")[0]
         setDate(d); setEndDate(d)
         setStartTime(now.toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' }))
         setIsDialogOpen(true)
      }
    }
    
    // Attach listener to window so it catches the dispatched event bubbling up
    window.addEventListener('tot:dropFromTouch', handleTouchDrop);
    return () => window.removeEventListener('tot:dropFromTouch', handleTouchDrop);
  }, [events]);

  // Convert custom events to react-big-calendar format
  const mappedEvents = useMemo(() => {
     return events.map(ev => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
        resource: ev
     }))
  }, [events])

  const twColors: Record<string, string> = {
    'bg-blue-500': '#3b82f6',
    'bg-purple-500': '#a855f7',
    'bg-rose-500': '#f43f5e',
    'bg-emerald-500': '#10b981',
    'bg-amber-500': '#f59e0b'
  }

  const exportToGoogle = (event: typeof events[0]) => {
     const dStart = new Date(event.start).toISOString().replace(/-|:|\.\d\d\d/g,"")
     const dEnd = new Date(event.end).toISOString().replace(/-|:|\.\d\d\d/g,"")
     window.open(`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(event.title)}&dates=${dStart}/${dEnd}`, '_blank')
  }

  const CustomEvent = ({ event }: any) => {
     return (
        <div className="flex flex-col text-xs px-1 overflow-hidden h-full truncate w-full">
           <span className="font-bold truncate w-full">{event.title}</span>
        </div>
     )
  }

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate('PREV')
    const goToNext = () => toolbar.onNavigate('NEXT')
    const goToCurrent = () => toolbar.onNavigate('TODAY')

    const handleMonthChange = (e: any) => {
      const newDate = new Date(toolbar.date)
      newDate.setMonth(parseInt(e.target.value))
      toolbar.onNavigate('DATE', newDate)
    }

    const handleYearChange = (e: any) => {
      const newDate = new Date(toolbar.date)
      newDate.setFullYear(parseInt(e.target.value))
      toolbar.onNavigate('DATE', newDate)
    }

    const m = toolbar.date.getMonth()
    const y = toolbar.date.getFullYear()

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 bg-card border rounded-2xl p-2 w-full shadow-sm">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl shrink-0">
           <button onClick={goToCurrent} className="px-3 py-1 text-sm font-bold bg-background rounded-lg shadow-sm">להיום</button>
           <button onClick={goToBack} className="px-3 py-1 text-sm font-bold hover:bg-background rounded-lg">הקודם</button>
           <button onClick={goToNext} className="px-3 py-1 text-sm font-bold hover:bg-background rounded-lg">הבא</button>
        </div>
        
        <div className="flex flex-col items-center">
           <span className="font-bold text-lg hidden md:block">{toolbar.label}</span>
           <div className="flex gap-2">
             <select value={m} onChange={handleMonthChange} className="bg-muted px-2 py-1 rounded-md text-sm border-none outline-none font-bold cursor-pointer">
               {Array.from({length: 12}).map((_, i) => <option key={i} value={i}>{format(new Date(2025, i, 1), 'MMMM', {locale: he})}</option>)}
             </select>
             <select value={y} onChange={handleYearChange} className="bg-muted px-2 py-1 rounded-md text-sm border-none outline-none font-bold cursor-pointer">
               {[2024, 2025, 2026, 2027, 2028, 2029].map(year => <option key={year} value={year}>{year}</option>)}
             </select>
           </div>
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl shrink-0">
           {toolbar.views.map((v: string) => (
             <button 
               key={v} 
               onClick={() => toolbar.onView(v)} 
               className={`px-3 py-1 text-sm font-bold rounded-lg transition-colors ${toolbar.view === v ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-background'}`}
             >
               {toolbar.localizer.messages[v]}
             </button>
           ))}
        </div>
      </div>
    )
  }

  const [currentDate, setCurrentDate] = useState(new Date())

  return (
    <div 
       onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
       className="w-full bg-card rounded-3xl p-4 md:p-6 border shadow-sm flex flex-col relative h-[700px] overflow-hidden"
    >
      {isDragOver && (
         <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-50 rounded-3xl flex items-center justify-center font-bold text-2xl text-primary pointer-events-none border-4 border-primary border-dashed">
            שחרר כאן את המשימה לשריון זמנים...
         </div>
      )}

      <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
             <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">לוח זמנים חכם</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if(!o) { setDroppingTaskId(null); setEditingEventId(null); } }}>
          <DialogTrigger>
            <Button className="rounded-full shadow-md font-bold gap-2" onClick={(e) => { e.preventDefault(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" /> הוסף מועד
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
             {/* ... Dialog content remains the same */}
            <DialogHeader>
              <DialogTitle className="text-xl">הוספת לו"ז חדש במדויק</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">כותרת:</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="למשל: שיעור סטטיסטיקה..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-muted-foreground">תאריך התחלה:</label>
                   <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-muted-foreground">שעת התחלה:</label>
                   <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-muted-foreground">תאריך סיום (אופציה):</label>
                   <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-muted-foreground">שעת סיום (אופציה):</label>
                   <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                 <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><RefreshCw className="w-3 h-3"/> חזרתיות</label>
                   <select 
                      value={recurrence} 
                      onChange={(e) => setRecurrence(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                   >
                       <option value="none" className="bg-card">ללא חזרה</option>
                       <option value="daily" className="bg-card">כל יום</option>
                       <option value="weekly" className="bg-card">כל שבוע</option>
                   </select>
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-muted-foreground">צבע שיוך:</label>
                   <Input type="color" value={color.startsWith('bg') ? '#3b82f6' : color} onChange={e => setColor(e.target.value)} className="w-full h-9 p-0.5" />
                 </div>
              </div>
            </div>
            <Button onClick={handleAddEvent} className="w-full font-bold">{editingEventId ? "עדכן שינויים" : "שמור מועד ביומן"}</Button>
            {editingEventId && (
              <Button onClick={() => { deleteEvent(editingEventId); setIsDialogOpen(false); setEditingEventId(null); }} variant="destructive" className="w-full font-bold gap-2 mt-2">
                 מחק אירוע לגמרי
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-hidden" dir="ltr">
         <DnDCalendar
           localizer={localizer}
           events={mappedEvents}
           startAccessor={(e: any) => e.start}
           endAccessor={(e: any) => e.end}
           date={currentDate}
           onNavigate={(newDate) => setCurrentDate(newDate)}
           view={view}
           onView={(v) => setView(v)}
           views={['month', 'week', 'day']}
           components={{ event: CustomEvent, toolbar: CustomToolbar }}
           rtl={true}
           min={new Date(2025, 0, 1, 6, 0, 0)}
           resizable
           selectable
           onEventDrop={(data: any) => {
             const { event, start, end } = data
             if(updateEvent) {
                 // Convert JS Date back to string for saving
                 updateEvent(event.resource.id, { 
                     start: start.toISOString(), 
                     end: end.toISOString() 
                 })
             }
           }}
           onEventResize={(data: any) => {
             const { event, start, end } = data
             if(updateEvent) {
                 updateEvent(event.resource.id, { 
                     start: start.toISOString(), 
                     end: end.toISOString() 
                 })
             }
           }}
           culture="he"
           formats={{
             timeGutterFormat: (date: Date, cul: any, loc: any) => loc.format(date, 'HH:mm', cul),
             eventTimeRangeFormat: ({ start, end }: any, cul: any, loc: any) => 
               `${loc.format(start, 'HH:mm', cul)} - ${loc.format(end, 'HH:mm', cul)}`,
             agendaTimeRangeFormat: ({ start, end }: any, cul: any, loc: any) => 
               `${loc.format(start, 'HH:mm', cul)} - ${loc.format(end, 'HH:mm', cul)}`,
             agendaDateFormat: (date: Date, cul: any, loc: any) => loc.format(date, 'dd/MM/yyyy', cul),
             dayFormat: (date: Date, cul: any, loc: any) => loc.format(date, 'EEEEEE dd/MM', cul) /* Short week name */
           }}
           eventPropGetter={(event: any) => {
             const rc = event.resource.color || '#3b82f6';
             const finalBg = rc.startsWith('bg-') ? (twColors[rc] || '#3b82f6') : rc;
             return {
               style: {
                 backgroundColor: finalBg,
                 border: 'none',
                 borderRadius: '6px',
                 opacity: 0.9,
                 color: '#fff',
                 padding: '2px',
                 display: 'block'
               }
             }
           }}
           onSelectEvent={(event: any) => {
              setTitle(event.title)
              setTopic(event.resource.topic || "כללי")
              setColor(event.resource.color || "#3b82f6")
              
              const startDt = new Date(event.start)
              setDate(startDt.toISOString().split("T")[0])
              setStartTime(startDt.toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' }))
              
              const endDt = new Date(event.end)
              setEndDate(endDt.toISOString().split("T")[0])
              setEndTime(endDt.toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' }))
              
              setEditingEventId(event.resource.id)
              setIsDialogOpen(true)
           }}
           messages={{
             next: "הבא",
             previous: "הקודם",
             today: "להיום",
             month: "חודש",
             week: "שבוע",
             day: "יומי",
             agenda: "סדר יום",
             date: "תאריך",
             time: "שעה",
             event: "אירוע",
             noEventsInRange: "אין אירועים.",
             showMore: (total) => `+ עוד ${total}`
           }}
           className="font-sans"
         />
      </div>
    </div>
  )
}
