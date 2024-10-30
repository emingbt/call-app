export default function SpeechDetector({ stream, setAudioProcessor, setIsSpeaking }: {
  stream: MediaStream,
  setAudioProcessor: React.Dispatch<React.SetStateAction<ScriptProcessorNode | undefined>>,
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>
}) {
  // Set up audio analysis for detecting speech
  const audioContext = new window.AudioContext()
  const analyser = audioContext.createAnalyser()
  const microphone = audioContext.createMediaStreamSource(stream)
  const audioProcessor = audioContext.createScriptProcessor(2048, 1, 1)

  // Set up the audio processor
  setAudioProcessor(audioProcessor)

  analyser.smoothingTimeConstant = 0.8
  analyser.fftSize = 1024

  microphone.connect(analyser)
  analyser.connect(audioProcessor)
  audioProcessor.connect(audioContext.destination)

  audioProcessor.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(array)

    let values = 0
    for (let i = 0; i < array.length; i++) {
      values += array[i]
    }
    const average = values / array.length

    // Set a threshold value to detect if the user is speaking
    const speakingThreshold = 20
    if (average > speakingThreshold) {
      // console.log("User is speaking")
      setIsSpeaking(true)
      // You can update the state or perform other actions here when the user is speaking
    } else {
      setIsSpeaking(false)
      // console.log("User is not speaking")
    }
  }
}