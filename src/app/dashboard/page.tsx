"use client"
import { useState } from "react"
import { FastFileDropzone } from "@/components/fast-file-dropzone"
import { LiveHeader } from "@/components/live-header"
import { useData } from "@/lib/data-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText } from "lucide-react"

export default function DashboardPage() {
  const { courses, notes, isLoaded } = useData()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  if (!isLoaded) return <div className="p-8">טוען נתונים...</div>

  const totalCourses = courses.length
  const totalNotes = notes.length
  const totalAttachments = notes.filter(n => n.tags?.includes("קובץ")).length
  
  const selectedNote = notes.find(n => n.id === selectedNoteId)

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500 w-full h-full p-0 sm:p-2 max-w-7xl mx-auto">
      <LiveHeader />
      
      <div className="grid gap-3 grid-cols-3 mb-4 sm:mb-6">
        <div className="bg-card text-card-foreground border shadow-sm p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
          <h3 className="font-bold text-xs sm:text-base text-muted-foreground mb-1 sm:mb-2">קורסים פעילים</h3>
          <p className="text-3xl sm:text-5xl font-extrabold text-primary">{totalCourses}</p>
        </div>
        <div className="bg-card text-card-foreground border shadow-sm p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
          <h3 className="font-bold text-xs sm:text-base text-muted-foreground mb-1 sm:mb-2">סיכומים</h3>
          <p className="text-3xl sm:text-5xl font-extrabold text-primary">{totalNotes}</p>
        </div>
        <div className="bg-card text-card-foreground border shadow-sm p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
          <h3 className="font-bold text-xs sm:text-base text-muted-foreground mb-1 sm:mb-2">קבצים</h3>
          <p className="text-3xl sm:text-5xl font-extrabold text-primary">{totalAttachments}</p>
        </div>
      </div>

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

      {/* Drag & Drop File To Note Area */}
      <FastFileDropzone />

      {/* Recent Notes Snippet */}
      <div className="bg-card rounded-2xl sm:rounded-3xl border shadow-sm p-4 sm:p-8 mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
         <h3 className="font-bold text-lg sm:text-xl">סיכומים שנוצרו לאחרונה</h3>
         {notes.length === 0 ? (
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
               <p className="text-muted-foreground font-medium text-lg">עוד לא הוספת סיכומים למערכת.</p>
            </div>
         ) : (
            <div className="flex flex-col gap-3">
               {notes.slice(-4).reverse().map(note => (
                  <div key={note.id} onClick={() => setSelectedNoteId(note.id)} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border hover:bg-muted/50 transition-colors cursor-pointer group">
                     <span className="font-bold text-lg group-hover:text-primary transition-colors">{note.title}</span>
                     <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{note.date}</span>
                  </div>
               ))}
            </div>
         )}
      </div>

    </div>
  )
}
