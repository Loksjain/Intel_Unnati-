'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPuzzlePiece, FaCode, FaCheck, FaTimes, FaLightbulb } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function PuzzlePage() {
  const router = useRouter()
  const [puzzles, setPuzzles] = useState([
    {
      id: 1,
      title: 'Binary Search',
      difficulty: 'Medium',
      description: 'Implement a binary search algorithm to find a target value in a sorted array.',
      code: `function binarySearch(arr, target) {
  // Your code here
}`,
      testCases: [
        { input: [[1, 2, 3, 4, 5], 3], output: 2 },
        { input: [[1, 2, 3, 4, 5], 6], output: -1 },
      ],
      completed: false,
      hint: 'Remember that binary search works by repeatedly dividing the search interval in half.',
    },
    {
      id: 2,
      title: 'Dynamic Programming',
      difficulty: 'Hard',
      description: 'Implement the Fibonacci sequence using dynamic programming to optimize performance.',
      code: `function fibonacci(n) {
  // Your code here
}`,
      testCases: [
        { input: [5], output: 5 },
        { input: [10], output: 55 },
      ],
      completed: false,
      hint: 'Use memoization to store previously calculated values.',
    },
    {
      id: 3,
      title: 'Graph Traversal',
      difficulty: 'Easy',
      description: 'Implement a depth-first search algorithm for a graph represented as an adjacency list.',
      code: `function dfs(graph, start) {
  // Your code here
}`,
      testCases: [
        { input: [{ 0: [1, 2], 1: [2], 2: [0, 3], 3: [3] }, 2], output: [2, 0, 1, 3] },
        { input: [{ 0: [1], 1: [2], 2: [3], 3: [] }, 0], output: [0, 1, 2, 3] },
      ],
      completed: false,
      hint: 'Use a stack or recursion to implement DFS.',
    },
  ])
  const [currentPuzzle, setCurrentPuzzle] = useState(null)
  const [userCode, setUserCode] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    // Load completed puzzles from localStorage
    const completedPuzzles = JSON.parse(localStorage.getItem('completedPuzzles') || '[]')
    setPuzzles(prevPuzzles => 
      prevPuzzles.map(puzzle => ({
        ...puzzle,
        completed: completedPuzzles.includes(puzzle.id)
      }))
    )
  }, [])

  const handlePuzzleSelect = (puzzle) => {
    setCurrentPuzzle(puzzle)
    setUserCode(puzzle.code)
    setShowHint(false)
    setTestResults([])
  }

  const runTests = () => {
    if (!currentPuzzle) return

    const results = currentPuzzle.testCases.map(testCase => {
      try {
        // Create a new function from the user's code
        const func = new Function('return ' + userCode)()
        const result = func(...testCase.input)
        const passed = JSON.stringify(result) === JSON.stringify(testCase.output)
        return { passed, input: testCase.input, expected: testCase.output, got: result }
      } catch (error) {
        return { passed: false, input: testCase.input, expected: testCase.output, error: error.message }
      }
    })

    setTestResults(results)

    // If all tests pass, mark puzzle as completed
    if (results.every(r => r.passed)) {
      const updatedPuzzles = puzzles.map(p => 
        p.id === currentPuzzle.id ? { ...p, completed: true } : p
      )
      setPuzzles(updatedPuzzles)
      setCurrentPuzzle({ ...currentPuzzle, completed: true })
      
      // Save to localStorage
      const completedPuzzles = JSON.parse(localStorage.getItem('completedPuzzles') || '[]')
      if (!completedPuzzles.includes(currentPuzzle.id)) {
        localStorage.setItem('completedPuzzles', JSON.stringify([...completedPuzzles, currentPuzzle.id]))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
            Coding Puzzles
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Puzzle List */}
          <div className="lg:col-span-1 space-y-4">
            {puzzles.map((puzzle) => (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  currentPuzzle?.id === puzzle.id
                    ? 'bg-orange-500'
                    : puzzle.completed
                    ? 'bg-green-900'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handlePuzzleSelect(puzzle)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{puzzle.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      puzzle.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                      puzzle.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                    {puzzle.completed && <FaCheck className="text-green-500" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code Editor and Tests */}
          <div className="lg:col-span-2">
            {currentPuzzle ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">{currentPuzzle.title}</h2>
                  <p className="text-gray-300 mb-4">{currentPuzzle.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-gray-300">Your Solution:</label>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-2 text-orange-500 hover:text-orange-400"
                      >
                        <FaLightbulb />
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </button>
                    </div>
                    {showHint && (
                      <div className="bg-gray-700 p-4 rounded-lg mb-4 text-gray-300">
                        {currentPuzzle.hint}
                      </div>
                    )}
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-48 bg-gray-900 text-white p-4 rounded-lg font-mono"
                      spellCheck="false"
                    />
                  </div>

                  <button
                    onClick={runTests}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Run Tests
                  </button>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Test Results</h3>
                    <div className="space-y-4">
                      {testResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            result.passed ? 'bg-green-900' : 'bg-red-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {result.passed ? (
                              <FaCheck className="text-green-500" />
                            ) : (
                              <FaTimes className="text-red-500" />
                            )}
                            <span>Test Case {index + 1}</span>
                          </div>
                          <div className="text-sm">
                            <p>Input: {JSON.stringify(result.input)}</p>
                            <p>Expected: {JSON.stringify(result.expected)}</p>
                            {result.passed ? (
                              <p>Got: {JSON.stringify(result.got)}</p>
                            ) : (
                              <p className="text-red-300">
                                {result.error || `Got: ${JSON.stringify(result.got)}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-lg p-6 text-center"
              >
                <FaPuzzlePiece className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Puzzle</h3>
                <p className="text-gray-400">
                  Choose a coding puzzle from the list to start solving
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 