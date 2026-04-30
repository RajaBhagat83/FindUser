import Bottom from '../Landing/Bottom.jsx';
import Top from "../Landing/Top.jsx";
import Middle from "../Landing/Middle.jsx";

function App() {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-50 selection:bg-violet-500/30 font-sans overflow-x-hidden'>
       <Top />
       <Middle />
       <Bottom />
    </div>
  );
}

export default App;
