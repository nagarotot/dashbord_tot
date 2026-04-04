"use client"
import { BookOpen, FolderPen, Plus, Search, Filter, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useData } from "@/lib/data-context"
import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function CourseOverviewPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const courseId = resolvedParams.courseId
  const { courses, notes, tasks, deleteNote, updateTask, isLoaded } = useData()
  const router = useRouter()

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editColor, setEditColor] = useState("bg-blue-500")

  const colors = ["bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-emerald-500", "bg-amber-500"]

  const openEdit = (t: typeof tasks[0]) => {
     setEditingTaskId(t.id)
     setEditTitle(t.title)
     setEditDesc(t.description || "")
     setEditColor(t.color || "bg-blue-500")
  }
  
  const handleSaveEdit = () => {
     if(editingTaskId) {
        updateTask(editingTaskId, { title: editTitle, description: editDesc, color: editColor })
        setEditingTaskId(null)
        setTimeout(() => {
           alert("המשימה עודכנה במערכת!")
        }, 150)
     }
  }

  if (!isLoaded) return <div className="p-8">טוען...</div>

  const course = courses.find(c => c.id === courseId)
  if (!course) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold mb-4">הקורס לא נמצא</h2>
      <Button onClick={() => router.push("/dashboard/courses")}>חזרה לקורסים</Button>
    </div>
  )

  const courseNotes = notes.filter(n => n.courseId === courseId)
  const courseTasks = tasks.filter(t => t.courseId === courseId)

  const selectedNote = notes.find(n => n.id === selectedNoteId)

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-500">
      
      <Dialog open={!!selectedNoteId} onOpenChange={(o) => { if (!o) setSelectedNoteId(null) }}>
         <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden p-0">
            {selectedNote && (
               <>
                 <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
                   <DialogTitle className="text-2xl flex items-center gap-2">
                      <FileText className="text-primary w-6 h-6" /> {selectedNote.title}
                   </DialogTitle>
                   <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">
                         {courses.find(c => c.id === selectedNote.courseId)?.name || 'ללא שיוך'}
                      </span>
                      <span>תאריך יצירה: {selectedNote.date}</span>
                   </div>
                 </DialogHeader>
                 
                 <div className="flex-1 overflow-y-auto bg-card">
                    {selectedNote.fileData && selectedNote.coverType === 'pdf' ? (
                       <iframe src={selectedNote.fileData} className="w-full h-full min-h-[500px] border-none" title="PDF Viewer" />
                    ) : selectedNote.fileData && selectedNote.coverType !== 'pdf' ? (
                       <div className="flex flex-col items-center justify-center p-12 text-center mt-6 mx-6 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
                          <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
                          <h4 className="text-xl font-bold mb-2">קובץ תומך Word/PowerPoint צורף</h4>
                          <p className="text-muted-foreground mb-6 max-w-sm">
                             תצוגה מקדימה מלאה תושלם כשהמערכת תחובר לשרת ענן. 
                             עד אז, הקובץ זמין להורדה בטוחה.
                          </p>
                          <a href={selectedNote.fileData} download={selectedNote.title} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
                             הורדה לצפייה
                          </a>
                       </div>
                    ) : (
                       <div className="p-8 prose dark:prose-invert max-w-none text-right">
                          <div dangerouslySetInnerHTML={{ __html: selectedNote.content || '<p class="text-muted-foreground text-center italic mt-12">קובץ זה ריק מתאור</p>' }} />
                       </div>
                    )}
                 </div>
                 
                 <div className="p-4 border-t bg-muted/10 flex justify-end gap-3 shrink-0">
                    {selectedNote.fileData && (
                       <a href={selectedNote.fileData} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-primary/20 text-primary border border-primary/50 font-bold rounded-xl shadow-sm hover:scale-105 transition-transform flex items-center gap-2 ml-auto">
                          פתח קובץ מקורי
                       </a>
                    )}
                    <a href={`/dashboard/notes/${selectedNote.id}/edit`} className="px-5 py-2.5 bg-muted text-foreground border font-bold rounded-xl shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
                       ערוך סיכום
                    </a>
                    <button onClick={() => setSelectedNoteId(null)} className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:scale-105 transition-transform">
                       סגור קובץ
                    </button>
                 </div>
               </>
            )}
         </DialogContent>
      </Dialog>
      
      {/* Course Header Banner */}
      <div className="relative bg-primary/5 rounded-3xl p-8 border border-primary/10 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-primary font-medium">
               <FolderPen className="w-4 h-4" />
               <Link href="/dashboard/courses" className="hover:underline">הקורסים שלי</Link>
               <span>/</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{course.name}</h1>
            <p className="text-muted-foreground mt-3 font-medium max-w-xl">
               כאן מרוכזים כל הסיכומים, התרגולים וחומרי העזר הרלוונטיים לקורס. קוד קורס: {course.code}
            </p>
         </div>

         <div className="relative z-10 shrink-0">
            <Link href={`/dashboard/notes/new?course=${courseId}`}>
              <Button size="lg" className="gap-2 rounded-full px-8 shadow-xl shadow-primary/20 text-base font-bold">
                 <Plus className="w-5 h-5" />
                 צור סיכום חדש
              </Button>
            </Link>
         </div>
      </div>

      {/* Tools & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border shadow-sm mt-2">
         <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="w-full pr-9 bg-muted/50 border-none font-medium h-10 rounded-xl" placeholder="חפש סיכומים בקורס הזה..." />
         </div>
         <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl">
            <Filter className="w-4 h-4" />
            סינון לפי תוויות
         </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Notes List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           {courseNotes.map((note) => (
              <div key={note.id} className="group bg-card border hover:border-primary/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative">
                 <button onClick={() => setSelectedNoteId(note.id)} className="absolute inset-0 z-0 w-full cursor-pointer opacity-0 focus:opacity-100" aria-label="צפה בסיכום" />
                 
                 <div className="flex justify-between items-start mb-3 relative z-10 pointer-events-none">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{note.title}</h3>
                    <div className="flex gap-2">
                      <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md font-medium shrink-0 ml-2">
                         {note.date}
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-4 relative z-10">
                   <div className="flex flex-wrap gap-2 pointer-events-none">
                      {note.tags?.map(tag => (
                         <span key={tag} className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            #{tag}
                         </span>
                      ))}
                   </div>
                   <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNote(note.id); }}
                    className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors cursor-pointer"
                    title="מחק סיכום"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
              </div>
           ))}

           {courseNotes.length === 0 && (
             <div className="col-span-full p-12 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                <h3 className="text-xl font-bold text-muted-foreground">אין סיכומים בקורס זה</h3>
                <p className="text-sm text-muted-foreground">צור את הסיכום הראשון בעזרת הכפתור למעלה.</p>
             </div>
           )}
        </div>

        {/* Tasks for Course */}
        <div className="lg:col-span-1 bg-card rounded-3xl p-6 border shadow-sm flex flex-col gap-4">
           <h2 className="text-xl font-bold border-b pb-2">משימות שייכות</h2>
           {courseTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">אין משימות לקורס זה.</p>
           ) : (
               <div className="flex flex-col gap-3">
                 <Dialog open={!!editingTaskId} onOpenChange={(o) => { if(!o) setEditingTaskId(null)}}>
                    <DialogContent className="sm:max-w-[450px]">
                       <DialogHeader><DialogTitle>עריכת משימה בקורס</DialogTitle></DialogHeader>
                       <div className="flex flex-col gap-4 mt-4">
                          <div><label className="text-xs font-bold text-muted-foreground mb-1 block">כותרת</label><Input value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
                          <div><label className="text-xs font-bold text-muted-foreground mb-1 block">תיאור</label><textarea rows={4} value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full bg-background border flex rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" /></div>
                          <div><label className="text-xs font-bold text-muted-foreground mb-2 block">צבע זיהוי</label>
                            <div className="flex gap-2">{colors.map(c => <button key={c} type="button" onClick={() => setEditColor(c)} className={`w-8 h-8 rounded-full transition-transform ${c} ${editColor === c ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-card' : 'opacity-80'}`} />)}</div>
                          </div>
                          <div className="flex justify-end gap-3 mt-4 shrink-0"><Button variant="outline" onClick={() => setEditingTaskId(null)}>ביטול</Button><Button onClick={handleSaveEdit}>שמור משימה</Button></div>
                       </div>
                    </DialogContent>
                 </Dialog>
                 {courseTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 bg-background p-3 rounded-xl border">
                       <div className={`w-3 h-3 rounded-full ${task.color} shrink-0`} />
                       <span onClick={() => openEdit(task)} className="font-medium text-sm flex-1 cursor-pointer hover:text-primary transition-colors">{task.title}</span>
                       {task.isScheduled && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold shrink-0">משובץ ביומן</span>
                       )}
                    </div>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  )
}
