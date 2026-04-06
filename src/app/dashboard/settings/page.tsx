"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useData } from "@/lib/data-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { sysSettings, updateSettings, isLoaded } = useData()
  
  const [localUsername, setLocalUsername] = useState("")
  const [localNotifications, setLocalNotifications] = useState(true)
  const [localDuckMode, setLocalDuckMode] = useState(true)
  const [localDuckBehavior, setLocalDuckBehavior] = useState<'random' | 'always'>('random')
  const [successMsg, setSuccessMsg] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const router = useRouter()

  const palettes = [
     { id: "mocha", name: "קוקו בז'", hex: "#9a3412", cls: "bg-[#9a3412]" },
     { id: "rose", name: "ורד רומנטי", hex: "#be185d", cls: "bg-[#be185d]" },
     { id: "ocean", name: "ים עמוק", hex: "#1d4ed8", cls: "bg-[#1d4ed8]" },
     { id: "emerald", name: "יער טרופי", hex: "#047857", cls: "bg-[#047857]" },
     { id: "violet", name: "סיגליות", hex: "#6d28d9", cls: "bg-[#6d28d9]" },
     { id: "orange", name: "שמש כתומה", hex: "#c2410c", cls: "bg-[#c2410c]" },
     { id: "slate", name: "חלל נקי", hex: "#334155", cls: "bg-[#334155]" }
  ]

  useEffect(() => {
    if (isLoaded) {
      setLocalUsername(sysSettings.username || "")
      setLocalNotifications(sysSettings.allowNotifications !== false)
      setLocalDuckMode(sysSettings.duckMode !== false)
      setLocalDuckBehavior(sysSettings.duckBehavior || 'random')
    }
  }, [sysSettings, isLoaded])

  if (!isLoaded) return null

  const handleSaveGeneral = () => {
    updateSettings({ username: localUsername, allowNotifications: localNotifications, duckMode: localDuckMode, duckBehavior: localDuckBehavior })
    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)
  }
  
  const handleThemeChange = (themeId: string) => {
    updateSettings({ themeColor: themeId })
  }

  const handleClearAll = () => {
    if(confirm("האם אתה בטוח? פעולה זו תמחק את כל הקורסים, הסיכומים וההגדרות במכשיר הזה.")){
      setIsResetting(true)
      localStorage.clear()
      setTimeout(() => {
        window.location.href = "/login"
      }, 500)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-12 p-4">
      <h1 className="text-3xl font-bold tracking-tight border-b pb-4">הגדרות מערכת</h1>
      
      <div className="bg-card text-card-foreground shadow-sm border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">פרטים אישיים והעדפות</h2>
        
        <div className="flex flex-col gap-6 max-w-sm">
           <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold">שם תצוגה</label>
             <Input value={localUsername} onChange={e => setLocalUsername(e.target.value)} />
           </div>

           <div className="flex items-center justify-between border-t border-border/50 pt-4">
             <div>
               <h4 className="font-semibold text-sm">התראות מערכת</h4>
               <p className="text-sm text-muted-foreground mt-1">קבל התראות על משימות מתקרבות או שיעורים.</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" className="sr-only peer" checked={localNotifications} onChange={(e) => setLocalNotifications(e.target.checked)} />
               <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
             </label>
           </div>

           <div className="flex flex-col gap-3 border-t border-border/50 pt-4">
             <div className="flex items-center justify-between">
               <div>
                 <h4 className="font-semibold text-sm">ברווז המזל המנחה 🦆</h4>
                 <p className="text-sm text-muted-foreground mt-1">אפשר לברווז הלימוד להופיע מדי פעם כדי לעודד אותך.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer shrink-0">
                 <input type="checkbox" className="sr-only peer" checked={localDuckMode} onChange={(e) => setLocalDuckMode(e.target.checked)} />
                 <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
               </label>
             </div>

             {localDuckMode && (
               <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg mt-1">
                 <label className="text-xs font-semibold text-muted-foreground">מתי להופיע?</label>
                 <select 
                   value={localDuckBehavior} 
                   onChange={(e) => setLocalDuckBehavior(e.target.value as 'random' | 'always')}
                   className="bg-background text-sm rounded border border-border/50 px-2 py-1 outline-none font-medium cursor-pointer"
                 >
                   <option value="random">מופיע באקראי (הפתעה!)</option>
                   <option value="always">תמיד איתך על המסך</option>
                 </select>
               </div>
             )}
           </div>

           <div className="flex items-center gap-4 mt-2">
             <Button onClick={handleSaveGeneral}>שמור שינויים</Button>
             {successMsg && <span className="text-sm text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-md">נשמר בהצלחה!</span>}
           </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground shadow-sm border rounded-2xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
           עיצוב ופלטת צבעים 🎨
        </h2>
        <p className="text-sm text-muted-foreground mb-4">בחר את סגנון הצבעים המועדף עליך שיחול על כל המערכת.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
           {palettes.map(palette => (
              <div 
                 key={palette.id}
                 onClick={() => handleThemeChange(palette.id)}
                 className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${sysSettings.themeColor === palette.id ? 'border-primary ring-2 ring-primary/20 scale-105 bg-primary/5' : 'border-border/50 hover:border-primary/50 grayscale-[40%] hover:grayscale-0'}`}
              >
                 <div className={`w-8 h-8 rounded-full mb-3 shadow-md ${palette.cls}`} />
                 <span className="text-xs font-bold text-center">{palette.name}</span>
              </div>
           ))}
        </div>
      </div>

      <div className="bg-card text-card-foreground shadow-sm border rounded-2xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
           מצב תצוגה 📱💻
        </h2>
        <p className="text-sm text-muted-foreground mb-4">בחר איך האתר ייראה על המסך שלך. מצב מובייל ידמה חווית טלפון גם על המחשב.</p>
        <div className="flex gap-4">
           {[
             { id: 'desktop', name: 'תצוגת מחשב', icon: '💻' },
             { id: 'mobile', name: 'תצוגת מובייל', icon: '📱' }
           ].map(mode => (
             <div 
               key={mode.id}
               onClick={() => updateSettings({ viewMode: mode.id as 'desktop' | 'mobile' })}
               className={`flex flex-col items-center justify-center p-4 min-w-[120px] rounded-2xl border-2 cursor-pointer transition-all ${sysSettings.viewMode === mode.id || (!sysSettings.viewMode && mode.id === 'desktop') ? 'border-primary ring-2 ring-primary/20 scale-105 bg-primary/5' : 'border-border/50 hover:border-primary/50 grayscale hover:grayscale-0'}`}
             >
               <span className="text-3xl mb-2">{mode.icon}</span>
               <span className="text-xs font-bold text-center">{mode.name}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-card text-card-foreground shadow-sm border rounded-2xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
           סגנון עכבר מערכת 🖱️
        </h2>
        <p className="text-sm text-muted-foreground mb-4">הפוך את סמן העכבר שלך למיוחד יותר.</p>
        <div className="flex gap-4">
           {[
             { id: 'default', name: 'רגיל', icon: '🖱️' },
             { id: 'strawberry', name: 'תות', icon: '🍓' },
             { id: 'magic', name: 'שרביט', icon: '🪄' },
             { id: 'sword', name: 'חרב', icon: '🗡️' }
           ].map(cursor => (
             <div 
               key={cursor.id}
               onClick={() => updateSettings({ cursorStyle: cursor.id })}
               className={`flex flex-col items-center justify-center p-4 min-w-[80px] rounded-2xl border-2 cursor-pointer transition-all ${sysSettings.cursorStyle === cursor.id || (!sysSettings.cursorStyle && cursor.id === 'default') ? 'border-primary ring-2 ring-primary/20 scale-105 bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
             >
               <span className="text-3xl mb-2">{cursor.icon}</span>
               <span className="text-xs font-bold text-center">{cursor.name}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-card text-card-foreground shadow-sm border rounded-2xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
           צליל סיום פומודורו 🔔
        </h2>
        <p className="text-sm text-muted-foreground mb-4">בחר את הצליל שיישמע כשהטיימר מסתיים.</p>
        <div className="flex gap-4">
           {[
             { id: 'magic', name: 'קסם', icon: '🪄' },
             { id: 'bell', name: 'פעמון', icon: '🔔' },
             { id: 'digital', name: 'דיגיטלי', icon: '📟' }
           ].map(sound => (
             <div 
               key={sound.id}
               onClick={() => updateSettings({ ringtone: sound.id })}
               className={`flex flex-col items-center justify-center p-4 min-w-[100px] rounded-2xl border-2 cursor-pointer transition-all ${sysSettings.ringtone === sound.id || (!sysSettings.ringtone && sound.id === 'magic') ? 'border-primary ring-2 ring-primary/20 scale-105 bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
             >
               <span className="text-3xl mb-2">{sound.icon}</span>
               <span className="text-xs font-bold text-center">{sound.name}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-destructive/5 border-destructive/20 shadow-sm border rounded-2xl p-6 mt-4">
        <h2 className="text-xl font-bold text-destructive mb-2">אזור סכנה</h2>
        <p className="text-sm text-muted-foreground mb-4">
          מחיקת נתונים מכאן תסיר את כל המידע שנשמר מקומית על הדפדפן (קורסים, סיכומים, אירועים ביומן).
        </p>
        <Button variant="destructive" onClick={handleClearAll} disabled={isResetting}>
          {isResetting ? "מוחק..." : "מחק את כל הנתונים שלי"}
        </Button>
      </div>
    </div>
  )
}
