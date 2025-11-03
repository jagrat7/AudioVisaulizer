import { useEffect, useRef, useState } from "react"

export function useAudioAnalyser(isRecording: boolean) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const disconnect = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContext) {
      void audioContext.close()
    }
    setAudioContext(null)
    setAnalyser(null)
  }

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          const audioCtx = new AudioContext()
          const analyserNode = audioCtx.createAnalyser()
          const source = audioCtx.createMediaStreamSource(stream)

          analyserNode.fftSize = 256
          source.connect(analyserNode)

          setAudioContext(audioCtx)
          setAnalyser(analyserNode)
          streamRef.current = stream
        })
        .catch(console.error)
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording])

  return { analyser, disconnect }
}
