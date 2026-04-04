"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Timer, Play, Pause, RotateCcw, X, Maximize2, Minimize2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useData } from "@/lib/data-context"

export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentModeMinutes, setCurrentModeMinutes] = useState(25)
  const timerRef = useRef<any>(null)

  const { sysSettings } = useData()

  useEffect(() => {
    console.log("Pomodoro Timer Component Mounted - Version: 2.0 (Balanced Fullscreen)")
  }, [])

  const playSound = () => {
    if (typeof window === 'undefined') return
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    const ringtone = sysSettings?.ringtone || 'magic'

    if (ringtone === 'bell') {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.type = 'sine'
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
      osc.start()
      osc.stop(ctx.currentTime + 1.5)
    } else if (ringtone === 'digital') {
      const beep = (timeOffset: number) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = 'square'
        osc.frequency.value = 1000
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime + timeOffset)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.1)
        osc.start(ctx.currentTime + timeOffset)
        osc.stop(ctx.currentTime + timeOffset + 0.15)
      }
      [0, 0.2, 0.4].forEach(t => beep(t))
    } else {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'triangle'
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.frequency.value = freq
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
          osc.start()
          osc.stop(ctx.currentTime + 1)
        }, i * 150)
      })
    }
  }

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            setIsRunning(false)
            playSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, sysSettings?.ringtone, currentModeMinutes])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(currentModeMinutes * 60)
  }

  const setTimer = (minutes: number) => {
    setIsRunning(false)
    const m = Math.max(1, Math.min(minutes, 120))
    setCurrentModeMinutes(m)
    setTimeLeft(m * 60)
  }

  const adjustTime = (amount: number) => {
    setIsRunning(false)
    const newM = Math.max(1, Math.min(currentModeMinutes + amount, 180))
    setCurrentModeMinutes(newM)
    setTimeLeft(newM * 60)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const timeBlocks = [5, 10, 15, 25, 30, 45, 60]

  const progress = (timeLeft / (currentModeMinutes * 60)) * 100
  const radius = 240
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={`fixed z-[100] flex flex-col transition-all duration-1000 ease-in-out ${isFullScreen ? 'inset-0 bg-background items-center justify-center' : 'bottom-6 left-20 items-start gap-4'}`}>
      
      {/* Full Screen View */}
      {isFullScreen && (
        <div className="w-full h-full flex flex-col items-center justify-between py-24 relative overflow-hidden animate-in fade-in duration-1000">
          {/* Immersive Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background to-primary/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          
          {/* Header */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
             <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-3xl">🍅</span>
                <span className="font-bold tracking-widest text-xl uppercase">Focus</span>
             </div>
             <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full border border-primary/20 bg-background/20 backdrop-blur-md hover:bg-primary/10 transition-all" onClick={() => setIsFullScreen(false)}>
                <Minimize2 className="w-6 h-6" />
             </Button>
          </div>

          {/* Main Timer Display */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-linear overflow-hidden z-0">
             <div 
               className="absolute inset-x-0 bottom-0 bg-primary/10 backdrop-blur-[2px] transition-all duration-1000 ease-linear" 
               style={{ height: `${(timeLeft / (currentModeMinutes * 60)) * 100}%` }}
             >
                <div className="absolute top-0 left-0 w-[200%] h-24 -translate-y-1/2 fill-primary/10 animate-wave-slow">
                   <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
                      <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,106.7C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                   </svg>
                </div>
                <div className="absolute top-0 left-[-100%] w-[200%] h-24 -translate-y-1/2 fill-primary/5 animate-wave-fast">
                   <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
                      <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,106.7C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                   </svg>
                </div>
             </div>
          </div>

          {/* Main Timer Display */}
          <div className="relative flex flex-col items-center justify-center p-8 z-10 transition-transform duration-700">
             {/* Time Digits */}
             <div className="flex flex-col items-center gap-0">
                <div 
                  className="text-[14rem] md:text-[18rem] font-light tracking-tighter tabular-nums leading-none select-none transition-all duration-700 drop-shadow-2xl"
                  style={{ fontFamily: 'var(--font-inter), sans-serif', color: 'hsl(var(--primary))' }}
                >
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xl font-bold uppercase tracking-[0.8em] text-muted-foreground/30 translate-y-[-1.5rem]">
                   {isRunning ? "Deep Work" : "Ready?"}
                </div>
             </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-12 mt-20 z-10">
             <Button 
               variant="outline" 
               size="icon" 
               className="h-16 w-16 rounded-full border-2 border-primary/20 bg-background/20 backdrop-blur-md hover:bg-primary/5 active:scale-90 transition-all" 
               onClick={resetTimer}
             >
                <RotateCcw className="w-7 h-7 opacity-70" />
             </Button>

             <Button 
               className={`h-24 w-24 rounded-full shadow-2xl transition-all active:scale-95 ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary hover:bg-primary/90'}`} 
               onClick={toggleTimer}
             >
               {isRunning ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
             </Button>

             <div className="relative group">
                <div className="flex items-center gap-2 h-16 px-6 rounded-full border-2 border-primary/20 bg-background/20 backdrop-blur-md">
                   <input 
                     type="number" 
                     value={currentModeMinutes} 
                     onChange={(e) => setTimer(parseInt(e.target.value) || 1)}
                     className="w-16 bg-transparent text-center font-black text-2xl focus:outline-none"
                   />
                   <span className="text-xs font-bold opacity-30 px-1 uppercase">Min</span>
                </div>
             </div>
          </div>

          {/* Bottom Presets Bar */}
          <div className="flex items-center justify-center p-2 rounded-full border border-primary/10 bg-background/20 backdrop-blur-xl z-10 shadow-2xl mb-8">
             {timeBlocks.map(mins => (
                <Button
                  key={mins}
                  variant="ghost"
                  className={`h-12 w-16 rounded-full font-bold transition-all duration-300 ${currentModeMinutes === mins ? 'bg-primary/20 text-primary scale-110 shadow-inner' : 'opacity-40 hover:opacity-100 hover:bg-primary/5 hover:scale-105'}`}
                  onClick={() => setTimer(mins)}
                >
                  {mins}
                </Button>
             ))}
          </div>
        </div>
      )}

      {/* Mini View */}
      {isOpen && !isFullScreen && (
        <div className="bg-card text-card-foreground border shadow-2xl rounded-3xl p-6 w-[320px] animate-in slide-in-from-bottom-10 duration-500 overflow-hidden relative backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2 opacity-80">
              <span className="text-xl">🍅</span> פומודורו
            </h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsFullScreen(true)}>
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-8">
             <div className="text-6xl font-extralight tracking-tight tabular-nums mb-1" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {formatTime(timeLeft)}
             </div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
               {isRunning ? "Counting down..." : "Paused"}
             </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
             <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={resetTimer}>
                <RotateCcw className="w-5 h-5 opacity-60" />
             </Button>
             <Button className={`h-16 w-16 rounded-full shadow-lg ${isRunning ? 'bg-amber-500' : 'bg-primary'}`} onClick={toggleTimer}>
               {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
             </Button>
             <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-full text-sm font-black italic">
                {currentModeMinutes}
             </div>
          </div>

          <div className="flex gap-1 justify-center">
            {timeBlocks.map(mins => (
              <Button
                key={mins}
                variant="ghost"
                className={`h-8 w-10 text-[0.6rem] p-0 font-bold rounded-lg ${currentModeMinutes === mins ? 'bg-primary/10 text-primary' : 'opacity-40'}`}
                onClick={() => setTimer(mins)}
              >
                {mins}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Launcher Button */}
      {!isFullScreen && (
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`h-14 px-6 rounded-full shadow-xl border border-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 bg-primary text-primary-foreground ${isOpen ? 'ring-4 ring-primary/20' : ''}`}
        >
          <span className="text-2xl">🍅</span>
          <span className="font-bold whitespace-nowrap">שעון פומודורו</span>
          {isRunning && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background animate-bounce" />
          )}
        </Button>
      )}
    </div>
  )
}
