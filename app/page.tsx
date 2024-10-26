"use client"

import { useEffect, useRef, useState } from "react"
import Peer from "peerjs"
import { exitRoom, getPeersByRoom, joinRoom } from "@/utils/redis"
import Room from "@/components/room"
import Link from "next/link"

export default function Home() {
  const [username, setUsername] = useState("")
  const [peerId, setPeerId] = useState("")
  const [currentRoom, setCurrentRoom] = useState("")
  const [activePeers, setActivePeers] = useState<Record<string, string[]>>({})
  const [error, setError] = useState("")
  const [isMicOn, setIsMicOn] = useState(true)

  const [userPeer, setUserPeer] = useState<Peer>()
  const streamRef = useRef<MediaStream | null>(null)

  const rooms = [
    "Meydan",
    "Toplantı Odası"
  ]

  useEffect(() => {
    async function getPeers() {
      await getActivePeers()
    }

    // Get the active peers
    getPeers()

    // On the client, get the peer id and username from local storage
    const id = localStorage.getItem("peerId")
    const name = localStorage.getItem("username")

    if (id && name) {
      setPeerId(id)
      setUsername(name)

      const roomCode = localStorage.getItem("roomCode")
      if (roomCode) {
        setCurrentRoom(roomCode)
      }
    }
  }, [])

  const handleCreateUser = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Get the username
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string

    try {
      if (!username) {
        setError("Please enter a username")
        return
      }

      setUsername(username)
      localStorage.setItem("username", username)
    }
    catch (error) {
      console.error("Failed to create user", error)
      setError("Failed to create user")
    }
  }

  const handleJoinRoom = async (roomCode: string) => {
    // Join the room
    localStorage.setItem("roomCode", roomCode)
    setCurrentRoom(roomCode)

    const peersToCall = await joinRoom(roomCode, peerId, username)
    const peerNames = Object.keys(peersToCall)

    setActivePeers((prev) => ({
      ...prev,
      [roomCode]: peerNames
    }))

    const peerIdsToCall = Object.values(peersToCall).filter((peer) => peer !== peerId)

    // Get the media stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        sampleRate: 44100,
      },
    })

    if (!stream) {
      return
    }

    streamRef.current = stream

    // Become available to call
    const peer = new Peer(peerId)
    setUserPeer(peer)

    peer.on("call", async (call) => {
      const peersInRoom = await getPeersByRoom(roomCode) || {}
      setActivePeers((prev) => ({
        ...prev,
        [roomCode]: Object.keys(peersInRoom) as string[]
      }))

      call.answer(stream)

      call?.on("stream", (remoteStream) => {
        console.log("Playing audio", remoteStream)
        const audio = new Audio()
        audio.srcObject = remoteStream
        audio.play()
      })

      call?.on("close", async () => {
        const peersInRoom = await getPeersByRoom(roomCode) || {}

        setActivePeers((prev) => ({
          ...prev,
          [roomCode]: Object.keys(peersInRoom) as string[]
        }))
      })
    })

    // sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Call the peers
    peerIdsToCall.forEach((peerId) => {
      const call = peer.call(peerId, stream)

      call?.on("stream", (remoteStream) => {
        const audio = new Audio()
        audio.srcObject = remoteStream
        audio.play()
      })
    })
  }

  const handleExitRoom = async () => {
    await exitRoom(currentRoom, username)

    // Remove the room code
    localStorage.removeItem("roomCode")

    // const peer = new Peer(peerId)
    userPeer?.removeAllListeners()
    userPeer?.disconnect()
    userPeer?.destroy()

    setCurrentRoom("")
    await getActivePeers()
  }

  const getActivePeers = async () => {
    // Get the active peers
    for (const room of rooms) {
      const peers = await getPeersByRoom(room)
      console.log("Peers in room", room, peers)

      if (peers === null) {
        continue
      }

      const peersList = Object.keys(peers)
      // Set the active peers with keeping the previous state
      setActivePeers((prev) => ({
        ...prev,
        [room]: peersList
      }))
    }
  }

  const toggleMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn
      })
      setIsMicOn(!isMicOn) // Toggle the microphone status
    }
  }

  if (username) {
    return (
      <div className="w-full min-h-screen flex relative items-center justify-center bg-main-bg">
        <div className="p-4 absolute top-0 right-0">
          <Link href={"/settings"} className="text-lg text-white font-bold">Settings</Link>
        </div>
        <main className="flex flex-col items-center sm:items-start">
          <h1 className="w-full text-xl font-bold mb-8">Join a room - {username}</h1>
          <div className="flex flex-col items-center sm:items-start">
            {rooms.map((room) => (
              <button
                key={room}
                className="w-56 lg:w-96 relative rounded-lg mb-4 text-white  bg-lightest-bg hover:bg-opacity-80"
                type="button"
                onClick={() => handleJoinRoom(room)}
              >
                <Room roomCode={room} activePeers={activePeers[room] as string[] || []} isCurrentRoom={room == currentRoom} />
              </button>
            ))}
          </div>
        </main>
        <div className="w-full h-20 flex justify-center absolute bottom-0">
          <div className="w-56 lg:w-96 h-full flex items-center justify-around bg-lightest-bg rounded-t-xl">
            <button
              className="w-24 p-4 text-white bg-main-bg font-bold rounded-lg hover:bg-opacity-80"
              type="button"
              onClick={toggleMicrophone}
            >
              {isMicOn ? "Mic On" : "Mic Off"}
            </button>
            <button
              className={`w-28 p-4 text-white ${currentRoom ? "bg-red-500" : "bg-main-bg"}  font-bold rounded-lg hover:bg-opacity-80`}
              type="button"
              onClick={handleExitRoom}
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-main-bg">
      <main className="w-56 lg:w-96 flex flex-col items-center sm:items-start">
        <h1 className="w-full text-xl font-bold mb-8">Create a peer</h1>
        <form
          className="w-full flex flex-col"
          onSubmit={handleCreateUser}
        >
          <input
            className={`w-full p-4 text-white bg-lightest-bg rounded-lg ${!error && "mb-8"}`}
            placeholder="Enter your username"
            name="username"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            className="p-4 bg-blue text-white font-bold rounded-lg hover:bg-opacity-80"
            type="submit" // Changed to "submit"
          >
            Create
          </button>
        </form>
      </main>
    </div>
  )
}
