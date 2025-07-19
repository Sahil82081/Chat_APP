import React, { useContext, useEffect, useRef } from 'react'
import { WebRTCContext } from '../Provider/WebRTC'

function VoiceCall() {

  const { remotestresam } = useContext(WebRTCContext)
  const audioRef = useRef(null)
  const isPlayingRef = useRef(false)
  
  useEffect(() => {
    if (audioRef.current && remotestresam) {
      audioRef.current.srcObject = remotestresam
      audioRef.current.onloadedmetadata = () => {
        console.log('Audio metadata loaded')
        if (!isPlayingRef.current) {
          isPlayingRef.current = true
          audioRef.current.play().catch(error => {
            console.error('Error attempting to play:', error)
            isPlayingRef.current = false
          })
        }
      }
    }
  }, [remotestresam])

  return (
    <>
      <div>
        <audio ref={audioRef} autoPlay controls></audio>
      </div>
    </>
  )
}

export default VoiceCall