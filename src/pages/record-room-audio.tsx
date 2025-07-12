import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import type { RoomParams } from './room'

const isRecordingSupported =
  !!navigator.mediaDevices &&
  !!navigator.mediaDevices.getUserMedia &&
  typeof window.MediaRecorder === 'function'

export function RecordRoomAudio() {
  const params = useParams<RoomParams>()

  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)

  if (!params.id) {
    return <Navigate replace to="/" />
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('Seu navegador não permite gravar áudio.')
      return
    }

    setIsRecording(true)

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    })

    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    })

    recorder.current.ondataavailable = event => {
      if (event.data.size > 0) {
        uploadAudio(event.data)
      }
    }

    recorder.current.onstart = () => {
      console.log('Gravando...')
    }

    recorder.current.onstop = () => {
      setIsRecording(false)
      console.log('Gravado com sucesso!')
    }

    recorder.current.start()
  }

  async function stopRecording() {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }

    setIsRecording(false)
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData()
    formData.append('file', audio, 'audio.webm')

    const response = await fetch(`http://localhost:3333/rooms/${params.id}/audio`, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    console.log(result)
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-3">
      {isRecording ? (
        <Button onClick={stopRecording}>Parar Gravação</Button>
      ) : (
        <Button onClick={startRecording}>Gravar áudio</Button>
      )}

      {isRecording ? <p>Gravando...</p> : <p>Pausado</p>}
    </div>
  )
}
