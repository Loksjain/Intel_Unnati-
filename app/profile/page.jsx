'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaTrophy, FaChartLine, FaCode, FaBook, FaPuzzlePiece, FaUser } from 'react-icons/fa'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useState, useEffect } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    topics: {},
    achievements: [],
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    quizHistory: [],
    puzzleProgress: [],
    storyProgress: []
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Load user data from your backend/database
      const loadUserData = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}`)
          const userData = await response.json()
          setStats(userData)
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
      loadUserData()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-8"
        >
          <div className="relative">
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-24 h-24 rounded-full border-4 border-orange-500"
            />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-2">
              <FaUser />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{session.user.name}</h1>
            <p className="text-gray-400">{session.user.email}</p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Level {stats.level}</h3>
                <p className="text-gray-400">Experience</p>
              </div>
              <FaTrophy className="text-yellow-500 text-3xl" />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(stats.experience / stats.nextLevelExp) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              {stats.experience} / {stats.nextLevelExp} XP
            </p>
          </motion.div>

          {/* ... other stat cards ... */}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4">Score History</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: stats.quizHistory.map((_, index) => `Quiz ${index + 1}`),
                  datasets: [
                    {
                      label: 'Score',
                      data: stats.quizHistory.map(quiz => quiz.score),
                      borderColor: 'rgb(249, 115, 22)',
                      backgroundColor: 'rgba(249, 115, 22, 0.5)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: { color: '#fff' }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#fff' },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                      ticks: { color: '#fff' },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* ... other charts ... */}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Activity</th>
                  <th className="pb-4">Score</th>
                  <th className="pb-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {stats.quizHistory.slice(0, 5).map((quiz, index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-0">
                    <td className="py-4">{new Date(quiz.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FaCode className="text-orange-500" />
                        Quiz: {quiz.topic}
                      </div>
                    </td>
                    <td className="py-4">{quiz.score}%</td>
                    <td className="py-4">
                      {quiz.score} / {quiz.totalQuestions} correct
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 