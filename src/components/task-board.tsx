"use client"
import { useState } from "react"
import { Plus, GripVertical, Trash2, Circle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useData, Task } from "@/lib/data-context"

import { useRouter } from "next/navigation"

export function TaskBoard() {
  const { tasks, addTask, updateTask, deleteTask, events, courses, reorderTasks, setActiveDraggedTask } = useData()
  const router = useRouter()
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [selectedColor, setSelectedColor] = useState("bg-blue-500")
  const [selectedCourse, setSelectedCourse] = useState("")

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null)
  
  // Mobile dragging state
  const [touchDragTask, setTouchDragTask] = useState<Task | null>(null)
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 })

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editCourse, setEditCourse] = useState("")
  const [editColor, setEditColor] = useState("")

  const openEdit = (t: typeof tasks[0]) => {
     setEditingTaskId(t.id)
     setEditTitle(t.title)
     setEditDesc(t.description || "")
     setEditCourse(t.courseId || "")
     setEditColor(t.color || "bg-blue-500")
  }
  
  const handleSaveEdit = () => {
     if(editingTaskId) {
        updateTask(editingTaskId, { title: editTitle, description: editDesc, courseId: editCourse || undefined, color: editColor })
        setEditingTaskId(null)
        
        setTimeout(() => {
           alert("המשימה עודכנה בהצלחה!")
           if (editCourse) {
              router.push(`/dashboard/courses/${editCourse}`)
           }
        }, 150)
     }
  }

  const colors = ["bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-emerald-500", "bg-amber-500"]

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle) return
    addTask({
      id: crypto.randomUUID(),
      title: newTaskTitle,
      color: selectedColor,
      isScheduled: false,
      courseId: selectedCourse || undefined
    })
    setNewTaskTitle("")
    setSelectedCourse("")
  }

  const getStatus = (taskId: string) => {
     const ev = events.find(e => e.taskId === taskId)
     if (!ev) return { label: "ללא תאריך", color: "bg-gray-200 text-gray-700" }
     
     const end = new Date(ev.end)
     const now = new Date()
     const diffDays = (end.getTime() - now.getTime()) / (1000 * 3600 * 24)
     
     if (diffDays < 0) return { label: "איחור מתמשך", color: "bg-red-100 text-red-700 border border-red-200" }
     if (diffDays <= 2) return { label: "דחיפות קרובה", color: "bg-amber-100 text-amber-700 border border-amber-200" }
     return { label: "זמן ירוק ורגוע", color: "bg-emerald-100 text-emerald-700 border border-emerald-200" }
  }

  return (
    <div className="flex flex-col bg-card rounded-3xl p-6 border shadow-sm h-full overflow-hidden">
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
           📌 לוח משימות פתוחות
        </h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">גרור ליומן משימות לשיבוץ.</p>
      </div>

      <Dialog open={!!editingTaskId} onOpenChange={(o) => { if(!o) setEditingTaskId(null)}}>
         <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
               <DialogTitle>עריכת משימה</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
               <div>
                 <label className="text-xs font-bold text-muted-foreground mb-1 block">כותרת</label>
                 <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
               </div>
               <div>
                 <label className="text-xs font-bold text-muted-foreground mb-1 block">תיאור ותוכן</label>
                 <textarea 
                   rows={4}
                   value={editDesc} 
                   onChange={e => setEditDesc(e.target.value)} 
                   placeholder="הוסף פרטים למשימה..."
                   className="w-full bg-background border flex rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                 />
               </div>
               <div>
                 <label className="text-xs font-bold text-muted-foreground mb-1 block">שיוך לקורס</label>
                 <select 
                   value={editCourse} 
                   onChange={e => setEditCourse(e.target.value)}
                   className="w-full bg-background border flex h-10 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                 >
                   <option value="">-- ללא שיוך לקורס --</option>
                   {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>
               <div>
                 <label className="text-xs font-bold text-muted-foreground mb-2 block">צבע זיהוי</label>
                 <div className="flex gap-2">
                   {colors.map(c => (
                     <button 
                       key={c} type="button" onClick={() => setEditColor(c)}
                       className={`w-8 h-8 rounded-full transition-transform ${c} ${editColor === c ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-card' : 'opacity-80'}`}
                     />
                   ))}
                 </div>
               </div>
               <div className="flex justify-end gap-3 mt-4 shrink-0">
                  <Button variant="outline" onClick={() => setEditingTaskId(null)}>ביטול</Button>
                  <Button onClick={handleSaveEdit}>שמור משימה</Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>

      <form onSubmit={handleAddTask} className="flex flex-col gap-3 mb-6 bg-muted/30 p-3 rounded-2xl border">
        <Input 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)} 
          placeholder="מה צריך לעשות?" 
          className="bg-background border-none shadow-sm h-10"
        />
        <div className="flex gap-2 text-sm">
           <select 
             value={selectedCourse} 
             onChange={e => setSelectedCourse(e.target.value)}
             className="w-full bg-background border flex h-9 rounded-md px-3 text-sm"
           >
             <option value="">-- ללא שיוך לקורס --</option>
             {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {colors.map(c => (
              <button 
                key={c} type="button" onClick={() => setSelectedColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${c} ${selectedColor === c ? 'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-card' : 'opacity-80'}`}
              />
            ))}
          </div>
          <Button size="sm" type="submit" className="gap-1 rounded-xl h-8 px-3 text-xs font-bold font-sans">
            <Plus className="w-3 h-3" /> הוסף
          </Button>
        </div>
      </form>

      <div className="overflow-y-auto pr-2 space-y-3 pb-4 max-h-[300px]">
        {tasks.filter(t => !t.isScheduled).map(task => (
           <div 
             key={task.id}
             draggable
             onDragStart={(e) => {
                e.dataTransfer.setData("taskId", task.id)
                e.dataTransfer.effectAllowed = "move"
                setDraggedTaskId(task.id)
             }}
             onDragEnd={() => {
                setDraggedTaskId(null)
                setDragOverTaskId(null)
             }}
             onDragOver={(e) => {
                e.preventDefault() // Important for onDrop to trigger
                if (draggedTaskId && draggedTaskId !== task.id) {
                   setDragOverTaskId(task.id)
                }
             }}
             onDragLeave={() => {
                if (dragOverTaskId === task.id) setDragOverTaskId(null)
             }}
             onDrop={(e) => {
                e.preventDefault()
                const incomingId = e.dataTransfer.getData("taskId")
                if (incomingId && incomingId !== task.id) {
                    reorderTasks(incomingId, task.id)
                }
                 setDraggedTaskId(null)
                 setDragOverTaskId(null)
             }}
             // Touch implementation for mobile dnd
             onTouchStart={(e) => {
               // Prevent default happens in touch end to allow click edit, but we want to prep drag
               const touch = e.touches[0]
               setTouchPos({ x: touch.clientX, y: touch.clientY })
               
               // Small delay to distinct between tap and drag
               const timer = setTimeout(() => {
                  setTouchDragTask(task)
                  setActiveDraggedTask(task)
               }, 300)
               
               // Make sure to clear on end/move too aggressively if it was just a tap
               const clearTouch = () => { clearTimeout(timer); document.removeEventListener('touchend', clearTouch) }
               document.addEventListener('touchend', clearTouch)
             }}
             // The move handler must be on document dynamically or on the board
             className={`group flex items-center gap-3 p-3 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing transition-all ${draggedTaskId === task.id ? 'opacity-30 scale-95' : 'bg-background'} ${dragOverTaskId === task.id ? 'border-primary border-dashed bg-primary/5 -translate-y-1' : 'border-border hover:border-primary/40'}`}
           >
              <div className="cursor-grab text-muted-foreground/50 hover:text-foreground">
                 <GripVertical className="w-4 h-4" />
              </div>
              <div className={`w-3 h-3 rounded-full ${task.color} shrink-0`} />
              <div className="flex flex-col flex-1 min-w-0">
                 <div className="flex items-center gap-2">
                    <span onClick={() => openEdit(task)} className="font-medium text-sm cursor-pointer hover:text-primary transition-colors truncate">{task.title}</span>
                    {task.courseId && (
                       <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                          • {courses.find(c => c.id === task.courseId)?.name || 'קורס'}
                       </span>
                    )}
                 </div>
              </div>
              <button 
                 onClick={() => deleteTask(task.id)}
                 className="opacity-20 hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 rounded-md"
                 title="מחק משימה"
              >
                 <Trash2 className="w-4 h-4" />
              </button>
           </div>
        ))}
        {tasks.filter(t => !t.isScheduled).length === 0 && (
           <div className="text-center py-4 text-muted-foreground flex flex-col items-center">
              <Circle className="w-6 h-6 opacity-20 mb-2" />
              <p className="text-xs font-medium">אין משימות פתוחות לא משובצות.</p>
           </div>
        )}
      </div>

      {/* Ghost Element for Mobile Touch Dragging */}
      {touchDragTask && (
        <div 
          className="fixed z-[99999] pointer-events-none opacity-80 flex items-center gap-3 p-3 rounded-xl border-dashed border-2 border-primary bg-background shadow-2xl scale-105"
          style={{ left: touchPos.x - 100, top: touchPos.y - 30, width: 250 }}
        >
          <div className={`w-3 h-3 rounded-full ${touchDragTask.color} shrink-0`} />
          <span className="font-bold">{touchDragTask.title}</span>
        </div>
      )}

      {/* Touch Move/End Listeners on the board itself (could also be global) */}
      {touchDragTask && (
        <div 
          className="fixed inset-0 z-[99998] touch-none"
          onTouchMove={(e) => {
             const touch = e.touches[0]
             setTouchPos({ x: touch.clientX, y: touch.clientY })
          }}
          onTouchEnd={(e) => {
             // In TouchEnd, we check what element we are over using document.elementFromPoint
             const changedTouch = e.changedTouches[0]
             const elemBelow = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY)
             
             // If element is inside the calendar, it will trigger the custom event there
             if (elemBelow) {
                 const customEvent = new CustomEvent('tot:dropFromTouch', { detail: { task: touchDragTask } })
                 elemBelow.dispatchEvent(customEvent)
             }
             
             setTouchDragTask(null)
             setActiveDraggedTask(null)
          }}
        />
      )}

      <div className="mt-4 pt-4 border-t">
         <h3 className="font-bold flex items-center gap-2 mb-3">
             <Clock className="w-4 h-4 text-primary" /> מעקב משימות משובצות
         </h3>
         <div className="space-y-2 overflow-y-auto pr-2 max-h-[250px]">
             {tasks.filter(t => t.isScheduled).map(task => {
                 const status = getStatus(task.id)
                 return (
                 <div key={task.id} className="flex flex-col gap-2 bg-background p-3 rounded-xl border shadow-sm text-sm">
                    <div className="flex items-center justify-between gap-2">
                       <div className="flex items-center gap-2 flex-1 overflow-hidden">
                          <div className={`w-2 h-2 rounded-full ${task.color} shrink-0 opacity-80`} />
                          <span className="font-medium truncate">{task.title}</span>
                       </div>
                       <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3"/></button>
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md w-fit ${status.color}`}>
                       {status.label}
                    </span>
                 </div>
                 )
             })}
             {tasks.filter(t => t.isScheduled).length === 0 && (
               <span className="text-xs text-muted-foreground block text-center py-2">לא שיבצת משימות ביומן החכם עדיין.</span>
             )}
         </div>
      </div>
    </div>
  )
}
