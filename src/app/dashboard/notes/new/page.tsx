"use client"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Save, ArrowRight } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewNotePage() {
  const { courses, addNote } = useData()
  const router = useRouter()
  
  const [title, setTitle] = useState("")
  const [courseId, setCourseId] = useState(courses[0]?.id || "")

  const handleSave = () => {
    if (!title || !courseId) return;
    addNote({
      id: crypto.randomUUID(),
      courseId,
      title,
      content: "", // Tiptap will fill this later
      date: new Intl.DateTimeFormat('he-IL').format(new Date()),
      tags: ["חדש"]
    })
    router.push(`/dashboard/courses/${courseId}`)
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto py-8 gap-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-muted/30 px-3 py-1.5 rounded-full cursor-pointer">
          <ArrowRight className="w-4 h-4" />
          חזרה
        </button>
        <Button onClick={handleSave} disabled={!title || !courseId} className="gap-2 shadow-lg shadow-primary/20 rounded-full px-6">
          <Save className="w-4 h-4" />
          שמירת סיכום
        </Button>
      </div>

      {/* Editor Main Area */}
      <div className="flex flex-col gap-6 bg-card/80 backdrop-blur-sm border shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

        {/* Title Input & Course Picker */}
        <div className="relative z-10 flex flex-col gap-4">
          <Input 
            placeholder="כותרת הסיכום (לדוגמה: מבוא למיקרוכלכלה - שיעור 1)..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl md:text-5xl font-extrabold border-none shadow-none h-auto px-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent text-foreground tracking-tight"
          />
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">שיוך לקורס:</span>
            <select 
              value={courseId} 
              onChange={e => setCourseId(e.target.value)}
              className="bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm border font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              {courses.length === 0 && <option value="" disabled>אין קורסים במערכת</option>}
            </select>
          </div>
        </div>

        {/* Tiptap / Markdown Editor Placeholder */}
        <div className="min-h-[400px] border-y border-border/50 py-8 relative z-10">
          <p className="text-muted-foreground/60 italic font-medium text-lg">
            כאן יופיע עורך התוכן העשיר שלנו בקרוב (ניתן יהיה לכתוב כותרות, טקסט מודגש, רשימות וכו')... תתחיל להקליד!
          </p>
        </div>

        {/* File Attachments Section */}
        <div className="mt-6 relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-3 mb-4 text-foreground/90">
            <div className="bg-primary/10 p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            חומרי לימוד מצורפים ומקורות
          </h2>
          <FileUploader />
        </div>

      </div>
      
    </div>
  )
}
