import { useEffect } from 'react'

export default function useDetectTabClose(handleExitRoom: () => void, currentRoom: string) {
  useEffect(() => {
    const handleTabClose = (event: BeforeUnloadEvent) => {
      if (currentRoom !== "") {
        handleExitRoom()
        event.preventDefault()
        event.returnValue = 'Closing app' // This triggers the confirmation dialog in some browsers
      }
    }

    window.addEventListener('beforeunload', handleTabClose)

    return () => {
      window.removeEventListener('beforeunload', handleTabClose)
    }
  }, [handleExitRoom, currentRoom])
}