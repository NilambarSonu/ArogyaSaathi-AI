import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Mic, Activity, Heart, Presentation } from "lucide-react";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { QuickDemoButton } from "@/components/QuickDemoButton";

export default function LandingPage() {
  const [workers, setWorkers] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [rural, setRural] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setWorkers(Math.min(1.3, (1.3 / steps) * currentStep));
      setDeaths(Math.min(300, (300 / steps) * currentStep));
      setRural(Math.min(600, (600 / steps) * currentStep));
      
      if (currentStep >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A6E4F] to-[#1B4332] flex flex-col fade-in">
      <DemoModeBanner />
      <QuickDemoButton />
      
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 800 800" className="w-[120%] h-[120%] text-white fill-current">
           <path d="M400,100 L450,150 L430,200 L480,220 L500,180 L550,230 L530,280 L580,300 L600,350 L560,400 L580,450 L540,500 L560,550 L510,600 L460,580 L420,620 L380,590 L340,630 L300,580 L260,590 L240,550 L200,560 L220,500 L180,450 L220,400 L180,350 L200,300 L250,280 L230,230 L280,180 L300,220 L350,200 L330,150 Z" />
        </svg>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 z-10 text-center text-white">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm animate-pulse-ring">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
          ArogyaSaathi <span className="text-[#F5A623]">AI</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium text-white/90 mb-12 max-w-2xl leading-relaxed">
          AI-assisted maternal and newborn risk triage for frontline health workers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-mono font-bold text-[#E63946] mb-2">{Math.floor(deaths)}k+</div>
            <div className="text-sm font-medium text-white/80 uppercase tracking-wider">Preventable Maternal Deaths</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-mono font-bold text-[#F5A623] mb-2">{workers.toFixed(1)}M+</div>
            <div className="text-sm font-medium text-white/80 uppercase tracking-wider">ASHA Workers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-mono font-bold text-[#2DC653] mb-2">{Math.floor(rural)}M</div>
            <div className="text-sm font-medium text-white/80 uppercase tracking-wider">Rural Indians Served</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl w-full">
          <div className="bg-white text-[#1A1A2E] rounded-xl p-5 hover-lift text-left shadow-xl">
            <Mic className="w-6 h-6 text-[#0A6E4F] mb-3" />
            <h3 className="font-bold text-lg mb-1">Voice-First Triage</h3>
            <p className="text-sm text-[#6B7280]">Natural language understanding for low-literacy environments.</p>
          </div>
          <div className="bg-white text-[#1A1A2E] rounded-xl p-5 hover-lift text-left shadow-xl">
            <Activity className="w-6 h-6 text-[#0A6E4F] mb-3" />
            <h3 className="font-bold text-lg mb-1">Smart Danger Signs</h3>
            <p className="text-sm text-[#6B7280]">Identify critical maternal & newborn risks instantly.</p>
          </div>
          <div className="bg-white text-[#1A1A2E] rounded-xl p-5 hover-lift text-left shadow-xl">
            <Heart className="w-6 h-6 text-[#0A6E4F] mb-3" />
            <h3 className="font-bold text-lg mb-1">Escalate & Track</h3>
            <p className="text-sm text-[#6B7280]">Connect field health workers to nearest PHCs securely.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link 
            href="/login" 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            Enter Dashboard 
            <span className="text-xl">→</span>
          </Link>

          <Link 
            href="/voice-assessment?demo=judge" 
            className="bg-[#F5A623] hover:bg-[#d98f1a] text-[#1A1A2E] font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-all hover:shadow-[0_0_30px_rgba(245,166,35,0.6)] active:scale-95 flex items-center gap-2"
          >
            <Presentation className="w-5 h-5" />
            Start Judge Demo
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-white/60 text-sm z-10">
        Harvard HSIL Hackathon 2026 | Team ArogyaSaathi
      </footer>
    </div>
  );
}

