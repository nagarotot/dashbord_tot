"use client"

import { useState, useCallback } from "react"
import { UploadCloud, File, X } from "lucide-react"

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center p-8 mt-4 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${
          isDragging ? "border-primary bg-primary/10 shadow-inner" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm"
        }`}
      >
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />
        <div className="flex bg-muted/60 p-4 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-bold tracking-tight mb-1">העלה קבצים או גרור אותם לכאן</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm font-medium">
          תמיכה בקבצי PDF, Word, מידע תמונה ועוד. מוגבל ל-50MB.
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">הועלו בהצלחה ({files.length}):</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-card/80 backdrop-blur-sm shadow-sm group animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(idx)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  title="מחק קובץ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
