import { useEffect, useRef } from "react"

export interface AudioVisualizerProps {
  analyser: AnalyserNode
  isActive: boolean
  width?: number
  height?: number
  color?: string
}

export function AudioVisualizer({
  analyser,
  isActive,
  width = 680,
  height = 30,
  color = "#ef4444",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastUpdateRef = useRef<number>(0)

  const drawVisualization = (_timestamp?: number) => {
    if (!analyser || !canvasRef.current) return

    const now = Date.now()
    // Throttle to ~60fps (16ms) for better performance
    if (now - lastUpdateRef.current < 16) {
      animationRef.current = requestAnimationFrame(drawVisualization)
      return
    }
    lastUpdateRef.current = now

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray) // Back to frequency domain

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const barWidth = 3
    const barGap = 1
    const totalBarWidth = barWidth + barGap
    const halfBars = Math.floor(canvas.width / totalBarWidth / 2)
    const centerY = canvas.height / 2

    // Calculate bars for one half (better frequency distribution)
    const newBars: number[] = []
    const minBarHeight = 2 // Minimum height to always show bars
    for (let i = 0; i < halfBars; i++) {
      // Use logarithmic distribution for better frequency representation
      const dataIndex = Math.floor((i / halfBars) ** 1.5 * bufferLength * 0.5)
      const value = dataArray[dataIndex] ?? 0
      const audioBarHeight = (value / 200) * (canvas.height / 2)
      const barHeight = Math.max(minBarHeight, audioBarHeight)
      newBars.push(barHeight)
    }

    // Create symmetric bars: [...reverseBars, ...bars]
    const reverseBars = [...newBars].slice(1).reverse()
    const symmetricBars = [...reverseBars, ...newBars]

    // Draw symmetric bars
    symmetricBars.forEach((barHeight, i) => {
      ctx.fillStyle = color
      ctx.fillRect(i * totalBarWidth, centerY - barHeight, barWidth, barHeight * 2)
    })

    animationRef.current = requestAnimationFrame(drawVisualization)
  }

  useEffect(() => {
    if (analyser && isActive) {
      drawVisualization()
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyser, isActive])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="-pr-2 w-full overflow-x-hidden bg-transparent"
    />
  )
}
