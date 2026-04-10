import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { StatCard } from "@/components/StatCard";
import { PatientCard } from "@/components/PatientCard";
import { TrustBadges } from "@/components/TrustBadges";
import { mockPatients } from "@/data/mockData";
import { Mic, Heart, User, Clock, ChevronDown, ChevronUp, Calendar, Info } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

const missedAlerts = [
  { patient: "Sunita Devi", type: "ANC Visit", daysOverdue: 3, action: "Home follow-up due" },
  { patient: "Parvati Nayak", type: "BP Check", daysOverdue: 1, action: "Urgent — scheduled today" },
  { patient: "Raman Babu", type: "Medication refill", daysOverdue: 2, action: "PHC visit needed" },
];

export default function AshaDashboard() {
  const recentPatients = mockPatients.slice(0, 5);
  const [alertsOpen, setAlertsOpen] = useState(true);
  const { t } = useLanguage();

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">{t.greeting}, Sunita &nbsp;·&nbsp; {today}</p>
          <h1 className="text-2xl font-bold mt-0.5">Overview</h1>
        </div>

        {/* Mentor Storytelling Block */}
        <div className="bg-gradient-to-r from-emerald-50 to-[#0A6E4F]/10 dark:from-[#0A6E4F]/20 dark:to-[#0A6E4F]/10 border border-[#0A6E4F]/30 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#0A6E4F] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-[#0A6E4F] dark:text-emerald-400">Why this matters (Judge & Mentor Context)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This MVP targets the <strong>300k+ preventable maternal & newborn deaths</strong> annually. Instead of broad diagnostics, we hone the Voice AI into a rapid, 3-step danger-sign classifier explicitly for ASHA workers in remote villages where literacy is low.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Today's Patients"
            value={12}
            className="border-l-4 border-l-blue-500"
          />
          <StatCard
            title="High Risk Alerts"
            value={3}
            className="border-l-4 border-l-destructive"
            valueClassName="text-destructive animate-pulse"
          />
          <StatCard title="Pending Referrals" value={2} className="border-l-4 border-l-secondary" />
          <StatCard title="Completed Visits" value={7} className="border-l-4 border-l-success" />
        </div>

        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link href="/voice-assessment">
            <div className="bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift cursor-pointer h-full transition-colors group" data-testid="action-voice">
              <div className="bg-primary text-primary-foreground p-3 rounded-full group-active:scale-95 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-primary">Voice Triage</span>
            </div>
          </Link>
          <Link href="/maternal-check">
            <div className="bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift cursor-pointer h-full transition-colors group dark:bg-rose-950/30 dark:border-rose-900" data-testid="action-maternal">
              <div className="bg-rose-500 text-white p-3 rounded-full group-active:scale-95 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-rose-600 dark:text-rose-400">Maternal Check</span>
            </div>
          </Link>
          <Link href="/maternal-check?tab=newborn">
            <div className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift cursor-pointer h-full transition-colors group dark:bg-amber-950/30 dark:border-amber-900" data-testid="action-newborn">
              <div className="bg-amber-500 text-white p-3 rounded-full group-active:scale-95 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-amber-600 dark:text-amber-400">Newborn Check</span>
            </div>
          </Link>
        </div>

        <TrustBadges />

        <div className="mb-6 mt-6">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="flex items-center justify-between w-full mb-3 group"
            data-testid="toggle-missed-alerts"
          >
            <h2 className="text-lg font-bold flex items-center gap-2 text-amber-700">
              <Clock className="w-5 h-5" />
              Missed Visits ({missedAlerts.length})
            </h2>
            {alertsOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {alertsOpen && (
            <div className="space-y-2">
              {missedAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-xl p-3 dark:bg-amber-950/20 dark:border-amber-900"
                  data-testid={`missed-alert-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{alert.patient}</p>
                      <p className="text-xs text-muted-foreground italic">{alert.type} — {alert.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      {alert.daysOverdue}d
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => toast({ title: "Visit Scheduled", description: `Follow-up for ${alert.patient} has been scheduled.` })}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Patients</h2>
          <Link href="/patients" className="text-sm text-primary font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
