import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

function Taskbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-inter tracking-tight">
            BuddyFinder
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#product" className="hover:text-violet-400 transition-colors">Products</a>
          <a href="#about" className="hover:text-violet-400 transition-colors">About</a>
          <a href="#blog" className="hover:text-violet-400 transition-colors">Blog</a>
          <a href="#contact" className="hover:text-violet-400 transition-colors">Contact</a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigate('/users/sign_in')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/users/sign_up')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-6 py-6 space-y-4"
        >
          <div className="flex flex-col gap-4 text-slate-300">
            <a href="#product" className="hover:text-violet-400" onClick={() => setIsOpen(false)}>Products</a>
            <a href="#about" className="hover:text-violet-400" onClick={() => setIsOpen(false)}>About</a>
            <a href="#blog" className="hover:text-violet-400" onClick={() => setIsOpen(false)}>Blog</a>
            <a href="#contact" className="hover:text-violet-400" onClick={() => setIsOpen(false)}>Contact</a>
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
            <button 
              onClick={() => navigate('/users/sign_in')}
              className="w-full px-5 py-3 text-sm font-semibold bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/users/sign_up')}
              className="w-full px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-colors"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Taskbar;
