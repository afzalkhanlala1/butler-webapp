import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListTodo, CheckSquare, Calendar, Target } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const Todos = () => {
  useEffect(() => {
    document.title = "Butler Docs • To-dos";
  }, []);

  const features = [
    { title: "Task Creation", description: "Quickly create and organize your to-do items", icon: ListTodo },
    { title: "Smart Completion", description: "Track progress and mark tasks as complete", icon: CheckSquare },
    { title: "Due Dates", description: "Set deadlines and get timely reminders", icon: Calendar },
    { title: "Priority Management", description: "Focus on what matters most with priority levels", icon: Target },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">To-dos</h1>
              <p className="mt-3 text-lg text-muted-foreground">Manage your tasks efficiently with Butler's intelligent to-do system.</p>
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
                  <CardTitle>Voice Commands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">"Add buy groceries to my to-do list"</h3>
                    <p className="text-sm text-muted-foreground">Quickly add new tasks using natural language.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"Mark meeting prep as complete"</h3>
                    <p className="text-sm text-muted-foreground">Update task status hands-free with voice commands.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"What's on my to-do list for today?"</h3>
                    <p className="text-sm text-muted-foreground">Get an overview of your daily tasks and priorities.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"Set the report deadline for Friday"</h3>
                    <p className="text-sm text-muted-foreground">Add due dates and deadlines to your tasks.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="To-dos"
                placeholder="e.g., Add 'buy flowers' due tomorrow with priority high"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Todos;