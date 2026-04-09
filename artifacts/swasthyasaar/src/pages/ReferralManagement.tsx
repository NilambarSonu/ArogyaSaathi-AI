import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockReferrals } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { CheckCircle2, ChevronRight, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ReferralManagement() {
  const activeReferrals = mockReferrals.filter(r => r.status !== "Complete");
  const completedReferrals = mockReferrals.filter(r => r.status === "Complete");

  const steps = [
    "Initiated", 
    "ASHA Notified", 
    "Patient Traveling", 
    "Received at PHC", 
    "Complete"
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar role="Block Supervisor" userName="Rajesh Kumar" />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-heading">Referral Management</h1>
            <p className="text-muted-foreground text-sm">Track patient transfers across the block facility network.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="shadow-sm hover-lift font-bold">
                <Plus className="w-4 h-4 mr-2" /> New Referral
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Initiate New Referral</DialogTitle>
              </DialogHeader>
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <Activity className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">Select a patient from the patient directory to initiate a referral process.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Active Pipeline
        </h2>
        
        <div className="space-y-4 mb-10">
          {activeReferrals.map((referral) => (
            <Card key={referral.id} className="p-5 shadow-sm border-border hover-lift">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg">{referral.patientName}</h3>
                    <RiskBadge level={referral.urgency} />
                  </div>
                  <p className="text-sm text-muted-foreground">{referral.reason}</p>
                </div>
                <div className="text-left md:text-right bg-muted/50 p-2 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Destination</p>
                  <p className="font-semibold text-sm">{referral.to}</p>
                  <p className="text-xs text-muted-foreground mt-1">Elapsed: {referral.time}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full z-0"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                  style={{ width: `${((referral.progress - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
                
                <div className="relative z-10 flex justify-between">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < referral.progress;
                    const isCurrent = idx === referral.progress - 1;
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors duration-300
                          ${isCompleted ? 'bg-primary text-primary-foreground border-2 border-primary' : 
                            isCurrent ? 'bg-background border-2 border-primary text-primary' : 
                            'bg-background border-2 border-muted text-muted-foreground'}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] md:text-xs mt-2 font-medium hidden md:block max-w-[80px] text-center
                          ${isCurrent ? 'text-foreground font-bold' : 'text-muted-foreground'}`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline" size="sm" className="font-semibold text-primary hover:bg-primary/5 hover:text-primary">
                  Advance Status <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-4 text-muted-foreground">Completed Referrals</h2>
        <Card className="overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.patientName}</TableCell>
                    <TableCell>{referral.to}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{referral.reason}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> {referral.time}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
