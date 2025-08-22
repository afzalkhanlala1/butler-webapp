import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotebookPen, Search, Tag, Share } from "lucide-react";
import { useEffect } from "react";

const Notes = () => {
  useEffect(() => {
    document.title = "Butler Docs • Notes";
  }, []);

  const features = [
    { title: "Voice-to-Text", description: "Dictate notes naturally and let Butler transcribe them", icon: NotebookPen },
    { title: "Smart Search", description: "Find any note quickly with intelligent search capabilities", icon: Search },
    { title: "Auto-Tagging", description: "Organize notes automatically with smart tags and categories", icon: Tag },
    { title: "Easy Sharing", description: "Share notes and collaborate with team members seamlessly", icon: Share },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Notes</h1>
              <p className="mt-3 text-lg text-muted-foreground">Capture, organize, and access your notes effortlessly with Butler's note-taking system.</p>
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
                  <CardTitle>How to Use Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Create Notes</h3>
                    <p className="text-sm text-muted-foreground">Say "Take a note" or "Create a new note about..." to start capturing your thoughts.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Organize Automatically</h3>
                    <p className="text-sm text-muted-foreground">Butler automatically categorizes and tags your notes based on content and context.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Quick Retrieval</h3>
                    <p className="text-sm text-muted-foreground">Ask "Find my notes about..." or "Show me yesterday's meeting notes" for instant access.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Meeting Integration</h3>
                    <p className="text-sm text-muted-foreground">Butler can automatically create notes during meetings and phone calls.</p>
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

export default Notes;