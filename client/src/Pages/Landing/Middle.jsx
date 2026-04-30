import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiTrendingUp, FiShield, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Connection from "../../assets/Connection.png";
import World from "../../assets/World.png";

const features = [
  {
    icon: <FiUsers className="w-6 h-6 text-violet-400" />,
    title: "Seamless Collaboration",
    desc: "Discover opportunities and build networks directly on the platform. Find mentors, peers, and like-minded individuals in just a few clicks."
  },
  {
    icon: <FiShield className="w-6 h-6 text-emerald-400" />,
    title: "Secure & Private",
    desc: "Take control of your professional growth while keeping all your data secure and entirely in your hands."
  },
  {
    icon: <FiZap className="w-6 h-6 text-amber-400" />,
    title: "Lightning Fast Matching",
    desc: "Use intelligent filters and our fast search to connect with the right people who align with your personal goals."
  },
  {
    icon: <FiTrendingUp className="w-6 h-6 text-rose-400" />,
    title: "2x Productivity",
    desc: "Customize your workflows, track your connection progress, and unlock insights that help you grow smarter and faster."
  }
];

function Middle() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-950 text-slate-50 py-24 relative overflow-hidden" id="product">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-full h-[500px] bg-indigo-900/10 -skew-y-6 transform -translate-y-1/2 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-violet-400 font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Why choose BuddyFinder
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Multiply Your Output With the Power of Collaboration
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            The fastest way to grow your connection network, scale your projects, and share your insights with a community of driven individuals.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-32">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 hover:border-violet-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-100">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* About Section with Image */}
        <div id="about" className="flex flex-col md:flex-row items-center gap-12 py-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">The fastest way to grow your connection</h2>
            <p className="text-slate-400 text-lg mb-8">
              Seamlessly expand your reach with continuous updates that drive efficiency. Find like-minded people, use intelligent filters, and keep track of everything in one place.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-800 bg-slate-900/30 p-4">
              <img src={Connection} alt="Connections Dashboard" className="w-full h-auto object-contain max-h-[400px] mx-auto opacity-90 hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        </div>

        {/* Blog/Scale Section with Image */}
        <div id="blog" className="flex flex-col md:flex-row-reverse items-center gap-12 py-20">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Scale faster with dedicated support</h2>
            <ul className="space-y-4 text-slate-400 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-violet-500 mt-1">●</span> Share feedback to shape updates that make your journey smoother.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-500 mt-1">●</span> Invite others to share their insights and grow together as a community.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-500 mt-1">●</span> Connect, share, and gain access to the best crowd to help you succeed.
              </li>
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-slate-800 flex justify-center bg-slate-900/30 p-4">
              <img src={World} alt="Global Network" className="w-full h-auto object-contain max-h-[400px] mx-auto opacity-90 hover:opacity-100 transition-opacity drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Big CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 md:p-16 rounded-[3rem] bg-gradient-to-r from-violet-600 to-indigo-600 relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10 md:w-2/3 text-center md:text-left mb-8 md:mb-0">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Scale faster with dedicated support
            </h3>
            <p className="text-violet-200 text-lg">
              Join thousands of professionals already accelerating their growth.
            </p>
          </div>
          
          <div className="relative z-10">
            <button 
              onClick={() => navigate('/users/sign_up')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Join the Community
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Middle;
