"use client"
import { useState, useRef } from "react"
import { useData } from "@/lib/data-context"
import { FileUp, BookOpenText } from "lucide-react"

export function FastFileDropzone() {
  const { addNote, courses } = useData()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0]
      const courseId = courses.length > 0 ? courses[0].id : ""
      const isPdf = file.name.toLowerCase().endsWith('.pdf')
      
      const reader = new FileReader()
      reader.onload = (e) => {
         const fileData = e.target?.result as string;
         addNote({
           id: crypto.randomUUID(),
           courseId,
           title: file.name.replace(/\.[^/.]+$/, ""),
           content: "",
           date: new Intl.DateTimeFormat('he-IL').format(new Date()),
           tags: ["קובץ"],
           coverType: isPdf ? "pdf" : "doc",
           fileData
         })
         alert(`סיכום נוצר בהצלחה מתוך הקובץ: ${file.name}`)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
    if (fileInputRef.current) {
        fileInputRef.current.value = "" // Reset input
    }
  }

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full h-40 md:h-64 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden ${
        isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border/60 bg-card hover:bg-accent/50'
      }`}
    >
      <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
      <div className={`p-4 rounded-full mb-3 transition-colors ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        <FileUp className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-1">זרוק קובץ (PDF/Word) לכאן</h3>
      <p className="text-sm text-muted-foreground font-medium max-w-sm">
        גרירת קובץ לכאן תפתח אוטומטית התחלה של סיכום חדש עבורו עם כריכה מהירה.
      </p>
    </div>
  )
}
