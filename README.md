# audvis

A React audio visualizer component with Web Audio API support. Perfect for music players, voice recorders, and real-time audio applications.

## Features

- 🎨 **Beautiful symmetric bar visualization** - Logarithmic frequency distribution for better visual representation
- ⚡ **High performance** - Throttled to 60fps with requestAnimationFrame
- 🎯 **Customizable** - Control width, height, and bar color
- 📱 **React & Next.js compatible** - Works with React 18+ and Next.js
- 🔊 **Web Audio API** - Direct access to frequency data via AnalyserNode
- 📦 **Zero dependencies** - Only requires React
- 🎭 **TypeScript support** - Full type definitions included

## Installation

```bash
npm install audvis
```

or with pnpm:

```bash
pnpm add audvis
```

or with bun:

```bash
bun add audvis
```

## Usage

### Basic Example

```tsx
import { AudioVisualizer, useAudioAnalyser } from 'audvis'
import { useState } from 'react'

export function MyAudioVisualizer() {
  const [isRecording, setIsRecording] = useState(false)
  const { analyser } = useAudioAnalyser(isRecording)

  return (
    <div>
      <button onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? 'Stop' : 'Start'}
      </button>
      {analyser && (
        <AudioVisualizer 
          analyser={analyser} 
          isActive={isRecording}
          color="#ef4444"
        />
      )}
    </div>
  )
}
```

## Components

### `AudioVisualizer`

React component that renders an audio visualization canvas.

#### Props

- `analyser` (AnalyserNode, required) - Web Audio API AnalyserNode instance
- `isActive` (boolean, required) - Whether the visualization should be active
- `width` (number, optional) - Canvas width in pixels (default: 680)
- `height` (number, optional) - Canvas height in pixels (default: 30)
- `color` (string, optional) - Bar color as CSS color value (default: "#ef4444")

### `useAudioAnalyser`

React hook that manages audio context and analyser node.

#### Parameters

- `isRecording` (boolean) - Whether to initialize audio capture

#### Returns

```tsx
{
  analyser: AnalyserNode | null,
  disconnect: () => void
}
```

## Example with Next.js

```tsx
'use client'

import { AudioVisualizer, useAudioAnalyser } from 'audvis'
import { useState } from 'react'

export default function Page() {
  const [isRecording, setIsRecording] = useState(false)
  const { analyser } = useAudioAnalyser(isRecording)

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={() => setIsRecording(!isRecording)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      
      {analyser && (
        <AudioVisualizer 
          analyser={analyser}
          isActive={isRecording}
          width={680}
          height={40}
          color="#3b82f6"
        />
      )}
    </div>
  )
}
```

## Browser Support

Works in all modern browsers that support:
- Web Audio API
- Canvas API
- requestAnimationFrame

## License

MIT
