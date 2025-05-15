'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaLightbulb, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'
import { trackQuizCompletion } from '../components/Analytics'
import { useRouter } from 'next/navigation'

export default function QuizPage() {
  const [quizSettings, setQuizSettings] = useState({
    language: 'javascript',
    difficulty: 'beginner',
    topic: 'basics',
    numQuestions: 5,
  })

  const [quizState, setQuizState] = useState({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    userAnswers: [],
    score: 0,
    isLoading: false,
    isComplete: false,
    error: null,
    showHint: false,
  })

  const router = useRouter()

  const generateQuiz = async () => {
    setQuizState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch('/api/generate-quiz', {
          method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizSettings),
        })

        if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setQuizState(prev => ({
        ...prev,
        questions: data.questions,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        userAnswers: [],
        score: 0,
        isLoading: false,
        error: null,
        showHint: false,
      }))
    } catch (error) {
      console.error('Quiz generation error:', error)
      setQuizState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to generate quiz. Please try again.',
      }))
    }
  }

  const saveQuizHistory = (score, totalQuestions, topic, difficulty) => {
    const quizResult = {
      date: new Date().toISOString(),
      score,
      totalQuestions,
      topic,
      difficulty,
    }

    // Get existing history from localStorage
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    
    // Add new quiz result
    history.unshift(quizResult)
    
    // Keep only the last 10 quizzes
    const recentHistory = history.slice(0, 10)
    
    // Save back to localStorage
    localStorage.setItem('quizHistory', JSON.stringify(recentHistory))
  }

  const handleAnswer = (answer) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correctAnswer
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
      userAnswers: [...prev.userAnswers, answer],
      score: isCorrect ? prev.score + 1 : prev.score,
    }))

    setTimeout(() => {
      if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
          showHint: false,
        }))
      } else {
        setQuizState(prev => ({ ...prev, isComplete: true }))
        
        // Save quiz history
        saveQuizHistory(
          quizState.score + (isCorrect ? 1 : 0),
          quizState.questions.length,
          quizSettings.topic,
          quizSettings.difficulty
        )
        
        trackQuizCompletion(
          quizState.score + (isCorrect ? 1 : 0),
          quizState.questions.length,
          quizSettings.topic
        )
      }
    }, 1500)
  }

  const toggleHint = () => {
    setQuizState(prev => ({
      ...prev,
      showHint: !prev.showHint
    }))
  }

  const renderQuizSetup = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Quiz Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Programming Language</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={quizSettings.language}
            onChange={(e) => setQuizSettings(prev => ({ ...prev, language: e.target.value }))}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="react">React</option>
            <option value="css">CSS</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Difficulty</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={quizSettings.difficulty}
            onChange={(e) => setQuizSettings(prev => ({ ...prev, difficulty: e.target.value }))}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Topic</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={quizSettings.topic}
            onChange={(e) => setQuizSettings(prev => ({ ...prev, topic: e.target.value }))}
          >
            <option value="basics">Basics</option>
            <option value="functions">Functions</option>
            <option value="objects">Objects</option>
            <option value="arrays">Arrays</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Number of Questions</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={quizSettings.numQuestions}
            onChange={(e) => setQuizSettings(prev => ({ ...prev, numQuestions: parseInt(e.target.value) }))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      <button
        className="btn btn-primary w-full mt-8"
        onClick={generateQuiz}
        disabled={quizState.isLoading}
      >
        {quizState.isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Generating Quiz...
          </>
        ) : (
          'Start Quiz'
        )}
      </button>
    </motion.div>
  )

  const renderQuestion = () => {
    const question = quizState.questions[quizState.currentQuestionIndex]
    return (
      <motion.div
        key={quizState.currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm opacity-70">
              Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
            </span>
            <span className="text-sm opacity-70">
              Score: {quizState.score}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`btn btn-outline ${
                  quizState.selectedAnswer === option
                    ? quizState.selectedAnswer === question.correctAnswer
                      ? 'btn-success'
                      : 'btn-error'
                    : ''
                }`}
                onClick={() => handleAnswer(option)}
                disabled={quizState.selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {question.hint && (
          <div className="mt-4">
            <button
              onClick={toggleHint}
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <FaLightbulb />
              <span>Show Hint</span>
            </button>
            {quizState.showHint && (
              <div className="mt-2 p-4 bg-base-200 rounded-lg">
                <p className="text-sm">{question.hint}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    )
  }

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto p-6 text-center"
    >
      <h2 className="text-3xl font-bold mb-6">Quiz Complete!</h2>
      <div className="stats shadow mb-8">
        <div className="stat">
          <div className="stat-title">Final Score</div>
          <div className="stat-value text-primary">
            {Math.round((quizState.score / quizState.questions.length) * 100)}%
          </div>
          <div className="stat-desc">
            {quizState.score} out of {quizState.questions.length} correct
          </div>
        </div>
      </div>

      <div className="grid gap-4 mb-8">
        {quizState.questions.map((question, index) => {
          const userAnswer = quizState.userAnswers[index]
          const isCorrect = userAnswer === question.correctAnswer
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isCorrect ? 'bg-success/10' : 'bg-error/10'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaTimes className="text-error" />
                )}
                <p className="font-medium">{question.question}</p>
              </div>
              <div className="mt-2 text-sm">
                <p className="opacity-70">
                  Your answer: <span className={isCorrect ? 'text-success' : 'text-error'}>{userAnswer}</span>
                </p>
                {!isCorrect && (
                  <p className="text-success mt-1">
                    Correct answer: {question.correctAnswer}
                  </p>
                )}
                <p className="mt-2 opacity-70">
                  Explanation: {question.explanation}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          className="btn btn-primary"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            setQuizState({
              questions: [],
              currentQuestionIndex: 0,
              selectedAnswer: null,
              userAnswers: [],
              score: 0,
              isLoading: false,
              isComplete: false,
              error: null,
              showHint: false,
            })
          }}
        >
          Try Another Quiz
        </button>
      </div>
    </motion.div>
    )

  return (
    <div className="min-h-screen py-8">
      <AnimatePresence mode="wait">
        {quizState.error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="alert alert-error max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center gap-2">
              <FaTimes />
              <span>{quizState.error}</span>
          </div>
          </motion.div>
      )}
        {(!quizState.questions || quizState.questions.length === 0) && !quizState.isLoading && renderQuizSetup()}
        {quizState.questions && quizState.questions.length > 0 && !quizState.isComplete && renderQuestion()}
        {quizState.isComplete && renderResults()}
      </AnimatePresence>
    </div>
  )
}