import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { mockChartData, conditionDistribution, referralCompletionData } from "@/data/mockData";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { StatCard } from "@/components/StatCard";
import { Clock, TrendingUp, AlertTriangle, ShieldCheck, Shield, CheckCircle2, Award } from "lucide-react";

export default function Analytics() {
  const pieData = [
    { name: 'Critical', value: 4, color: 'hsl(357 77% 56%)' },
    { name: 'High', value: 6, color: 'hsl(38 90% 55%)' },
    { name: 'Medium', value: 9, color: 'hsl(210 100% 50%)' },
    { name: 'Low', value: 12, color: 'hsl(136 63% 47%)' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in pb-24 md:pb-8">
      <Navbar role="District Admin" userName="Admin Portal" />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/15 p-3 rounded-xl shrink-0">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary font-heading leading-tight">
                AI reduced missed high-risk cases by 42% in pilot simulation
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Across 3 villages in Kalahandi District, Odisha &nbsp;|&nbsp; January–June 2026 Pilot
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-heading">Health Intelligence</h1>
            <p className="text-muted-foreground text-sm">Block-level analytics and performance metrics.</p>
          </div>
          <div className="flex bg-muted/50 p-1 rounded-lg border border-border w-fit">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground">This Week</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-background shadow-sm text-foreground">This Month</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground">Quarter</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Avg Response Time" 
            value="47 min" 
            icon={<Clock className="w-4 h-4 text-primary" />}
            description="From alert to intervention"
            className="border-t-4 border-t-primary"
          />
          <StatCard 
            title="Referral Success" 
            value="82%" 
            icon={<TrendingUp className="w-4 h-4 text-success" />}
            description="+4% from last month"
            className="border-t-4 border-t-success"
          />
          <StatCard 
            title="Top Danger Sign" 
            value="Edema" 
            icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
            description="Pregnancy complication"
            className="border-t-4 border-t-destructive"
          />
          <StatCard 
            title="ASHA Score" 
            value="87/100" 
            icon={<ShieldCheck className="w-4 h-4 text-secondary" />}
            description="Overall productivity index"
            className="border-t-4 border-t-secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-5 shadow-sm border-border">
            <h3 className="font-bold font-heading mb-6">Risk Cases Over Time (6 Months)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} itemStyle={{ fontWeight: 600 }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                  <Line type="monotone" dataKey="critical" name="Critical" stroke="hsl(357 77% 56%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(357 77% 56%)" }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="high" name="High" stroke="hsl(38 90% 55%)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="medium" name="Medium" stroke="hsl(210 100% 50%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="low" name="Low" stroke="hsl(136 63% 47%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-border">
            <h3 className="font-bold font-heading mb-6">Condition Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conditionDistribution} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} cursor={{ fill: 'hsl(var(--muted)/0.5)' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                  <Bar dataKey="Maternal" name="Maternal" fill="hsl(158 83% 23%)" radius={[4, 4, 0, 0]} maxBarSize={40} stackId="a" />
                  <Bar dataKey="NCD" name="NCD" fill="hsl(38 90% 55%)" radius={[0, 0, 0, 0]} maxBarSize={40} stackId="a" />
                  <Bar dataKey="Newborn" name="Newborn" fill="hsl(210 100% 50%)" radius={[4, 4, 0, 0]} maxBarSize={40} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-border">
            <h3 className="font-bold font-heading mb-6">Current Risk Profile</h3>
            <div className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} itemStyle={{ fontWeight: 600, color: 'hsl(var(--foreground))' }} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-border">
            <h3 className="font-bold font-heading mb-6">Referral Completion Rate (%)</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={referralCompletionData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(136 63% 47%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(136 63% 47%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} domain={[50, 100]} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="rate" stroke="hsl(136 63% 47%)" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold font-heading mb-4">Certified Platform Integrations</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="p-4 flex flex-col items-center text-center gap-2 shadow-sm border-border hover-lift">
              <div className="bg-green-100 p-2 rounded-full">
                <Shield className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-bold text-sm">ABHA ID</p>
                <p className="text-xs text-muted-foreground">Linked &amp; Verified</p>
              </div>
            </Card>
            <Card className="p-4 flex flex-col items-center text-center gap-2 shadow-sm border-border hover-lift">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-bold text-sm">Ayushman Bharat</p>
                <p className="text-xs text-muted-foreground">Support Ready</p>
              </div>
            </Card>
            <Card className="p-4 flex flex-col items-center text-center gap-2 shadow-sm border-border hover-lift">
              <div className="bg-teal-100 p-2 rounded-full">
                <Award className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <p className="font-bold text-sm">NHM India</p>
                <p className="text-xs text-muted-foreground">Workflow Compliant</p>
              </div>
            </Card>
          </div>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 border border-primary/20 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Built for NHM India Frontline Workflows — National Health Mission Compliant
            </span>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
