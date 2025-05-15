'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
            Global Leaderboard
          </h1>
          <p className="text-gray-400 mt-2">Top performers in programming quizzes</p>
        </motion.div>

        <div className="grid gap-4">
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800 rounded-xl p-4 shadow-lg ${
                index < 3 ? 'border-2' : ''
              } ${
                index === 0
                  ? 'border-yellow-500'
                  : index === 1
                  ? 'border-gray-400'
                  : index === 2
                  ? 'border-orange-500'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {index < 3 ? (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : 'bg-orange-500'
                        }`}
                      >
                        {index === 0 ? (
                          <FaCrown className="text-white" />
                        ) : index === 1 ? (
                          <FaTrophy className="text-white" />
                        ) : (
                          <FaMedal className="text-white" />
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 font-bold">#{index + 1}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-400">Level {user.level}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">{user.score}</p>
                  <p className="text-sm text-gray-400">Total XP</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Quizzes: {user.quizzesCompleted}</span>
                  <span>Average Score: {user.averageScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full"
                    style={{ width: `${(user.experience / user.nextLevelExp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 