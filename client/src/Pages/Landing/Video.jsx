import demovideo from "../../assets/demovideo.mp4";
import { motion } from "framer-motion";

function Video() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1, type: "spring" }}
      className="mt-20 w-full max-w-5xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/50 rounded-t-2xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-12 border-b border-slate-700/50 flex items-center px-6 gap-2 bg-slate-900/80 backdrop-blur-md z-20">
        <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
      </div>
      <div className="relative pt-12 w-full aspect-video bg-black">
        <video
          className="w-full h-full object-contain opacity-90"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={demovideo} type="video/mp4" />
        </video>
        
        {/* Overlay text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-8 right-8 z-30"
        >
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl inline-block max-w-md">
            <p className="text-white text-lg font-medium">
              <span className="text-amber-400">Search People</span> with Similar Interest
              and connect easily.
            </p>
          </div>
        </motion.div>
        
        {/* Fading bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none"></div>
      </div>
    </motion.div>
  );
}

export default Video;
