"use server"

import { Redis } from '@upstash/redis'

// Initialize Redis
const redis = Redis.fromEnv()

export const getItem = async () => {
  // Fetch data from Redis
  const result = await redis.get("item")

  // Return the result in the response
  return result
}

export const joinRoom = async (roomCode: string, peerId: string, username: string) => {
  // Add the peer to the room
  await redis.hset(roomCode, {
    [username]: peerId
  })

  // Get the list of peers in the room
  const peersToCall = await getPeersByRoom(roomCode)

  return peersToCall as Record<string, string> || {}
}

export const getPeersByRoom = async (roomCode: string) => {
  // Get the list of peers in the room
  const peers = await redis.hgetall(roomCode)

  return peers
}

export const exitRoom = async (roomCode: string, username: string) => {
  // Remove the peer from the room
  const result = await redis.hdel(roomCode, username)

  // Return the peers in the room
  return result
}