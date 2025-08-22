import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Repeat, Smartphone } from "lucide-react";
import { useEffect } from "react";

const Reminders = () => {
  useEffect(() => {
    document.title = "Butler Docs • Reminders";
  }, []);

  const features = [
    { title: "Smart Notifications", description: "Get reminded at the perfect time with context-aware alerts", icon: Bell },
    { title: "Flexible Timing", description: "Set reminders for specific times, dates, or recurring events", icon: Clock },
    { title: "Recurring Reminders", description: "Create repeating reminders for regular tasks and events", icon: Repeat },
    { title: "Multi-Platform", description: "Receive reminders on all your devices seamlessly", icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Integrations</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Reminders</h1>
              <p className="mt-3 text-lg text-muted-foreground">Never miss important tasks or events with Butler's intelligent reminder system.</p>
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
                  <CardTitle>Example Commands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">"Remind me to call John tomorrow at 2 PM"</h3>
                    <p className="text-sm text-muted-foreground">Butler will set a reminder and notify you at the specified time.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"Set a weekly reminder for team meetings"</h3>
                    <p className="text-sm text-muted-foreground">Create recurring reminders that repeat automatically.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"Remind me to follow up on the proposal in 3 days"</h3>
                    <p className="text-sm text-muted-foreground">Set relative reminders that Butler will calculate and schedule.</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Reminders;