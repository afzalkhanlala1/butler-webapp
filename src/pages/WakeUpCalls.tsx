import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, AlarmClock, Calendar, Sun } from "lucide-react";
import { useEffect } from "react";

const WakeUpCalls = () => {
  useEffect(() => {
    document.title = "Butler Docs • Wake Up Calls";
  }, []);

  const features = [
    { title: "Scheduled Calls", description: "Set up wake-up calls for specific times and dates", icon: Phone },
    { title: "Smart Timing", description: "Adjust timing based on your schedule and preferences", icon: AlarmClock },
    { title: "Calendar Integration", description: "Automatic wake-up calls before important events", icon: Calendar },
    { title: "Gentle Wake-up", description: "Personalized wake-up messages and gradual volume increase", icon: Sun },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Wake Up Calls</h1>
              <p className="mt-3 text-lg text-muted-foreground">Never oversleep with Butler's intelligent wake-up call service.</p>
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
                  <CardTitle>How to Set Up Wake-Up Calls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Voice Commands</h3>
                    <p className="text-sm text-muted-foreground">"Wake me up at 7 AM tomorrow" or "Set a wake-up call for my flight on Friday."</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Recurring Calls</h3>
                    <p className="text-sm text-muted-foreground">Set up daily, weekly, or custom recurring wake-up calls for your routine.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Event-Based Calls</h3>
                    <p className="text-sm text-muted-foreground">Butler can automatically schedule wake-up calls before important meetings or events.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Travel Support</h3>
                    <p className="text-sm text-muted-foreground">Adjust wake-up times automatically when traveling across time zones.</p>
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

export default WakeUpCalls;