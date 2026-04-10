import { useState, useEffect, useRef } from "react";
import { Mic, Sparkles, CheckCircle2, ChevronLeft, RefreshCw, Save, AlertTriangle, Phone, Volume2, ShieldAlert } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { parseVoiceInput, AIResponse } from "@/utils/voiceAI";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

function highlightKeywords(text: string): string {
  const highRisk = ["headache", "swelling", "fever", "bleeding", "pain", "not feeding", "preeclampsia", "critical"];
  const moderate = ["pregnant", "newborn", "diabetic", "8 months", "baby", "diabetes"];

  let result = text;
  highRisk.forEach((kw) => {
    const re = new RegExp(`(${kw})`, "gi");
    result = result.replace(re, '<mark class="bg-rose-200 text-rose-800 rounded px-0.5 font-semibold not-italic">$1</mark>');
  });
  moderate.forEach((kw) => {
    const re = new RegExp(`(${kw})`, "gi");
    result = result.replace(re, '<mark class="bg-amber-200 text-amber-800 rounded px-0.5 font-semibold not-italic">$1</mark>');
  });
  return result;
}

export default function VoiceAssessment() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<AIResponse | null>(null);
  const [statusText, setStatusText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [displayedTranscript, setDisplayedTranscript] = useState("");
  const [transcriptDone, setTranscriptDone] = useState(false);
  const typeWriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 3-Step Flow: 1 = Initial, 2 = Followup, 3 = Result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (searchString.includes("demo=judge")) {
      setTimeout(() => {
        handleDemoChip("Pregnant 8 months, severe headache.");
      }, 800);
    }
  }, [searchString]);

  const simulateFollowUp = () => {
    setStep(2);
    setStatusText("Generating follow-up questions...");
    setTimeout(() => {
      setStatusText("Please ask the patient:");
    }, 1500);
  };

  const handleFollowUpAnswer = (answer: string) => {
    if (isRecording || isAnalyzing) return;
    setIsRecording(true);
    setStatusText(t.listening);
    setTimeout(() => {
      setIsRecording(false);
      setStatusText(t.analyzingRisk);
      runTypewriterAndAnalyze(transcript + ". " + answer);
    }, 1200);
  };

  const runTypewriterAndAnalyze = (fullText: string) => {
    setTranscript(fullText);
    setDisplayedTranscript("");
    setTranscriptDone(false);

    if (typeWriterIntervalRef.current) clearInterval(typeWriterIntervalRef.current);

    const words = fullText.split(" ");
    let currentWordIndex = 0;

    typeWriterIntervalRef.current = setInterval(() => {
      if (currentWordIndex < words.length) {
        setDisplayedTranscript((prev) => prev + (prev ? " " : "") + words[currentWordIndex]);
        currentWordIndex++;
      } else {
        if (typeWriterIntervalRef.current) clearInterval(typeWriterIntervalRef.current);
        setTranscriptDone(true);
        setIsAnalyzing(true);
        setStatusText(t.analyzingRisk);

        setTimeout(() => {
          setIsAnalyzing(false);
          setStatusText("Analysis complete");
          setAnalysis(parseVoiceInput(fullText));
          setStep(3);
        }, 1200);
      }
    }, 100);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setStatusText("Processing audio...");
      if (step === 1) {
        setTranscript("Pregnant woman, severe headache.");
        setDisplayedTranscript("Pregnant woman, severe headache.");
        setTranscriptDone(true);
        simulateFollowUp();
      } else if (step === 2) {
        runTypewriterAndAnalyze(transcript + ". Yes, swelling in feet for two days.");
      }
    } else {
      setIsRecording(true);
      setStatusText(t.listening);
    }
  };

  const handleDemoChip = (text: string) => {
    if (isRecording || isAnalyzing) return;
    setIsRecording(true);
    setStatusText(t.listening);
    
    // Quick typing simulation for step 1
    setTimeout(() => {
        setIsRecording(false);
        setTranscript(text);
        setDisplayedTranscript(text);
        setTranscriptDone(true);
        simulateFollowUp();
    }, 1000);
  };

  const handleSave = () => {
    toast({ title: "Visit Saved", description: "Clinical notes have been added to patient record." });
    setTimeout(() => setLocation("/asha-dashboard"), 1500);
  };

  const handleEscalate = () => {
    toast({
      title: "Supervisor Notified",
      description: "Supervisor Meera Singh has been alerted. ETA: 12 minutes.",
    });
  };

  const resetAssessment = () => {
    setAnalysis(null);
    setTranscript("");
    setDisplayedTranscript("");
    setTranscriptDone(false);
    setStatusText("");
    setStep(1);
  };

  const isCriticalOrHigh = analysis && (analysis.riskLevel === "CRITICAL" || analysis.riskLevel === "HIGH");

  return (
    <div className="min-h-screen bg-[#0A6E4F] flex flex-col fade-in text-white">
      <header className="p-4 flex items-center justify-between sticky top-0 z-10 bg-[#0A6E4F]/90 backdrop-blur-sm shadow-sm">
        <Link href="/asha-dashboard" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-heading font-bold text-lg text-center flex-1">Voice AI Triage</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full relative">
        {(step === 1 || step === 2) && (
          <div className="flex-1 flex flex-col items-center justify-center fade-in pb-12">
            
            {/* Contextual AI Prompt */}
            <div className="text-center w-full mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                <Volume2 className="w-4 h-4 text-[#F5A623]" />
                <span className="font-semibold text-[#F5A623] text-sm uppercase tracking-wider">AI Assistant</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 shadow-sm drop-shadow-sm leading-tight px-4">
                {step === 1 ? t.triageStep1 : statusText}
              </h2>
            </div>
            
            {/* Follow up dynamic questions */}
            {step === 2 && statusText === "Please ask the patient:" && (
               <div className="space-y-3 w-full px-2 mb-8 fade-in slide-up">
                 <div className="bg-white/10 border-l-4 border-[#F5A623] p-4 rounded-r-xl shadow-md">
                    <p className="font-medium text-lg mb-2">"Do you have swelling in your face or hands?"</p>
                    <div className="flex gap-2 mt-3">
                       <button onClick={() => handleFollowUpAnswer("Yes, swelling in feet and hands.")} className="bg-white text-[#0A6E4F] px-4 py-1.5 rounded-full font-bold text-sm">Yes</button>
                       <button onClick={() => handleFollowUpAnswer("No swelling.")} className="bg-white/20 text-white px-4 py-1.5 rounded-full font-bold text-sm">No</button>
                    </div>
                 </div>
                 <div className="bg-white/10 border-l-4 border-white/50 p-4 rounded-r-xl">
                    <p className="font-medium text-lg">"Is your vision blurry?"</p>
                 </div>
               </div>
            )}

            {/* Mic Button */}
            <div className="relative mb-6">
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring"></div>
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring" style={{ animationDelay: "0.5s" }}></div>
                </>
              )}
              <button
                onClick={toggleRecording}
                className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  isRecording ? "bg-destructive text-white scale-105" : "bg-white text-[#0A6E4F] hover:scale-105"
                }`}
                data-testid="button-mic"
              >
                <Mic className={`w-10 h-10 ${isRecording ? "animate-pulse" : ""}`} />
              </button>
            </div>

            {/* Audio Waveform */}
            {isRecording && (
              <div className="flex items-end gap-1.5 mb-6 h-8">
                {[0, 150, 300, 450, 600].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-white/80 rounded-full origin-bottom"
                    style={{
                      height: "32px",
                      animation: "waveBar 0.8s ease-in-out infinite",
                      animationDelay: `${delay}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            <p className="text-lg font-medium mb-4 text-center min-h-8 text-white/90">
              {isRecording ? t.listening : (step === 1 ? t.voicePrompt : "Tap mic to answer")}
            </p>

            {/* Step 1 Pre-filled Chips */}
            {step === 1 && !isRecording && (
              <div className="text-center w-full mt-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => handleDemoChip("Pregnant 8 months, headache, swelling")} className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2.5 rounded-full border border-white/20 transition-colors shadow-sm font-medium">Headache & Swelling</button>
                  <button onClick={() => handleDemoChip("Newborn, fever, not feeding well")} className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2.5 rounded-full border border-white/20 transition-colors shadow-sm font-medium">Newborn Not Feeding</button>
                   <button onClick={() => handleDemoChip("Pregnant, normal movement, some back pain")} className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2.5 rounded-full border border-white/20 transition-colors shadow-sm font-medium">Mild Back Pain</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Analysis Result */}
        {step === 3 && analysis && (
          <div className="flex-1 flex flex-col fade-in slide-up pb-safe">
            
            {/* Disclaimer block mapping to trust & safety MVP features */}
            <div className="bg-amber-900/40 border border-amber-500/30 rounded-xl p-3 mb-4 flex gap-3 text-amber-100 shadow-inner">
               <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
               <p className="text-xs leading-relaxed opacity-90">{t.disclaimer}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 w-full border border-white/20 backdrop-blur-sm mb-4 max-h-[100px] overflow-y-auto">
              <p
                className="text-sm font-mono text-white/90 leading-relaxed italic"
                dangerouslySetInnerHTML={{ __html: `"${highlightKeywords(transcript)}"` }}
              />
            </div>

            <div
              className="bg-card text-card-foreground rounded-2xl p-6 shadow-2xl border-t-4 flex-1 mb-4 flex flex-col"
              style={{
                borderTopColor:
                  analysis.riskLevel === "CRITICAL"
                    ? "hsl(357 77% 56%)"
                    : analysis.riskLevel === "HIGH"
                    ? "#f97316"
                    : analysis.riskLevel === "MEDIUM"
                    ? "hsl(38 90% 55%)"
                    : "hsl(136 63% 47%)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-heading font-bold text-lg">{t.riskSupport}</h2>
              </div>

              <div className="mb-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">{analysis.condition}</h3>
                  <RiskBadge level={analysis.riskLevel} />
                </div>
                
                {/* Confidence indicator mapping to Safety UI metric */}
                <div className="flex items-center gap-1.5 mt-1 mb-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">High AI Confidence</span>
                </div>

                <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 font-semibold text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{analysis.immediateAction}</p>
                </div>
              </div>

              {analysis.riskLevel === "CRITICAL" && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 mb-4 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3 text-sm text-destructive font-medium">
                    <span>Nearest PHC: 8 km</span>
                    <span>•</span>
                    <span>Amb ETA: 18 min</span>
                  </div>
                  <button
                    data-testid="button-call-108"
                    className="flex items-center gap-1 text-white bg-destructive font-bold text-sm border shadow-sm border-destructive/30 rounded-lg px-3 py-1.5 hover:bg-destructive/90 transition-colors"
                    onClick={() => toast({ title: "Calling 108", description: "Connecting to emergency ambulance service..." })}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call 108
                  </button>
                </div>
              )}

              <div className="mb-4">
                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Detected Danger Signs</h4>
                 <div className="flex flex-wrap gap-2">
                    {analysis.dangerSigns.map((sign, idx) => (
                       <div key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                          {sign}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="mb-auto">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recommended Protocol</h4>
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <ul className="space-y-3">
                    {analysis.steps.map((step, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="font-bold text-primary shrink-0">{step.split(".")[0]}.</span>
                        <span className="text-foreground">{step.substring(step.indexOf(".") + 1).trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              {isCriticalOrHigh && (
                <Button
                  data-testid="button-escalate"
                  className="bg-destructive hover:bg-destructive/90 text-white h-14 rounded-xl font-bold shadow-lg w-full text-base"
                  onClick={handleEscalate}
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Escalate to Supervisor
                </Button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white h-14 rounded-xl text-base"
                  onClick={resetAssessment}
                  data-testid="button-retake"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  className="bg-white text-[#0A6E4F] hover:bg-gray-100 h-14 rounded-xl font-bold shadow-lg text-base"
                  onClick={handleSave}
                  data-testid="button-save-visit"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Visit
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
