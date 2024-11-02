import { useEffect, useRef } from 'react'

export default function useDetectAfk(
  isSpeaking: boolean,
  currentRoom: string,
  handleExitRoom: () => void
) {
  const maximumTimeofInactivity = 1000 * 600 // 10 minutes
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentRoom === "") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!isSpeaking) {
      timeoutRef.current = setTimeout(() => {
        handleExitRoom()
      }, maximumTimeofInactivity)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isSpeaking, currentRoom, handleExitRoom])
}