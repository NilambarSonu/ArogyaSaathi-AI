import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { QuickDemoButton } from "@/components/QuickDemoButton";
import { LanguageProvider } from "@/context/LanguageContext";

// Pages
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import AshaDashboard from "@/pages/AshaDashboard";
import VoiceAssessment from "@/pages/VoiceAssessment";
import MaternalCheck from "@/pages/MaternalCheck";
import NcdTracker from "@/pages/NcdTracker";
import PatientProfile from "@/pages/PatientProfile";
import SupervisorDashboard from "@/pages/SupervisorDashboard";
import Analytics from "@/pages/Analytics";
import ReferralManagement from "@/pages/ReferralManagement";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/asha-dashboard" component={AshaDashboard} />
      <Route path="/voice-assessment" component={VoiceAssessment} />
      <Route path="/maternal-check" component={MaternalCheck} />
      <Route path="/ncd-tracker" component={NcdTracker} />
      <Route path="/patient/:id" component={PatientProfile} />
      <Route path="/supervisor-dashboard" component={SupervisorDashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/referrals" component={ReferralManagement} />
      
      {/* Aliases for bottom nav */}
      <Route path="/patients" component={AshaDashboard} /> 
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="relative min-h-screen bg-background font-sans text-foreground">
            {/* Show DemoModeBanner globally except on LandingPage which has its own layout */}
            <Switch>
              <Route path="/" component={() => null} />
              <Route component={DemoModeBanner} />
            </Switch>
            
            <Router />
            
            <Switch>
              <Route path="/" component={() => null} />
              <Route component={QuickDemoButton} />
            </Switch>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;