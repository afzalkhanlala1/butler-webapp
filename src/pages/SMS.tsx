import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { MessageSquare, Settings, Send } from "lucide-react";
import { useEffect } from "react";

const SMS = () => {
  useEffect(() => {
    document.title = "Butler Docs • SMS";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Ways to Reach Butler</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">SMS</h1>
              <p className="mt-3 text-lg text-muted-foreground">Text Butler for quick tasks and updates on the go.</p>
            </header>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Getting Started with SMS</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<MessageSquare size={18} />}
                  title="Enable SMS"
                  description="Set up SMS communication with Butler using your phone number."
                />
                <DocCard
                  icon={<Send size={18} />}
                  title="Send Your First Text"
                  description="Start texting Butler with simple commands and requests."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Example Text Commands</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Quick Scheduling</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Schedule lunch with Sarah tomorrow at noon"
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Add To-dos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Add buy groceries to my todo list"
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Get Information</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "What's my next meeting?"
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SMS;