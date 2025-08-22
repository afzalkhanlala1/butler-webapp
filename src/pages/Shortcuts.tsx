import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { Wand2, Zap, Keyboard, Settings } from "lucide-react";
import { useEffect } from "react";

const Shortcuts = () => {
  useEffect(() => {
    document.title = "Butler Docs • Shortcuts";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Tools</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Shortcuts</h1>
              <p className="mt-3 text-lg text-muted-foreground">Create custom shortcuts to automate your most common tasks with Butler.</p>
            </header>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Getting Started</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<Wand2 size={18} />}
                  title="Create Shortcuts"
                  description="Build custom shortcuts for your most frequent Butler commands."
                />
                <DocCard
                  icon={<Keyboard size={18} />}
                  title="Keyboard Shortcuts"
                  description="Set up keyboard shortcuts for quick access to Butler features."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Popular Shortcuts</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Daily Standup</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically generate and send daily standup updates
                      </p>
                    </div>
                    <div className="bg-muted px-2 py-1 rounded text-xs font-mono">⌘ + D</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Quick Schedule</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Fast scheduling for common meeting types
                      </p>
                    </div>
                    <div className="bg-muted px-2 py-1 rounded text-xs font-mono">⌘ + S</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Email Summary</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get a quick summary of unread emails
                      </p>
                    </div>
                    <div className="bg-muted px-2 py-1 rounded text-xs font-mono">⌘ + E</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Custom Shortcuts</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<Zap size={18} />}
                  title="Workflow Automation"
                  description="Chain multiple Butler actions into powerful workflows."
                />
                <DocCard
                  icon={<Settings size={18} />}
                  title="Personalization"
                  description="Customize shortcuts based on your specific needs and preferences."
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shortcuts;