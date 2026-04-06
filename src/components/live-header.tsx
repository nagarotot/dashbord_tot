"use client"
import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { Clock } from "lucide-react"

export function LiveHeader() {
   const { sysSettings } = useData()
   const [time, setTime] = useState<Date | null>(null)

   useEffect(() => {
     setTime(new Date())
     const interval = setInterval(() => {
        setTime(new Date())
     }, 1000)
     return () => clearInterval(interval)
   }, [])

   return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-4 sm:mb-6 gap-2 sm:gap-4">
         <div className="min-w-0 flex-1">
           <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
             שלום {sysSettings?.username || "חנה"}! יום מקסים ולמידה נעימה 🌻
           </h1>
           <p className="text-muted-foreground mt-1 font-medium text-sm sm:text-base">כאן תוכלי לראות את כל נתוני המערכת ולהעלות סיכומים מהר.</p>
         </div>
         {/* Live Clock Element — hidden on very small screens */}
         <div className="hidden sm:flex items-center gap-2 bg-card border shadow-md px-4 py-2 sm:px-6 sm:py-3 rounded-full text-lg sm:text-2xl font-mono font-bold text-primary shrink-0">
           <Clock className="w-5 h-5 text-muted-foreground" />
           <span dir="ltr">
             {time ? time.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
           </span>
         </div>
      </div>
   )
}

