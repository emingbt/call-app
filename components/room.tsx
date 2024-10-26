export default function Room({ roomCode, activePeers, isCurrentRoom }: {
  roomCode: string,
  activePeers: string[],
  isCurrentRoom: boolean
}) {
  return (
    <div className="flex relative flex-col p-4 rounded-lg">
      <p className="w-full font-bold">{roomCode}</p>
      {activePeers.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <div className={`w-full h-[2px] ${isCurrentRoom ? "bg-blue" : "bg-main-bg"} my-2`} />
          <ul className="w-full flex flex-col gap-4">
            {activePeers.map((peer) => (
              <li key={peer} className="font-bold flex items-center">
                <div className="h-4 aspect-square bg-main-bg rounded-full mr-4" />{peer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}