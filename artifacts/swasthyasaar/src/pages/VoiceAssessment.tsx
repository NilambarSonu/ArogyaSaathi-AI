import { useState, useEffect, useRef } from "react";
import { Mic, Sparkles, CheckCircle2, ChevronLeft, RefreshCw, Save } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { parseVoiceInput, AIResponse } from "@/utils/voiceAI";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function VoiceAssessment() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<AIResponse | null>(null);
  const [statusText, setStatusText] = useState("Tap mic and speak patient symptoms");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // For the typewriter effect
  const [displayedTranscript, setDisplayedTranscript] = useState("");
  const typeWriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if demo mode auto-trigger is requested
    if (searchString.includes("demo=true")) {
      setTimeout(() => {
        handleDemoChip("Pregnant, headache, swelling");
      }, 1500);
    }
  }, [searchString]);

  const runTypewriterAndAnalyze = (fullText: string) => {
    setTranscript(fullText);
    setDisplayedTranscript("");
    
    if (typeWriterIntervalRef.current) {
      clearInterval(typeWriterIntervalRef.current);
    }
    
    const words = fullText.split(" ");
    let currentWordIndex = 0;
    
    typeWriterIntervalRef.current = setInterval(() => {
      if (currentWordIndex < words.length) {
        setDisplayedTranscript(prev => prev + (prev ? " " : "") + words[currentWordIndex]);
        currentWordIndex++;
      } else {
        if (typeWriterIntervalRef.current) clearInterval(typeWriterIntervalRef.current);
        
        setIsAnalyzing(true);
        setStatusText("Analyzing clinical markers...");
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setStatusText("Analysis complete");
          setAnalysis(parseVoiceInput(fullText));
        }, 1000);
      }
    }, 150); // 150ms per word
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setStatusText("Processing audio...");
      // Simulate recognized text since we might not have actual speech recognition
      runTypewriterAndAnalyze("Pregnant woman, 8 months along, complaining of severe headache and swelling in feet for past two days.");
    } else {
      setAnalysis(null);
      setTranscript("");
      setDisplayedTranscript("");
      setIsRecording(true);
      setStatusText("Listening...");
    }
  };

  const handleDemoChip = (text: string) => {
    if (isRecording || isAnalyzing) return;
    setIsRecording(true);
    setStatusText("Listening...");
    
    setTimeout(() => {
      setIsRecording(false);
      setStatusText("Processing audio...");
      runTypewriterAndAnalyze(text);
    }, 1000);
  };

  const handleSave = () => {
    toast({
      title: "Assessment Saved",
      description: "Clinical notes have been added to patient record.",
    });
    setTimeout(() => {
      setLocation("/asha-dashboard");
    }, 1500);
  };

  const resetAssessment = () => {
    setAnalysis(null);
    setTranscript("");
    setDisplayedTranscript("");
    setStatusText("Tap mic and speak patient symptoms");
  };

  return (
    <div className="min-h-screen bg-[#0A6E4F] flex flex-col fade-in text-white">
      <header className="p-4 flex items-center justify-between sticky top-0 z-10 bg-[#0A6E4F]/90 backdrop-blur-sm">
        <Link href="/asha-dashboard" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-heading font-bold text-lg">Voice AI Assessment</h1>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {!analysis && (
          <div className="flex-1 flex flex-col items-center justify-center fade-in">
            <div className="relative mb-12">
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring"></div>
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
                </>
              )}
              <button
                onClick={toggleRecording}
                className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  isRecording 
                    ? "bg-destructive text-white scale-105" 
                    : "bg-white text-[#0A6E4F] hover:scale-105"
                }`}
                data-testid="button-mic"
              >
                <Mic className={`w-12 h-12 ${isRecording ? "animate-pulse" : ""}`} />
              </button>
            </div>

            <p className="text-xl font-medium mb-4 text-center h-8">{statusText}</p>
            
            {displayedTranscript && (
              <div className="bg-white/10 rounded-xl p-4 w-full border border-white/20 backdrop-blur-sm mb-8 text-center min-h-[100px] flex items-center justify-center">
                <p className="text-lg font-mono">"{displayedTranscript}"</p>
              </div>
            )}
            
            {!displayedTranscript && !isRecording && (
              <div className="text-center w-full mt-4">
                <p className="text-white/60 text-sm mb-4">Example scenarios:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button 
                    onClick={() => handleDemoChip("Pregnant, headache, swelling")}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full border border-white/20 transition-colors"
                  >
                    "Pregnant, headache, swelling"
                  </button>
                  <button 
                    onClick={() => handleDemoChip("Newborn, fever, not feeding")}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full border border-white/20 transition-colors"
                  >
                    "Newborn, fever, not feeding"
                  </button>
                  <button 
                    onClick={() => handleDemoChip("Diabetic, missed medication")}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full border border-white/20 transition-colors"
                  >
                    "Diabetic, missed medication"
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {analysis && (
          <div className="flex-1 flex flex-col fade-in animate-in slide-in-from-bottom-8 duration-500 pb-safe">
            <div className="bg-white/10 rounded-xl p-4 w-full border border-white/20 backdrop-blur-sm mb-4">
              <p className="text-sm font-mono text-white/80 italic">"{transcript}"</p>
            </div>

            <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-2xl border-t-4 flex-1 mb-4 flex flex-col" 
                 style={{ borderTopColor: analysis.riskLevel === 'CRITICAL' ? 'var(--color-destructive)' : 
                                          analysis.riskLevel === 'HIGH' ? '#f97316' : 
                                          analysis.riskLevel === 'MEDIUM' ? 'var(--color-secondary)' : 
                                          'var(--color-success)' }}>
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-heading font-bold text-lg">AI Analysis</h2>
              </div>
              
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold leading-tight">{analysis.condition}</h3>
                  <RiskBadge level={analysis.riskLevel} />
                </div>
                <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 font-semibold text-sm flex items-start gap-2">
                  <div className="mt-0.5">⚠️</div>
                  <p>{analysis.immediateAction}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Detected Danger Signs</h4>
                <ul className="space-y-2">
                  {analysis.dangerSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-destructive" />
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-auto">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Recommended Protocol</h4>
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <ul className="space-y-3">
                    {analysis.steps.map((step, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="font-bold text-primary shrink-0">{step.split('.')[0]}.</span>
                        <span className="text-foreground">{step.substring(step.indexOf('.') + 1).trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white h-14 rounded-xl"
                onClick={resetAssessment}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button 
                className="bg-white text-[#0A6E4F] hover:bg-gray-100 h-14 rounded-xl font-bold shadow-lg"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Record
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
