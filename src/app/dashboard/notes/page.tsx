"use client"
import { useState } from "react"
import { BookOpen, Search, Trash2, FileText, X } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AllNotesPage() {
  const { notes, courses, deleteNote, isLoaded } = useData()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  if (!isLoaded) return null
  
  const selectedNote = notes.find(n => n.id === selectedNoteId)

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full animate-in fade-in zoom-in-95 duration-500 p-1 sm:p-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">כל הסיכומים</h1>
          <p className="text-muted-foreground mt-1 font-medium text-sm sm:text-base">כאן מרוכזים כל הסיכומים מכל הקורסים.</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
         {notes.map((note) => {
            const course = courses.find(c => c.id === note.courseId)
            return (
            <div key={note.id} className="group bg-card border hover:border-primary/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative">
               <button onClick={() => setSelectedNoteId(note.id)} className="absolute inset-0 z-0 w-full cursor-pointer opacity-0 focus:opacity-100" aria-label="צפה בסיכום" />
               
               <div className="flex justify-between items-start mb-3 relative z-10 pointer-events-none">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{note.title}</h3>
                  <div className="flex gap-2">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md font-bold shrink-0">{course?.name || "ללא קורס"}</span>
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md font-medium shrink-0">
                       {note.date}
                    </span>
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
         )})}

      </div>

      {notes.length === 0 && (
        <div className="flex items-center justify-center p-12 mt-8 bg-muted/20 border-2 border-border border-dashed rounded-3xl h-64">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <BookOpen className="w-12 h-12 text-primary/40" />
            <h3 className="text-xl font-bold text-foreground">אין סיכומים עדיין</h3>
            <p className="text-sm">כנס אל הקורסים שלך והתחל ליצור סיכומים.</p>
          </div>
        </div>
      )}
    </div>
  )
}
