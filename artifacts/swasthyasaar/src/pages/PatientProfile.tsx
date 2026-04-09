import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { mockPatients, mockChartData } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Calendar, ChevronLeft, Activity, Edit3, ClipboardList } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";

export default function PatientProfile() {
  const { id } = useParams();
  const patientIndex = parseInt(id || "0");
  const patient = mockPatients.find(p => p.id === patientIndex) || mockPatients[0];

  // Generate some realistic-looking risk history data for this patient
  const patientHistoryData = [
    { month: "Jan", score: patient.riskLevel === "CRITICAL" ? 85 : patient.riskLevel === "HIGH" ? 70 : 45 },
    { month: "Feb", score: patient.riskLevel === "CRITICAL" ? 88 : patient.riskLevel === "HIGH" ? 75 : 48 },
    { month: "Mar", score: patient.riskLevel === "CRITICAL" ? 82 : patient.riskLevel === "HIGH" ? 72 : 42 },
    { month: "Apr", score: patient.riskLevel === "CRITICAL" ? 90 : patient.riskLevel === "HIGH" ? 78 : 55 },
    { month: "May", score: patient.riskLevel === "CRITICAL" ? 95 : patient.riskLevel === "HIGH" ? 82 : 50 },
    { month: "Jun", score: patient.riskLevel === "CRITICAL" ? 92 : patient.riskLevel === "HIGH" ? 80 : 52 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
        <Link href="/asha-dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <Card className="p-6 mb-6 shadow-md border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-background shadow-sm ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold font-heading mb-1">{patient.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{patient.age} years old</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {patient.village}</span>
                  <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> ASHA: {patient.ashaAssigned}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 text-primary font-bold text-xs px-2.5 py-1 rounded-md border border-primary/20">
                    {patient.condition}
                  </span>
                  <RiskBadge level={patient.riskLevel} />
                </div>
              </div>
            </div>
            
            <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
              <Button className="font-semibold shadow-sm w-full md:w-auto">
                <Edit3 className="w-4 h-4 mr-2" /> Update Vitals
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                <Phone className="w-4 h-4 mr-2" /> Call Patient
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-5 shadow-sm border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold font-heading text-lg">Clinical Notes</h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Last visit: {patient.lastVisit}
                </span>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                <p className="text-sm font-medium leading-relaxed">{patient.details}</p>
              </div>
            </Card>

            <Card className="p-5 shadow-sm border-border">
              <h3 className="font-bold font-heading text-lg mb-6">Risk Timeline (6 Months)</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientHistoryData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number) => [`${value}/100`, 'Risk Score']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke={patient.riskLevel === 'CRITICAL' ? "hsl(357 77% 56%)" : "hsl(38 90% 55%)"} 
                      strokeWidth={3} 
                      dot={{ r: 4, strokeWidth: 2 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5 shadow-sm border-border bg-gradient-to-b from-card to-muted/20">
              <h3 className="font-bold font-heading text-lg mb-4">Recent Assessments</h3>
              <div className="space-y-4">
                <div className="relative pl-6 pb-4 border-l-2 border-border last:border-0 last:pb-0">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>
                  <p className="text-xs text-primary font-bold mb-1">Today</p>
                  <p className="text-sm font-medium">Routine ANC Checkup</p>
                  <p className="text-xs text-muted-foreground mt-1">Vitals normal, minor swelling reported.</p>
                </div>
                <div className="relative pl-6 pb-4 border-l-2 border-border last:border-0 last:pb-0">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted"></div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">14 days ago</p>
                  <p className="text-sm font-medium">Voice AI Assessment</p>
                  <p className="text-xs text-muted-foreground mt-1">Reported headache. Flagged for follow-up.</p>
                </div>
                <div className="relative pl-6 pb-0 border-l-2 border-transparent">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted"></div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">1 month ago</p>
                  <p className="text-sm font-medium">Initial Registration</p>
                  <p className="text-xs text-muted-foreground mt-1">Added to ASHA registry.</p>
                </div>
              </div>
              <Button variant="link" className="w-full mt-4 text-xs font-semibold text-primary">View Full History</Button>
            </Card>

            <Card className="p-5 shadow-sm border-border">
              <h3 className="font-bold font-heading text-lg mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-secondary" /> Care Pathway
              </h3>
              <div className="bg-secondary/10 text-secondary-foreground border border-secondary/20 rounded-lg p-3 text-sm mb-3">
                <span className="font-bold block mb-1">Next Action Due:</span>
                Schedule PHC visit within 48 hours for clinical evaluation.
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
                Initiate Referral
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
