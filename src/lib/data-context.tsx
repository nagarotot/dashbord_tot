"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Course = { id: string, name: string, code: string, color: string }
export type Note = { id: string, courseId: string, title: string, content: string, date: string, tags: string[], coverType?: "pdf" | "doc" | "image", fileData?: string }
export type CalendarEvent = { id: string, title: string, topic: string, start: string, end: string, color?: string, isTask?: boolean, taskId?: string }
export interface Task {
  id: string;
  title: string;
  description?: string;
  color: string;
  isScheduled: boolean;
  courseId?: string;
}

interface DataContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  addCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;

  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;

  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  reorderTasks: (draggedId: string, targetId: string) => void;
  
  sysSettings: { username: string; allowNotifications: boolean; themeColor: string; cursorStyle: string; viewMode: 'desktop' | 'mobile'; ringtone: string; duckMode: boolean };
  updateSettings: (settings: Partial<{username: string, allowNotifications: boolean, themeColor: string, cursorStyle: string, viewMode: 'desktop' | 'mobile', ringtone: string, duckMode: boolean}>) => void;
  
  activeDraggedTask: Task | null;
  setActiveDraggedTask: React.Dispatch<React.SetStateAction<Task | null>>;

  isLoaded: boolean;
}

const defaultContext: DataContextType = {
  courses: [], setCourses: () => {}, addCourse: () => {}, deleteCourse: () => {},
  notes: [], addNote: () => {}, deleteNote: () => {}, updateNote: () => {},
  events: [], addEvent: () => {}, deleteEvent: () => {}, updateEvent: () => {},
  tasks: [], addTask: () => {}, deleteTask: () => {}, updateTask: () => {}, reorderTasks: () => {},
  sysSettings: { username: "חנה", allowNotifications: true, themeColor: "mocha", cursorStyle: "strawberry", viewMode: 'desktop', ringtone: "magic", duckMode: true }, updateSettings: () => {},
  activeDraggedTask: null, setActiveDraggedTask: () => {},
  isLoaded: false
}

export const DataContext = createContext<DataContextType>(defaultContext)

const defaultCourses = [
  { id: "1", name: "מבוא למיקרוכלכלה", code: "10111", color: "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400" },
  { id: "2", name: "סטטיסטיקה א'", code: "10112", color: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400" },
  { id: "3", name: "פסיכולוגיה חברתית", code: "10113", color: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400" },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeDraggedTask, setActiveDraggedTask] = useState<Task | null>(null)
  const [sysSettings, setSysSettings] = useState({ username: "חנה", allowNotifications: true, themeColor: "mocha", cursorStyle: "strawberry", viewMode: 'desktop' as 'desktop' | 'mobile', ringtone: "magic", duckMode: true })

  // Theme, Cursor, and View Mode Applier Effect
  useEffect(() => {
     if (isLoaded && document) {
        document.documentElement.setAttribute('data-theme', sysSettings.themeColor || "mocha")
        document.documentElement.classList.toggle('forced-mobile', sysSettings.viewMode === 'mobile')

        const cursors: Record<string, string> = {
          'strawberry': `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="24" font-size="24">🍓</text></svg>'), auto`,
          'magic': `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="24" font-size="24">🪄</text></svg>'), auto`,
          'sword': `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="24" font-size="24">🗡️</text></svg>'), auto`,
          'default': 'auto'
        }
        
        document.body.style.cursor = cursors[sysSettings.cursorStyle || 'default'] || 'auto';
        
        // Ensure interactive elements also get the custom cursor if not explicitly overridden, or we can just apply globally via CSS rule if needed
        // For simple usage, body cursor works, but interactive elements (a, button, select, input) usually reset it.
        // We can append a global style block safely:
        let styleEl = document.getElementById('tot-custom-cursor-style');
        if(!styleEl) {
           styleEl = document.createElement('style');
           styleEl.id = 'tot-custom-cursor-style';
           document.head.appendChild(styleEl);
        }
        styleEl.innerHTML = `* { cursor: ${cursors[sysSettings.cursorStyle || 'default'] || 'auto'} !important; }`;
     }
  }, [sysSettings.themeColor, sysSettings.cursorStyle, isLoaded])

  // Load from LocalStorage on mount
  useEffect(() => {
    const sCourses = localStorage.getItem('tot_courses')
    const sNotes = localStorage.getItem('tot_notes')
    const sEvents = localStorage.getItem('tot_events')
    const sTasks = localStorage.getItem('tot_tasks')
    const sSet = localStorage.getItem('tot_settings')

    if (sCourses) setCourses(JSON.parse(sCourses))
    else setCourses(defaultCourses)

    if (sNotes) setNotes(JSON.parse(sNotes))
    if (sEvents) setEvents(JSON.parse(sEvents))
    if (sTasks) setTasks(JSON.parse(sTasks))
    if (sSet) setSysSettings(JSON.parse(sSet))
    
    setIsLoaded(true)
  }, [])

  // Auto save hook (simple version)
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('tot_courses', JSON.stringify(courses))
    localStorage.setItem('tot_notes', JSON.stringify(notes))
    localStorage.setItem('tot_events', JSON.stringify(events))
    localStorage.setItem('tot_tasks', JSON.stringify(tasks))
    localStorage.setItem('tot_settings', JSON.stringify(sysSettings))
  }, [courses, notes, events, tasks, sysSettings, isLoaded])

  const addCourse = (course: Course) => setCourses(prev => [...prev, course])
  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id))
    // Also cleanup notes associated
    setNotes(prev => prev.filter(n => n.courseId !== id))
  }

  const addNote = (note: Note) => setNotes(prev => [...prev, note])
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id))
  const updateNote = (id: string, updates: Partial<Note>) => setNotes(prev => prev.map(n => n.id === id ? {...n, ...updates} : n))

  const addEvent = (event: CalendarEvent) => setEvents(prev => [...prev, event])
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id))
  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => setEvents(prev => prev.map(e => e.id === id ? {...e, ...updates} : e))

  const addTask = (task: Task) => setTasks(prev => [...prev, task])
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id))
  const updateTask = (id: string, updates: Partial<Task>) => setTasks(prev => prev.map(t => t.id === id ? {...t, ...updates} : t))
  
  const reorderTasks = (draggedId: string, targetId: string) => {
    setTasks(prev => {
      const result = Array.from(prev)
      const dIndex = result.findIndex(t => t.id === draggedId)
      const tIndex = result.findIndex(t => t.id === targetId)
      if (dIndex < 0 || tIndex < 0 || dIndex === tIndex) return prev;
      const [removed] = result.splice(dIndex, 1)
      result.splice(tIndex, 0, removed)
      return result
    })
  }

  const updateSettings = (updates: Partial<typeof sysSettings>) => setSysSettings(prev => ({...prev, ...updates}))

  return (
    <DataContext.Provider value={{
      courses, setCourses, addCourse, deleteCourse,
      notes, addNote, deleteNote, updateNote,
      events, addEvent, deleteEvent, updateEvent,
      tasks, addTask, deleteTask, updateTask, reorderTasks,
      sysSettings, updateSettings,
      activeDraggedTask, setActiveDraggedTask,
      isLoaded
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
