'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaTrophy, FaChartLine, FaCode, FaBook, FaPuzzlePiece, FaUser, FaStar, FaHeart, FaRocket, FaGraduationCap } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';
import { useState, useEffect } from 'react';

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
);

const categories = {
  programming: {
    name: 'Programming',
    icon: <FaCode className="text-orange-500" />,
    color: 'from-orange-500 to-yellow-500'
  },
  personality: {
    name: 'Personality Development',
    icon: <FaStar className="text-yellow-500" />,
    color: 'from-yellow-500 to-orange-500'
  },
  lifestyle: {
    name: 'Lifestyle',
    icon: <FaHeart className="text-pink-500" />,
    color: 'from-pink-500 to-purple-500'
  },
  technology: {
    name: 'Technology',
    icon: <FaRocket className="text-blue-500" />,
    color: 'from-blue-500 to-indigo-500'
  },
  education: {
    name: 'Education',
    icon: <FaGraduationCap className="text-green-500" />,
    color: 'from-green-500 to-teal-500'
  }
};

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    programming: {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      topics: {},
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      quizHistory: []
    },
    personality: {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      topics: {},
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      quizHistory: []
    },
    lifestyle: {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      topics: {},
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      quizHistory: []
    },
    technology: {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      topics: {},
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      quizHistory: []
    },
    education: {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      topics: {},
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      quizHistory: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('programming');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const loadUserData = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          const userData = await response.json();
          setStats(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadUserData();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const currentStats = stats[selectedCategory];

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

        {/* Category Selection */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedCategory === key
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Level {currentStats.level}</h3>
                <p className="text-gray-400">Experience</p>
              </div>
              <FaTrophy className="text-yellow-500 text-3xl" />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(currentStats.experience / currentStats.nextLevelExp) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              {currentStats.experience} / {currentStats.nextLevelExp} XP
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{currentStats.totalQuizzes}</h3>
                <p className="text-gray-400">Quizzes Completed</p>
              </div>
              {categories[selectedCategory].icon}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(currentStats.correctAnswers / currentStats.totalQuestions) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              {currentStats.correctAnswers} / {currentStats.totalQuestions} Correct
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{currentStats.achievements?.length || 0}</h3>
                <p className="text-gray-400">Achievements</p>
              </div>
              <FaTrophy className="text-orange-500 text-3xl" />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(currentStats.achievements?.length || 0) * 10}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              {currentStats.achievements?.length || 0} / 10 Unlocked
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{currentStats.averageScore}%</h3>
                <p className="text-gray-400">Average Score</p>
              </div>
              <FaChartLine className="text-orange-500 text-3xl" />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${currentStats.averageScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              Based on {currentStats.totalQuizzes} quizzes
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
              Score History
            </h3>
            <div className="h-64">
              <Line
                data={{
                  labels: currentStats.quizHistory?.map((_, index) => `Quiz ${index + 1}`) || [],
                  datasets: [
                    {
                      label: 'Score',
                      data: currentStats.quizHistory?.map(quiz => quiz.score) || [],
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
              Topic Performance
            </h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: Object.keys(currentStats.topics || {}),
                  datasets: [
                    {
                      label: 'Average Score',
                      data: Object.values(currentStats.topics || {}),
                      backgroundColor: 'rgba(249, 115, 22, 0.5)',
                      borderColor: 'rgb(249, 115, 22)',
                      borderWidth: 1
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
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
            Recent Activity
          </h3>
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
                {currentStats.quizHistory?.slice(0, 5).map((quiz, index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-0">
                    <td className="py-4">{new Date(quiz.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {categories[selectedCategory].icon}
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
  );
} 