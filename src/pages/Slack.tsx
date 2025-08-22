import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Zap, Users, Shield } from "lucide-react";
import { useEffect } from "react";

const Slack = () => {
  useEffect(() => {
    document.title = "Butler Docs • Slack Integration";
  }, []);

  const features = [
    { title: "Direct Messages", description: "Send Butler requests directly through Slack DMs", icon: MessageSquare },
    { title: "Channel Integration", description: "Add Butler to any channel for team collaboration", icon: Users },
    { title: "Quick Commands", description: "Use slash commands for instant Butler actions", icon: Zap },
    { title: "Secure Access", description: "Enterprise-grade security for all interactions", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Ways to Reach Butler</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Slack Integration</h1>
              <p className="mt-3 text-lg text-muted-foreground">Connect Butler to your Slack workspace for seamless team productivity.</p>
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
                  <CardTitle>Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">1. Install Butler App</h3>
                    <p className="text-sm text-muted-foreground">Add Butler to your Slack workspace from the Slack App Directory.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">2. Authorize Access</h3>
                    <p className="text-sm text-muted-foreground">Grant Butler the necessary permissions to access your calendar and email.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">3. Start Using Commands</h3>
                    <p className="text-sm text-muted-foreground">Use /butler [command] to start interacting with your assistant.</p>
                  </div>
                  <Button variant="default" className="mt-4">
                    Install Butler for Slack
                  </Button>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Slack;