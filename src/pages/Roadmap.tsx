import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const Roadmap = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    document.title = "Butler Docs • Roadmap";
  }, []);

  const roadmapItems = [
    { title: "Enhanced Voice Commands", status: "completed", quarter: "Q1 2024" },
    { title: "Advanced Calendar Integration", status: "completed", quarter: "Q1 2024" },
    { title: "Smart Email Prioritization", status: "in-progress", quarter: "Q2 2024" },
    { title: "Team Collaboration Features", status: "in-progress", quarter: "Q2 2024" },
    { title: "Mobile App Improvements", status: "planned", quarter: "Q3 2024" },
    { title: "AI-Powered Task Suggestions", status: "planned", quarter: "Q3 2024" },
    { title: "Third-party App Integrations", status: "planned", quarter: "Q4 2024" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-accent" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="secondary" className="bg-green-100 text-green-700">Completed</Badge>;
      case "in-progress": return <Badge variant="default">In Progress</Badge>;
      default: return <Badge variant="outline">Planned</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Roadmap</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Product Roadmap</h1>
              <p className="mt-3 text-lg text-muted-foreground">See what's coming next for Butler and share your feedback.</p>
            </header>

            <section className="mt-10">
              <div className="space-y-4">
                {roadmapItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.quarter}</p>
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Requests & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Have an idea for Butler? We'd love to hear from you! Share your feature requests and feedback to help shape the future of Butler.
                  </p>
                  <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
                    <DialogTrigger asChild>
                      <Button variant="default">
                        Submit Feedback
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <FeedbackForm onClose={() => setShowFeedbackForm(false)} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </section>

            
          </main>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;