import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Lightbulb, Send, Target } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const ProactiveDrafts = () => {
  useEffect(() => {
    document.title = "Butler Docs • Proactive Drafts";
  }, []);

  const features = [
    { title: "Smart Drafting", description: "AI-powered draft creation based on context and patterns", icon: FileEdit },
    { title: "Predictive Responses", description: "Anticipate common responses and prepare drafts in advance", icon: Lightbulb },
    { title: "Quick Sending", description: "Review and send drafts with minimal editing required", icon: Send },
    { title: "Context Aware", description: "Drafts are tailored to recipients and conversation history", icon: Target },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Proactive Drafts</h1>
              <p className="mt-3 text-lg text-muted-foreground">Let Butler prepare email drafts and responses before you even need them.</p>
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
                  <CardTitle>When Butler Creates Drafts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Meeting Follow-ups</h3>
                    <p className="text-sm text-muted-foreground">Automatically draft follow-up emails after meetings with action items and summaries.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Response Suggestions</h3>
                    <p className="text-sm text-muted-foreground">Create draft responses to incoming emails based on your communication patterns.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Recurring Communications</h3>
                    <p className="text-sm text-muted-foreground">Pre-draft regular updates, reports, and status communications.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Event Reminders</h3>
                    <p className="text-sm text-muted-foreground">Draft reminder emails for upcoming events, deadlines, and meetings.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Proactive Drafts"
                placeholder="e.g., Prepare a draft follow-up for yesterday's meeting with action items"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProactiveDrafts;