export const sounds = {
  joinRoom: typeof window != "undefined" ? new Audio("/sounds/discord-join-sound.mp3") : null,
  leaveRoom: typeof window != "undefined" ? new Audio("/sounds/discord-leave-room-sound.mp3") : null,
  peerLeavesRoom: typeof window != "undefined" ? new Audio("/sounds/discord-leave-sound.mp3") : null,
  muteMic: typeof window != "undefined" ? new Audio("/sounds/discord-mute-sound.mp3") : null,
  unmuteMic: typeof window != "undefined" ? new Audio("/sounds/discord-unmute-sound.mp3") : null
}