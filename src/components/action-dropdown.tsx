"use client"
import { useState, useRef, useEffect } from "react"
import { MoreVertical, Edit, Archive, Trash2 } from "lucide-react"

export function ActionDropdown({ onDelete }: { onDelete?: () => void }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <button 
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:bg-muted/50 p-2 rounded-full transition-colors z-20 relative cursor-pointer"
        aria-label="אפשרויות קורס"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      
      {open && (
        <div className="absolute left-0 mt-2 w-48 rounded-xl bg-card shadow-2xl border border-border/60 p-1 z-50 animate-in fade-in slide-in-from-top-2">
          <button 
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-secondary rounded-lg text-foreground transition-colors cursor-pointer text-start"
          >
            <Edit className="w-4 h-4" />
            ערוך קורס
          </button>
          <button 
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-secondary rounded-lg text-foreground transition-colors cursor-pointer text-start"
          >
            <Archive className="w-4 h-4" />
            העבר לארכיון
          </button>
          <div className="h-[1px] bg-border/50 my-1 mx-2" />
          <button 
            onClick={() => { setOpen(false); onDelete?.(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold hover:bg-destructive/15 text-destructive rounded-lg transition-colors cursor-pointer text-start"
          >
            <Trash2 className="w-4 h-4" />
            מחק קורס לחלוטין
          </button>
        </div>
      )}
    </div>
  )
}
