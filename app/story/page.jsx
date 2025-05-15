'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaUser, FaHeart, FaLaptop, FaGraduationCap, FaArrowLeft, FaArrowRight, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'

const categories = {
  programming: {
    name: 'Programming',
    icon: <FaCode className="text-blue-500" />,
    topics: ['Ethical Coding', 'Team Collaboration', 'Clean Code', 'Problem Solving', 'Tech Impact'],
    stories: [
      {
        id: 1,
        title: 'The Magic of Variables',
        description: 'Learn about variables and their importance in programming',
        content: `Once upon a time in the land of Codeville, there lived a young programmer named Alex. Alex was learning about variables, the magical containers that hold data in programming.

"Variables are like boxes," explained Professor Code. "You can put different things in them and change what's inside whenever you want."

Alex learned about different types of variables:
- String variables for text: \`let name = "Alex";\`
- Number variables for numbers: \`let age = 25;\`
- Boolean variables for true/false: \`let isLearning = true;\`

The key lesson was that variables make code flexible and reusable.`,
        questions: [
          {
            question: 'What is a variable in programming?',
            options: [
              'A container that holds data',
              'A type of function',
              'A programming language',
              'A computer part'
            ],
            correctAnswer: 'A container that holds data'
          },
          {
            question: 'Which of these is a string variable?',
            options: [
              'let name = "Alex"',
              'let age = 25',
              'let isLearning = true',
              'let x = 10'
            ],
            correctAnswer: 'let name = "Alex"'
          },
          {
            question: 'Why are variables important in programming?',
            options: [
              'They make code flexible and reusable',
              'They make the computer faster',
              'They create beautiful websites',
              'They prevent errors'
            ],
            correctAnswer: 'They make code flexible and reusable'
          }
        ]
      },
      // ... other programming stories ...
    ]
  },
  personality: {
    name: 'Personality Development',
    icon: <FaUser className="text-purple-500" />,
    topics: ['Integrity', 'Emotional Intelligence', 'Leadership', 'Communication', 'Decision Making']
  },
  lifestyle: {
    name: 'Lifestyle',
    icon: <FaHeart className="text-red-500" />,
    topics: ['Work-Life Balance', 'Healthy Habits', 'Relationships', 'Mindfulness', 'Sustainability']
  },
  technology: {
    name: 'Technology',
    icon: <FaLaptop className="text-green-500" />,
    topics: ['Digital Ethics', 'Privacy', 'Security', 'Innovation', 'Social Impact']
  },
  education: {
    name: 'Education',
    icon: <FaGraduationCap className="text-yellow-500" />,
    topics: ['Lifelong Learning', 'Critical Thinking', 'Academic Integrity', 'Knowledge Sharing', 'Growth Mindset']
  }
}

export default function StoryPage() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('programming')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedStory, setGeneratedStory] = useState(null)
  const [customTopic, setCustomTopic] = useState('')
  const [quizState, setQuizState] = useState({
    isQuizActive: false,
    currentQuestion: 0,
    score: 0,
    selectedAnswer: null,
    showFeedback: false,
    isCorrect: false,
  })

  const currentStories = categories[selectedCategory]?.stories || []
  const currentStory = generatedStory || currentStories[currentStoryIndex]

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedTopic('')
    setCurrentStoryIndex(0)
    setShowQuiz(false)
    setSelectedAnswers({})
    setScore(0)
    setStories([])
    setGeneratedStory(null)
    setError(null)
    setQuizState(prev => ({
      ...prev,
      isQuizActive: false,
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      showFeedback: false,
    }))
  }

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    
    try {
      const newStory = await generateStory(selectedCategory, topic);
      if (newStory) {
        setStories([newStory]);
        setCurrentStoryIndex(0);
        setShowQuiz(false);
        setSelectedAnswers({});
        setScore(0);
      }
    } catch (error) {
      console.error('Error in handleTopicSelect:', error);
      setError(error.message || 'Failed to generate story');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (quizState.showFeedback) return;

    const isCorrect = answerIndex === currentStory.questions[quizState.currentQuestion].correctAnswer;
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  }

  const handleSubmitQuiz = () => {
    let correctCount = 0
    currentStory.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++
      }
    })
    setScore(correctCount)
  }

  const handleNextStory = () => {
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1)
      setShowQuiz(false)
      setSelectedAnswers({})
      setScore(0)
      setGeneratedStory(null)
      setError(null)
    }
  }

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
      setShowQuiz(false)
      setSelectedAnswers({})
      setScore(0)
      setGeneratedStory(null)
      setError(null)
    }
  }

  const handleGenerateStory = async () => {
    if (!customTopic.trim()) {
      setError('Please enter a topic')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          topic: customTopic.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate story')
      }

      const data = await response.json()

      if (!data.story) {
        throw new Error('Invalid response from server')
      }

      // Generate quiz questions for the story
      const quizResponse = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story: data.story.content,
          category: data.story.category,
        }),
      })

      if (!quizResponse.ok) {
        const errorData = await quizResponse.json()
        throw new Error(errorData.error || 'Failed to generate quiz')
      }

      const quizData = await quizResponse.json()

      if (!quizData.questions) {
        throw new Error('Invalid quiz response from server')
      }

      setGeneratedStory({
        id: Date.now(),
        title: data.story.title,
        description: 'AI Generated Story',
        content: data.story.content,
        category: data.story.category,
        topic: data.story.topic,
        questions: quizData.questions,
      })

      setShowQuiz(false)
      setSelectedAnswers({})
      setScore(0)
      setQuizState(prev => ({
        ...prev,
        isQuizActive: false,
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        showFeedback: false,
      }))
    } catch (error) {
      console.error('Error generating story:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const generateStory = async (category, topic) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, topic }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Failed to generate story')
      }

      const data = await response.json()
      
      if (!data.story || !data.quiz) {
        throw new Error('Invalid response from server')
      }

      return {
        id: Date.now(),
        title: `${topic || category} Story`,
        description: `Learn about ${topic || category}`,
        content: data.story,
        questions: data.quiz.questions
      }
    } catch (error) {
      console.error('Error in generateStory:', error)
      setError(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      isQuizActive: true,
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      showFeedback: false,
    }));
  };

  const handleNextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      selectedAnswer: null,
      showFeedback: false,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Interactive Stories</h1>
        
        {/* Category Selection */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {Object.entries(categories).map(([key, { name, icon }]) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedCategory === key
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <span className="text-xl">{icon}</span>
              {name}
            </button>
          ))}
        </div>

        {/* Topic Selection */}
        {selectedCategory && !selectedTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {categories[selectedCategory].topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-4 rounded-lg transition-all duration-300 border border-gray-700"
              >
                {topic}
              </button>
            ))}
          </motion.div>
        )}

        {/* Custom Topic Input */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter a topic for your story..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGenerateStory}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate Story</span>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-2">Error</h3>
                <p className="text-red-100">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-300 hover:text-red-100"
              >
                <FaTimes />
              </button>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-red-300 hover:text-red-100"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
            <p className="text-gray-400">Generating your story...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </motion.div>
        )}

        {/* Story Content */}
        {currentStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700"
          >
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
              {currentStory.title}
            </h1>
            <p className="text-gray-400 mb-6">{currentStory.description}</p>
            
            <div className="prose prose-invert max-w-none mb-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
              {currentStory.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-300">{paragraph}</p>
              ))}
            </div>

            {!quizState.isQuizActive ? (
              <button
                onClick={handleStartQuiz}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/20"
              >
                Take Quiz
              </button>
            ) : (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
                  Quiz
                </h2>
                <div className="space-y-6">
                  {currentStory.questions.map((q, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <p className="font-semibold mb-4 text-gray-300 text-lg">{q.question}</p>
                      <div className="space-y-3 mb-4">
                        {q.options.map((option, i) => (
                          <label
                            key={i}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              checked={selectedAnswers[index] === option}
                              onChange={() => handleAnswerSelect(i)}
                              className="form-radio text-blue-500"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">Key Lessons</h3>
                  <ul className="space-y-2 text-gray-400">
                    {currentStory.questions.map((q, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>{q.explanation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={handleSubmitQuiz}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Answers
                </button>
                {score > 0 && (
                  <p className="mt-4 text-lg">
                    Your score: {score} out of {currentStory.questions.length}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePreviousStory}
                disabled={currentStoryIndex === 0}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg border border-gray-700 transition-all duration-300"
              >
                <FaArrowLeft /> Previous Story
              </button>
              <button
                onClick={handleNextStory}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-700 transition-all duration-300"
              >
                Next Story <FaArrowRight />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 