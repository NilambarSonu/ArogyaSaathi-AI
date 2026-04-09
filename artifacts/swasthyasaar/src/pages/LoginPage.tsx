import { Link } from "wouter";
import { Stethoscope, BarChart2, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "District Admin dashboard is under development.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Select Your Role</h1>
          <p className="text-muted-foreground">Demo Mode — HSIL Hackathon 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Link href="/asha-dashboard">
            <Card className="p-8 flex flex-col items-center justify-center text-center hover-lift cursor-pointer border-2 border-transparent hover:border-primary transition-colors h-64 group bg-card">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">ASHA Worker</h2>
              <p className="text-sm text-muted-foreground">Frontline care, voice assessments, and patient tracking.</p>
            </Card>
          </Link>

          <Link href="/supervisor-dashboard">
            <Card className="p-8 flex flex-col items-center justify-center text-center hover-lift cursor-pointer border-2 border-transparent hover:border-secondary transition-colors h-64 group bg-card">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <BarChart2 className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Block Supervisor</h2>
              <p className="text-sm text-muted-foreground">Monitor ASHA performance, manage referrals and alerts.</p>
            </Card>
          </Link>

          <Card 
            onClick={handleAdminClick}
            className="p-8 flex flex-col items-center justify-center text-center hover-lift cursor-pointer border-2 border-transparent hover:border-muted-foreground/30 transition-colors h-64 group bg-card opacity-70"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-muted-foreground/20 transition-colors">
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">District Admin</h2>
            <p className="text-sm text-muted-foreground">System configuration and high-level analytics.</p>
            <span className="mt-4 text-xs font-semibold bg-muted px-2 py-1 rounded">Coming Soon</span>
          </Card>
        </div>
      </div>
    </div>
  );
}
