'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTrophy, FaStar, FaChartLine, FaLightbulb, FaCode, FaGraduationCap, FaPuzzlePiece, FaCrown } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import Stars from './components/Stars'

export default function HomePage() {
  const router = useRouter()
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [nextLevelExp, setNextLevelExp] = useState(100)
  const [achievements, setAchievements] = useState([])
  const [averageScore, setAverageScore] = useState(0)
  const [totalQuizzes, setTotalQuizzes] = useState(0)
  const [topics, setTopics] = useState([])
  const [puzzles, setPuzzles] = useState([
    { id: 1, title: 'Binary Search', difficulty: 'Medium', completed: false },
    { id: 2, title: 'Dynamic Programming', difficulty: 'Hard', completed: false },
    { id: 3, title: 'Graph Traversal', difficulty: 'Easy', completed: false },
  ])
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'CodeMaster', score: 950, level: 10 },
    { rank: 2, name: 'AlgorithmPro', score: 920, level: 9 },
    { rank: 3, name: 'DataStructGuru', score: 890, level: 8 },
    { rank: 4, name: 'You', score: 850, level: 7 },
    { rank: 5, name: 'CodingNinja', score: 820, level: 7 },
  ])

  useEffect(() => {
    const loadUserStats = () => {
      const history = JSON.parse(localStorage.getItem('quizHistory') || '[]')
      
      // Calculate experience and level
      let totalExp = 0
      let totalScore = 0
      let totalQuizzes = history.length
      const topics = {}

      history.forEach(quiz => {
        // Experience calculation (base 10 + bonus for score)
        const quizExp = 10 + Math.round((quiz.score / quiz.totalQuestions) * 20)
        totalExp += quizExp
        
        // Score calculation
        totalScore += (quiz.score / quiz.totalQuestions) * 100

        // Track topics
        if (!topics[quiz.topic]) {
          topics[quiz.topic] = {
            count: 0,
            totalScore: 0,
          }
        }
        topics[quiz.topic].count++
        topics[quiz.topic].totalScore += (quiz.score / quiz.totalQuestions) * 100
      })

      // Calculate level based on experience
      let level = 1
      let nextLevelExp = 100
      let remainingExp = totalExp
      
      while (remainingExp >= nextLevelExp) {
        remainingExp -= nextLevelExp
        level++
        nextLevelExp = Math.round(nextLevelExp * 1.5) // Each level requires 50% more exp
      }

      // Calculate achievements
      const achievements = []
      
      // Quiz count achievements
      if (totalQuizzes >= 1) achievements.push({ name: 'First Steps', description: 'Complete your first quiz', icon: 'trophy' })
      if (totalQuizzes >= 5) achievements.push({ name: 'Quiz Enthusiast', description: 'Complete 5 quizzes', icon: 'star' })
      if (totalQuizzes >= 10) achievements.push({ name: 'Quiz Master', description: 'Complete 10 quizzes', icon: 'trophy' })
      
      // Score achievements
      if (totalQuizzes > 0) {
        const avgScore = totalScore / totalQuizzes
        if (avgScore >= 80) achievements.push({ name: 'High Scorer', description: 'Maintain 80% average score', icon: 'chart' })
        if (avgScore >= 90) achievements.push({ name: 'Perfectionist', description: 'Maintain 90% average score', icon: 'star' })
      }
      
      // Topic achievements
      Object.entries(topics).forEach(([topic, data]) => {
        if (data.count >= 3) {
          achievements.push({ 
            name: `${topic} Expert`, 
            description: `Complete 3 ${topic} quizzes`, 
            icon: 'code' 
          })
        }
      })

      setLevel(level)
      setExperience(remainingExp)
      setNextLevelExp(nextLevelExp)
      setAchievements(achievements)
      setAverageScore(totalQuizzes > 0 ? totalScore / totalQuizzes : 0)
      setTotalQuizzes(totalQuizzes)
      setTopics(Object.keys(topics))
    }

    loadUserStats()
  }, [])

  const getAchievementIcon = (icon) => {
    switch (icon) {
      case 'trophy':
        return <FaTrophy className="text-yellow-500" />
      case 'star':
        return <FaStar className="text-yellow-400" />
      case 'chart':
        return <FaChartLine className="text-blue-500" />
      case 'code':
        return <FaCode className="text-green-500" />
      default:
        return <FaTrophy className="text-yellow-500" />
    }
  }

    return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section with 3D Background */}
      <div className="relative h-screen">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars />
        </Canvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
                    AI Quiz Generator
                </h1>
            <p className="text-xl text-gray-300 mb-8">
              Test your knowledge with AI-generated programming quizzes
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/quiz')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Quiz
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* User Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Level {level}</h3>
                <p className="text-gray-400">Experience</p>
              </div>
              <FaStar className="text-yellow-500 text-3xl" />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(experience / nextLevelExp) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              {experience} / {nextLevelExp} XP
            </p>
          </motion.div>

          {/* Average Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{averageScore}%</h3>
                <p className="text-gray-400">Average Score</p>
              </div>
              <FaChartLine className="text-green-500 text-3xl" />
                        </div>
            <p className="text-sm text-gray-400">{totalQuizzes} quizzes completed</p>
          </motion.div>

          {/* Topics Mastered Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{topics.length}</h3>
                <p className="text-gray-400">Topics Mastered</p>
              </div>
              <FaCode className="text-blue-500 text-3xl" />
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <span
                                        key={index}
                  className="bg-gray-700 text-xs px-2 py-1 rounded-full"
                                    >
                  {topic}
                </span>
                                ))}
                        </div>
          </motion.div>

          {/* Achievements Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{achievements.length}</h3>
                <p className="text-gray-400">Achievements</p>
              </div>
              <FaTrophy className="text-yellow-500 text-3xl" />
            </div>
            {achievements.length > 0 ? (
              <p className="text-sm text-gray-400">
                Latest: {achievements[achievements.length - 1].name}
              </p>
            ) : (
              <p className="text-sm text-gray-400">No achievements yet</p>
            )}
          </motion.div>
                        </div>

        {/* Puzzle Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Coding Puzzles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {puzzles.map((puzzle) => (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{puzzle.title}</h3>
                  <FaPuzzlePiece className={`text-3xl ${puzzle.completed ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    puzzle.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                    puzzle.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {puzzle.difficulty}
                  </span>
                  <button
                    onClick={() => router.push('/puzzle')}
                    className={`px-4 py-2 rounded-lg ${
                      puzzle.completed
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-lg'
                    }`}
                    disabled={puzzle.completed}
                  >
                    {puzzle.completed ? 'Completed' : 'Start Puzzle'}
                  </button>
                </div>
              </motion.div>
            ))}
                        </div>
                    </div>

        {/* Leaderboard Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Leaderboard</h2>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-4">Rank</th>
                    <th className="pb-4">Name</th>
                    <th className="pb-4">Score</th>
                    <th className="pb-4">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player) => (
                    <tr key={player.rank} className="border-b border-gray-700 last:border-0">
                      <td className="py-4">
                        <div className="flex items-center">
                          {player.rank <= 3 && (
                            <FaCrown className={`mr-2 ${
                              player.rank === 1 ? 'text-yellow-500' :
                              player.rank === 2 ? 'text-gray-400' :
                              'text-amber-700'
                            }`} />
                          )}
                          {player.rank}
                    </div>
                      </td>
                      <td className="py-4">{player.name}</td>
                      <td className="py-4">{player.score}</td>
                      <td className="py-4">{player.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        </div>
    )
}
