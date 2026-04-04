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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-6 gap-4">
         <div>
           <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
             שלום {sysSettings?.username || "חנה"}! יום מקסים ולמידה נעימה 🌻
           </h1>
           <p className="text-muted-foreground mt-2 font-medium">כאן תוכלי לראות את כל נתוני המערכת ולהעלות סיכומים מהר.</p>
         </div>
         {/* Live Clock Element */}
         <div className="flex items-center gap-3 bg-card border shadow-md px-6 py-3 rounded-full text-2xl font-mono font-bold text-primary mr-auto">
           <Clock className="w-6 h-6 text-muted-foreground" />
           <span dir="ltr">
             {time ? time.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
           </span>
         </div>
      </div>
   )
}
