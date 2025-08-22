import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox as InboxIcon, Filter, Star, Archive } from "lucide-react";
import { useEffect } from "react";

const Inbox = () => {
  useEffect(() => {
    document.title = "Butler Docs • Inbox Management";
  }, []);

  const features = [
    { title: "Smart Filtering", description: "Automatically categorize and prioritize your emails", icon: Filter },
    { title: "Important Messages", description: "Highlight and flag critical communications", icon: Star },
    { title: "Auto Archive", description: "Automatically archive old and processed emails", icon: Archive },
    { title: "Unified View", description: "See all your messages in one organized interface", icon: InboxIcon },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Inbox Management</h1>
              <p className="mt-3 text-lg text-muted-foreground">Let Butler intelligently manage your email inbox for maximum productivity.</p>
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
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Automatic Processing</h3>
                    <p className="text-sm text-muted-foreground">Butler continuously monitors your inbox and applies intelligent filters based on your preferences and behavior patterns.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Custom Rules</h3>
                    <p className="text-sm text-muted-foreground">Create custom rules for handling specific types of emails, senders, or keywords.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Daily Summaries</h3>
                    <p className="text-sm text-muted-foreground">Receive daily summaries of important emails and actions taken by Butler.</p>
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

export default Inbox;