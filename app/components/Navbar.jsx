'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon, FaGamepad, FaTrophy, FaUser, FaHome, FaCode, FaPuzzlePiece, FaBook, FaChartLine } from 'react-icons/fa';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            <FaGamepad className="mr-2" />
            AI Learning Hub
          </Link>
        </div>
        
        <div className="flex-none gap-4">
          <Link href="/" className="btn btn-ghost">
            <FaHome className="mr-2" />
            Home
          </Link>
          <Link href="/quiz" className="btn btn-ghost">
            <FaCode className="mr-2" />
            Quiz
          </Link>
          <Link href="/puzzle" className="btn btn-ghost">
            <FaPuzzlePiece className="mr-2" />
            Puzzle
          </Link>
          <Link href="/story" className="btn btn-ghost">
            <FaBook className="mr-2" />
            Story
          </Link>
          <Link href="/progress" className="btn btn-ghost">
            <FaChartLine className="mr-2" />
            Progress
          </Link>
          <Link href="/leaderboard" className="btn btn-ghost">
            <FaTrophy className="mr-2" />
            Leaderboard
          </Link>
        </div>
        
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
              {theme === 'light' ? (
                <FaMoon className="h-5 w-5" />
              ) : (
                <FaSun className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <FaUser className="w-6 h-6 m-2" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <Link href="/achievements">Achievements</Link>
              </li>
              <li>
                <Link href="/settings">Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 