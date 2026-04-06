"use client"
import { useState, useEffect, useRef } from "react"
import { useData } from "@/lib/data-context"

export function DuckBuddy() {
  const { sysSettings } = useData()
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isCaught, setIsCaught] = useState(false)
  const [expression, setExpression] = useState("🦆")
  const [velocity, setVelocity] = useState({ x: 1, y: 1 })
  
  const duckRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(null)

  // Appearance logic
  useEffect(() => {
    if (!sysSettings.duckMode) {
      setIsVisible(false)
      return
    }

    const triggerDuck = () => {
      if (!isVisible) {
        const x = Math.random() * (window.innerWidth - 100)
        const y = Math.random() * (window.innerHeight - 100)
        setPosition({ x, y })
        setVelocity({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4
        })
        setIsVisible(true)
        setIsCaught(false)
        setExpression("🦆")
      }
    }

    if (sysSettings.duckBehavior === 'always') {
      triggerDuck()
      return
    }

    // Check every 30-90 seconds for 'random' mode
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to appear when checked
        triggerDuck()
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [sysSettings.duckMode, sysSettings.duckBehavior, isVisible])

  // Movement animation logic
  const animate = () => {
    if (isVisible && !isCaught) {
      setPosition(prev => {
        let newX = prev.x + velocity.x
        let newY = prev.y + velocity.y
        let newVelX = velocity.x
        let newVelY = velocity.y

        // Bounce off walls
        if (newX <= 0 || newX >= window.innerWidth - 60) newVelX = -velocity.x
        if (newY <= 0 || newY >= window.innerHeight - 60) newVelY = -velocity.y

        if (newVelX !== velocity.x || newVelY !== velocity.y) {
           setVelocity({ x: newVelX, y: newVelY })
        }

        return { x: newX, y: newY }
      })
    }
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isVisible, isCaught, velocity])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsCaught(true)
    setExpression(Math.random() > 0.5 ? "😲" : "🤪")
    
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y

    const onPointerMove = (moveEvent: PointerEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      })
    }

    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerup", onPointerUp)
      
      // Duck disappears after being caught and moved, unless it is set to 'always'
      setTimeout(() => {
        if (sysSettings.duckBehavior !== 'always') {
           setIsVisible(false)
        }
        setIsCaught(false)
        setExpression("🦆")
      }, 500)
    }

    document.addEventListener("pointermove", onPointerMove)
    document.addEventListener("pointerup", onPointerUp)
    
    // Prevent scrolling while dragging the duck on mobile
    e.preventDefault()
  }

  if (!isVisible || !sysSettings.duckMode) return null

  return (
    <div
      ref={duckRef}
      onPointerDown={handlePointerDown}
      className={`fixed z-[9999] cursor-grab active:cursor-grabbing select-none text-4xl transition-transform duration-200 ${isCaught ? 'scale-150 rotate-12' : 'hover:scale-110'}`}
      style={{
        left: position.x,
        top: position.y,
        filter: isCaught ? 'drop-shadow(0 0 15px rgba(255,255,0,0.5))' : 'none'
      }}
    >
      {expression}
    </div>
  )
}
