import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Star, Archive, Trash2 } from "lucide-react";
import { useEffect } from "react";

const EmailTriage = () => {
  useEffect(() => {
    document.title = "Butler Docs • Email Triage";
  }, []);

  const features = [
    { title: "Smart Sorting", description: "Automatically categorize emails by importance and urgency", icon: Filter },
    { title: "Priority Flagging", description: "Mark important emails that need immediate attention", icon: Star },
    { title: "Auto-Archive", description: "Archive processed emails to keep your inbox clean", icon: Archive },
    { title: "Spam Filtering", description: "Automatically identify and remove unwanted emails", icon: Trash2 },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Email Triage</h1>
              <p className="mt-3 text-lg text-muted-foreground">Keep your inbox organized with intelligent email sorting and prioritization.</p>
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
                  <CardTitle>Triage Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Urgent & Important</h3>
                    <p className="text-sm text-muted-foreground">Emails requiring immediate action from key contacts or about critical topics.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Important but Not Urgent</h3>
                    <p className="text-sm text-muted-foreground">Emails that need attention but can be scheduled for later review.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Informational</h3>
                    <p className="text-sm text-muted-foreground">Newsletters, updates, and FYI emails that can be read when convenient.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Auto-Action</h3>
                    <p className="text-sm text-muted-foreground">Emails Butler can handle automatically, like confirmations and receipts.</p>
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

export default EmailTriage;