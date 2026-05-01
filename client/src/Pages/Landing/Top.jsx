import { useNavigate } from "react-router-dom";
import Taskbar from "./Taskbar.jsx";
import Video from "./Video.jsx";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

function Top() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]"></div>
      </div>

      <Taskbar />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-32 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Empowering Connections for Future Success
          </motion.div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-tight">
            Build future <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              growth with compatible
            </span>
            <br className="hidden md:block" /> individuals
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover opportunities, build meaningful networks, and boost your productivity. Engage with the right people, exchange skills, and achieve more together.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/users/sign_up")}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Start for free <FiArrowRight />
            </button>
            <button
              onClick={() => navigate("/users/sign_in")}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
          </motion.div>
        </motion.div>

        {/* Video component */}
        <Video />
        
      </main>
    </div>
  );
}

export default Top;
