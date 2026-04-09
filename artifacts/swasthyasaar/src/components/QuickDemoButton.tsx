import { Play } from "lucide-react";
import { useLocation } from "wouter";

export function QuickDemoButton() {
  const [, setLocation] = useLocation();

  const handleDemo = () => {
    setLocation("/voice-assessment?demo=true");
  };

  return (
    <button
      onClick={handleDemo}
      data-testid="button-quick-demo"
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full py-3 px-5 flex items-center gap-2 font-semibold transition-all active:scale-95 z-50 hover-lift"
    >
      <Play className="w-4 h-4 fill-current" />
      Quick Demo
    </button>
  );
}
