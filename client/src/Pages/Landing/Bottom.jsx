import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiGithub } from "react-icons/fi";

function Bottom() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">BuddyFinder</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering connections for future success. Build meaningful networks and scale your productivity.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 transition-all"><FiTwitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 transition-all"><FiGithub size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 transition-all"><FiLinkedin size={18} /></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-white font-semibold mb-6">About Us</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Our Story</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Find Events</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Partnerships</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Host Events</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Attractions</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} BuddyFinder. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Bottom;
