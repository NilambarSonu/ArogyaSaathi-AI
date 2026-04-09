import { useState, useEffect } from "react";
import { Play, X, CheckCircle2, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const DEMO_STEPS = [
  "Opening ASHA Dashboard",
  "Loading Voice AI — Maternal Case",
  "Analyzing High-Risk Symptoms",
  "Escalating to Supervisor",
];

export function QuickDemoButton() {
  const [, setLocation] = useLocation();
  const [isRunning, setIsRunning] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isRunning) return;

    const timers: NodeJS.Timeout[] = [];

    timers.push(
      setTimeout(() => {
        setCurrentStep(0);
        setLocation("/asha-dashboard");
      }, 100)
    );
    timers.push(
      setTimeout(() => {
        setDoneSteps([0]);
        setCurrentStep(1);
        setLocation("/voice-assessment?demo=true");
      }, 2000)
    );
    timers.push(
      setTimeout(() => {
        setDoneSteps([0, 1]);
        setCurrentStep(2);
      }, 6000)
    );
    timers.push(
      setTimeout(() => {
        setDoneSteps([0, 1, 2]);
        setCurrentStep(3);
        setLocation("/supervisor-dashboard");
      }, 9500)
    );
    timers.push(
      setTimeout(() => {
        setDoneSteps([0, 1, 2, 3]);
        setCurrentStep(-1);
        setIsRunning(false);
        setTimeout(() => setIsPanelOpen(false), 2000);
      }, 11500)
    );

    return () => timers.forEach(clearTimeout);
  }, [isRunning, setLocation]);

  const startDemo = () => {
    setDoneSteps([]);
    setCurrentStep(-1);
    setIsRunning(true);
    setIsPanelOpen(true);
  };

  const stopDemo = () => {
    setIsRunning(false);
    setIsPanelOpen(false);
    setCurrentStep(-1);
    setDoneSteps([]);
  };

  return (
    <>
      {isPanelOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-4 md:right-8 z-50 bg-card border border-border rounded-2xl shadow-2xl w-72 p-4 slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span className="font-bold text-sm text-foreground">Live Demo in Progress</span>
            </div>
            <button onClick={stopDemo} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {DEMO_STEPS.map((step, idx) => {
              const isDone = doneSteps.includes(idx);
              const isCurrent = currentStep === idx;
              const isPending = !isDone && !isCurrent;

              return (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isDone
                        ? "text-muted-foreground line-through"
                        : isCurrent
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {doneSteps.length === DEMO_STEPS.length && (
            <div className="mt-4 p-2 bg-green-50 rounded-lg text-center text-xs font-semibold text-green-700 border border-green-200">
              Demo complete!
            </div>
          )}
        </div>
      )}

      <button
        onClick={isRunning ? stopDemo : startDemo}
        data-testid="button-guided-demo"
        className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 shadow-lg rounded-full py-3 px-5 flex items-center gap-2 font-semibold transition-all active:scale-95 z-50 hover-lift ${
          isRunning
            ? "bg-destructive hover:bg-destructive/90 text-white"
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }`}
      >
        {isRunning ? (
          <>
            <X className="w-4 h-4" />
            Stop Demo
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Guided Demo
          </>
        )}
      </button>
    </>
  );
}
