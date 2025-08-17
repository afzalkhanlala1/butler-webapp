import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, TrendingUp, FileText } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const EmailBriefings = () => {
  useEffect(() => {
    document.title = "Butler Docs • Email Briefings";
  }, []);

  const features = [
    { title: "Daily Summaries", description: "Get concise daily summaries of your important emails", icon: Mail },
    { title: "Scheduled Delivery", description: "Receive briefings at times that work best for you", icon: Clock },
    { title: "Priority Insights", description: "Focus on emails that need your immediate attention", icon: TrendingUp },
    { title: "Custom Reports", description: "Personalized briefing formats based on your preferences", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Background Tasks</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Email Briefings</h1>
              <p className="mt-3 text-lg text-muted-foreground">Stay informed with intelligent email summaries delivered when you need them.</p>
            </header>

            <section className="mt-10">
              <div className="grid gap-6 md:grid-cols-2">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <IconComponent className="h-8 w-8 text-accent mb-2" />
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>How Email Briefings Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Intelligent Analysis</h3>
                    <p className="text-sm text-muted-foreground">Butler analyzes your emails to identify important messages, urgent requests, and key information.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Personalized Scheduling</h3>
                    <p className="text-sm text-muted-foreground">Set your preferred times for receiving briefings - morning, lunch, evening, or custom schedules.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Actionable Insights</h3>
                    <p className="text-sm text-muted-foreground">Each briefing includes suggested actions and responses for important emails.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Integration Ready</h3>
                    <p className="text-sm text-muted-foreground">Briefings can be delivered via email, SMS, phone call, or your preferred communication channel.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Email Briefings"
                placeholder="e.g., Send me a 7am daily briefing of urgent emails only"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmailBriefings;