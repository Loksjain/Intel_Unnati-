'use client'

import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepBackward, FaStepForward, FaMusic } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const audioRef = useRef(null)

  const playlist = [
    {
      title: 'Study Focus',
      artist: 'Ambient Study Music',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      title: 'Coding Session',
      artist: 'Programming Music',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      title: 'Learning Flow',
      artist: 'Concentration Music',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
  ]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const playNextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
    if (audioRef.current) {
      audioRef.current.src = playlist[(currentTrack + 1) % playlist.length].src
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }

  const playPreviousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)
    if (audioRef.current) {
      audioRef.current.src = playlist[(currentTrack - 1 + playlist.length) % playlist.length].src
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-16 right-4 z-50"
    >
      <div className="relative">
        {/* Mini Player */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-2 cursor-pointer shadow-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaMusic className="text-white text-xl" />
        </motion.div>

        {/* Expanded Player */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-12 right-0 bg-gray-800 rounded-xl shadow-xl p-4 w-80"
            >
              <audio
                ref={audioRef}
                src={playlist[currentTrack].src}
                onEnded={playNextTrack}
                autoPlay={isPlaying}
              />
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">{playlist[currentTrack].title}</h3>
                  <p className="text-gray-400 text-sm">{playlist[currentTrack].artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={playPreviousTrack}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaStepBackward />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={playNextTrack}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaStepForward />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                />
              </div>

              {/* Playlist Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>0:00</span>
                  <span>3:45</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
