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
        console.log("User is not in a room. Clearing the timeout")
        clearTimeout(timeoutRef.current)
      }

      return
    }

    if (timeoutRef.current) {
      console.log("Clearing the timeout")
      clearTimeout(timeoutRef.current)
    }

    if (!isSpeaking) {
      timeoutRef.current = setTimeout(() => {
        console.log("User is inactive for 10 seconds")
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