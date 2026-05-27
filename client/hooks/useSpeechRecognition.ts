"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

type UseSpeechRecognitionOptions = {
  lang?: string
  onFinalTranscript?: (text: string) => void
  onInterimTranscript?: (text: string) => void
}

export function useSpeechRecognition({
  lang,
  onFinalTranscript,
  onInterimTranscript,
}: UseSpeechRecognitionOptions = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const shouldListenRef = useRef(false)
  const onFinalRef = useRef(onFinalTranscript)
  const onInterimRef = useRef(onInterimTranscript)

  useEffect(() => {
    onFinalRef.current = onFinalTranscript
    onInterimRef.current = onInterimTranscript
  }, [onFinalTranscript, onInterimTranscript])

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)
    const recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = lang ?? navigator.language ?? "en-US"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0]?.transcript ?? ""
        if (result.isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      if (final.trim()) onFinalRef.current?.(final.trim())
      onInterimRef.current?.(interim.trim())
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" || event.error === "no-speech") return
      setError(
        event.error === "not-allowed"
          ? "Microphone access was denied. Allow microphone permission in your browser."
          : `Speech recognition error: ${event.error}`
      )
      shouldListenRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (shouldListenRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start()
          setIsListening(true)
        } catch {
          shouldListenRef.current = false
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      shouldListenRef.current = false
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.abort()
      } catch {
        recognition.stop()
      }
      recognitionRef.current = null
    }
  }, [lang])

  const stop = useCallback(() => {
    shouldListenRef.current = false
    setIsListening(false)
    const recognition = recognitionRef.current
    if (!recognition) return
    try {
      recognition.stop()
    } catch {
      recognition.abort()
    }
  }, [])

  const start = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    setError(null)
    shouldListenRef.current = true

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      // start() throws if already started — stop then retry once
      try {
        recognition.stop()
        recognition.start()
        setIsListening(true)
      } catch {
        setError("Could not start voice input. Try again.")
        shouldListenRef.current = false
        setIsListening(false)
      }
    }
  }, [])

  const toggle = useCallback(() => {
    if (isListening) stop()
    else start()
  }, [isListening, start, stop])

  return {
    isSupported,
    isListening,
    error,
    start,
    stop,
    toggle,
    clearError: () => setError(null),
  }
}
