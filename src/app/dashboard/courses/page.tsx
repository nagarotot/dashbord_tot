"use client"
import { BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ActionDropdown } from "@/components/action-dropdown"
import { useData } from "@/lib/data-context"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function CoursesPage() {
  const { courses, notes, addCourse, deleteCourse, isLoaded } = useData()
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseCode, setNewCourseCode] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!isLoaded) return <div className="p-8">טוען קורסים...</div>

  const handleCreateCourse = () => {
    if (!newCourseName) return;
    const randomColor = ["bg-red-100 text-red-700", "bg-green-100 text-green-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700", "bg-orange-100 text-orange-700", "bg-teal-100 text-teal-700"][Math.floor(Math.random()*7)];
    
    addCourse({
      id: crypto.randomUUID(),
      name: newCourseName,
      code: newCourseCode || "---",
      color: randomColor.replace("text", "dark:bg-primary/20 dark:text")
    })
    setNewCourseName("")
    setNewCourseCode("")
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">הקורסים שלי</h1>
          <p className="text-muted-foreground mt-1 font-medium">נהל וארגן את חומרי הלימוד לפי קורסים ונושאים.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-10 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md text-sm font-bold tracking-wide cursor-pointer">
              <Plus className="w-4 h-4" />
              הוסף קורס חדש
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>יצירת קורס חדש</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">שם הקורס:</label>
                <Input value={newCourseName} onChange={e => setNewCourseName(e.target.value)} placeholder="לדוגמה: תכנות מונחה עצמים..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">קוד קורס (אופציונלי):</label>
                <Input value={newCourseCode} onChange={e => setNewCourseCode(e.target.value)} placeholder="לדוגמה: 20441" />
              </div>
            </div>
            <Button onClick={handleCreateCourse} className="w-full">שמור קורס</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {courses.map((course) => {
          const courseNotesCount = notes.filter(n => n.courseId === course.id).length
          
          return (
          <Link href={`/dashboard/courses/${course.id}`} key={course.id} className="group flex flex-col bg-card hover:bg-accent/50 border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden relative">
            <div className={`h-2 w-full ${course.color.split(' ')[0]}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${course.color.split(' ').slice(0,2).join(' ')} ${course.color.includes('text') ? course.color.substring(course.color.indexOf('text')) : ''}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <ActionDropdown 
                  onDelete={() => deleteCourse(course.id)} 
                />
              </div>
              <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{course.name}</h3>
              <p className="text-sm font-medium text-muted-foreground mb-4">קוד קורס: {course.code}</p>
              
              <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                <span className="text-sm font-bold bg-secondary/80 text-secondary-foreground px-4 py-1.5 rounded-full">
                  {courseNotesCount} סיכומים
                </span>
                <span className="text-sm text-primary font-bold group-hover:-translate-x-1 transition-transform flex items-center gap-1">
                  לכל הסיכומים <span className="text-lg leading-none">←</span>
                </span>
              </div>
            </div>
          </Link>
        )})}
        
        {courses.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-3xl bg-muted/20">
            <h3 className="text-xl font-bold text-muted-foreground">אין קורסים עדיין</h3>
            <p className="text-sm text-muted-foreground">הוסף קורס חדש בכפתור העליון כדי להתחיל.</p>
          </div>
        )}
      </div>
    </div>
  )
}
