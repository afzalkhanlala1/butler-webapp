import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Users, Clock } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const TextingCalling = () => {
  useEffect(() => {
    document.title = "Butler Docs • Texting & Calling";
  }, []);

  const features = [
    { title: "Voice Calls", description: "Make and receive calls through Butler integration", icon: Phone },
    { title: "Text Messages", description: "Send and manage SMS messages seamlessly", icon: MessageSquare },
    { title: "Contact Management", description: "Organize and access your contacts efficiently", icon: Users },
    { title: "Call Scheduling", description: "Schedule calls and set reminders automatically", icon: Clock },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Texting & Calling</h1>
              <p className="mt-3 text-lg text-muted-foreground">Seamlessly integrate voice calls and text messaging with Butler's communication features.</p>
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
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Phone Number Setup</h3>
                    <p className="text-sm text-muted-foreground">Connect your phone number to Butler for seamless calling and texting capabilities.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Contact Integration</h3>
                    <p className="text-sm text-muted-foreground">Import your existing contacts and let Butler manage your communication history.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Voice Commands</h3>
                    <p className="text-sm text-muted-foreground">Use voice commands to make calls, send texts, and manage your communications hands-free.</p>
                  </div>
                  <Button variant="default" className="mt-4">
                    Setup Calling & Texting
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Texting & Calling"
                placeholder="e.g., Schedule a call with Lisa next Wednesday at 11am"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TextingCalling;