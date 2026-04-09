import { useState, useEffect, useRef } from "react";
import { Mic, Sparkles, CheckCircle2, ChevronLeft, RefreshCw, Save, AlertTriangle, Phone } from "lucide-react";
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

  useEffect(() => {
    if (searchString.includes("demo=true")) {
      setTimeout(() => {
        handleDemoChip("Pregnant, headache, swelling");
      }, 1500);
    }
  }, [searchString]);

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
        setStatusText(t.analyzing);

        setTimeout(() => {
          setIsAnalyzing(false);
          setStatusText("Analysis complete");
          setAnalysis(parseVoiceInput(fullText));
        }, 1000);
      }
    }, 120);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setStatusText("Processing audio...");
      runTypewriterAndAnalyze("Pregnant woman, 8 months along, complaining of severe headache and swelling in feet for past two days.");
    } else {
      setAnalysis(null);
      setTranscript("");
      setDisplayedTranscript("");
      setTranscriptDone(false);
      setIsRecording(true);
      setStatusText(t.listening);
    }
  };

  const handleDemoChip = (text: string) => {
    if (isRecording || isAnalyzing) return;
    setIsRecording(true);
    setStatusText(t.listening);
    setTimeout(() => {
      setIsRecording(false);
      setStatusText("Processing audio...");
      runTypewriterAndAnalyze(text);
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
  };

  const isCriticalOrHigh = analysis && (analysis.riskLevel === "CRITICAL" || analysis.riskLevel === "HIGH");

  return (
    <div className="min-h-screen bg-[#0A6E4F] flex flex-col fade-in text-white">
      <header className="p-4 flex items-center justify-between sticky top-0 z-10 bg-[#0A6E4F]/90 backdrop-blur-sm">
        <Link href="/asha-dashboard" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-heading font-bold text-lg">Voice AI Assessment</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {!analysis && (
          <div className="flex-1 flex flex-col items-center justify-center fade-in">
            <div className="relative mb-8">
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring"></div>
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring" style={{ animationDelay: "0.5s" }}></div>
                </>
              )}
              <button
                onClick={toggleRecording}
                className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  isRecording ? "bg-destructive text-white scale-105" : "bg-white text-[#0A6E4F] hover:scale-105"
                }`}
                data-testid="button-mic"
              >
                <Mic className={`w-12 h-12 ${isRecording ? "animate-pulse" : ""}`} />
              </button>
            </div>

            {isRecording && (
              <div className="flex items-end gap-1 mb-6 h-10">
                {[0, 150, 300, 450, 600].map((delay, i) => (
                  <div
                    key={i}
                    className="w-2 bg-white/80 rounded-full origin-bottom"
                    style={{
                      height: "40px",
                      animation: "waveBar 0.8s ease-in-out infinite",
                      animationDelay: `${delay}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            <p className="text-xl font-medium mb-4 text-center min-h-8">
              {statusText || t.voicePrompt}
            </p>

            {displayedTranscript && (
              <div className="bg-white/10 rounded-xl p-4 w-full border border-white/20 backdrop-blur-sm mb-4 min-h-[80px] flex items-center justify-center">
                {transcriptDone ? (
                  <p
                    className="text-base font-mono text-center leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: `"${highlightKeywords(displayedTranscript)}"` }}
                  />
                ) : (
                  <p className="text-base font-mono text-center">"{displayedTranscript}"</p>
                )}
              </div>
            )}

            {!displayedTranscript && !isRecording && (
              <div className="text-center w-full mt-4">
                <p className="text-white/60 text-sm mb-4">{t.scenarioLabel}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleDemoChip("Pregnant, headache, swelling")}
                    data-testid="chip-maternal"
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full border border-white/20 transition-colors"
                  >
                    "Pregnant, headache, swelling"
                  </button>
                  <button
                    onClick={() => handleDemoChip("Newborn, fever, not feeding")}
                    data-testid="chip-newborn"
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full border border-white/20 transition-colors"
                  >
                    "Newborn, fever, not feeding"
                  </button>
                  <button
                    onClick={() => handleDemoChip("Diabetic, missed medication")}
                    data-testid="chip-ncd"
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
          <div className="flex-1 flex flex-col fade-in slide-up pb-safe">
            <div className="bg-white/10 rounded-xl p-4 w-full border border-white/20 backdrop-blur-sm mb-4">
              <p
                className="text-sm font-mono text-white/90 leading-relaxed"
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
                <h2 className="font-heading font-bold text-lg">AI Analysis</h2>
              </div>

              <div className="mb-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold leading-tight">{analysis.condition}</h3>
                  <RiskBadge level={analysis.riskLevel} />
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
                    className="flex items-center gap-1 text-destructive font-bold text-sm border border-destructive/30 rounded-lg px-3 py-1.5 hover:bg-destructive/10 transition-colors"
                    onClick={() => toast({ title: "Calling 108", description: "Connecting to emergency ambulance service..." })}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call 108
                  </button>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Detected Danger Signs</h4>
                <ul className="space-y-2">
                  {analysis.dangerSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-destructive shrink-0" />
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
                  className="bg-destructive hover:bg-destructive/90 text-white h-14 rounded-xl font-bold shadow-lg w-full"
                  onClick={handleEscalate}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalate to Supervisor
                </Button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white h-14 rounded-xl"
                  onClick={resetAssessment}
                  data-testid="button-retake"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  className="bg-white text-[#0A6E4F] hover:bg-gray-100 h-14 rounded-xl font-bold shadow-lg"
                  onClick={handleSave}
                  data-testid="button-save-visit"
                >
                  <Save className="w-4 h-4 mr-2" />
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
