"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, ArrowRight, Bold, Italic, List, Heading2 } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useState, use, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'

export default function EditNotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const resolvedParams = use(params)
  const { notes, courses, updateNote, isLoaded } = useData()
  const router = useRouter()
  
  const [title, setTitle] = useState("")
  const [courseId, setCourseId] = useState("")
  const note = notes.find(n => n.id === resolvedParams.noteId)
  const initialized = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] text-right max-w-none',
      },
    },
  })

  useEffect(() => {
    if (isLoaded && note && !initialized.current) {
       setTitle(note.title)
       setCourseId(note.courseId)
       if (editor && !editor.isDestroyed) {
         editor.commands.setContent(note.content || "")
         initialized.current = true
       }
    }
  }, [isLoaded, note, editor])

  if (!isLoaded) return <div className="p-12 text-center">טוען נתונים...</div>
  if (!note) return <div className="p-12 text-center text-xl font-bold">הסיכום לא נמצא</div>

  const handleSave = () => {
    if (!title || !editor) return;
    updateNote(note.id, {
      title,
      courseId,
      content: editor.getHTML()
    })
    
    setTimeout(() => {
       alert("הסיכום עודכן בהצלחה!")
       if(courseId) {
          router.push(`/dashboard/courses/${courseId}`)
       } else {
          router.back()
       }
    }, 100)
  }

  // Define updateNote locally since it's missing in context, wait!
  // I need to add updateNote to data-context!

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto py-8 gap-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-muted/30 px-3 py-1.5 rounded-full cursor-pointer">
          <ArrowRight className="w-4 h-4" />
          חזרה
        </button>
        <Button onClick={handleSave} disabled={!title} className="gap-2 shadow-lg shadow-primary/20 rounded-full px-6">
          <Save className="w-4 h-4" />
          שמור שינויים
        </Button>
      </div>

      {/* Editor Main Area */}
      <div className="flex flex-col gap-6 bg-card/80 backdrop-blur-sm border shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
        
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
              <option value="">-- ללא שיוך --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Toolbar */}
        {editor && (
           <div className="flex flex-wrap items-center gap-2 mt-4 bg-muted/50 p-2 rounded-xl w-fit border">
              <select
                onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                className="bg-background text-sm rounded-lg px-2 py-1 border focus:outline-none"
              >
                <option value="inherit">בלי פונט (רגיל)</option>
                <option value="Rubik, sans-serif">Rubik (מיושר)</option>
                <option value="Georgia, serif">Georgia (קלאסי)</option>
                <option value="monospace">מונוספייס (קוד)</option>
              </select>
              <div className="w-px h-6 bg-border mx-1" />
              <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}><Bold className="w-4 h-4"/></button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}><Italic className="w-4 h-4"/></button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}><Heading2 className="w-4 h-4"/></button>
              <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}><List className="w-4 h-4"/></button>
              
              <div className="w-px h-6 bg-border mx-1" />
              <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}>RTL</button>
              <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}>LTR</button>
              <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'}`}>Center</button>
           </div>
        )}

        {/* Tiptap / Markdown Editor */}
        <div className="border-y border-border/50 py-4 relative z-10 w-full font-serif">
           <EditorContent editor={editor} className="w-full text-right" dir="rtl" />
        </div>

      </div>
    </div>
  )
}
