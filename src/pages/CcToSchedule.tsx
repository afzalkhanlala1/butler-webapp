import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { Mail, Calendar, Users, Zap } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const CcToSchedule = () => {
  useEffect(() => {
    document.title = "Butler Docs • Cc to Schedule";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Background Tasks</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Cc to Schedule</h1>
              <p className="mt-3 text-lg text-muted-foreground">Automatically schedule meetings by CC'ing Butler on emails.</p>
            </header>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">How It Works</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<Mail size={18} />}
                  title="CC Butler"
                  description="Simply CC Butler on any email thread where scheduling is needed."
                />
                <DocCard
                  icon={<Calendar size={18} />}
                  title="Auto-Schedule"
                  description="Butler automatically finds the best time and sends calendar invites."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DocCard
                  icon={<Users size={18} />}
                  title="Multi-Party Scheduling"
                  description="Coordinate schedules across multiple participants automatically."
                />
                <DocCard
                  icon={<Zap size={18} />}
                  title="Instant Processing"
                  description="Butler processes scheduling requests in real-time from email threads."
                />
                <DocCard
                  icon={<Calendar size={18} />}
                  title="Calendar Integration"
                  description="Seamlessly integrates with all major calendar platforms."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Example Usage</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Project Meeting</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Email: "Let's schedule a project review meeting next week" → CC Butler → Meeting scheduled automatically
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Client Call</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Email: "We need to discuss the proposal" → CC Butler → Calendar invite sent to all parties
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Team Sync</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Email: "Can we sync on this tomorrow?" → CC Butler → Time found and meeting created
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Cc to Schedule"
                placeholder="e.g., CC Butler to schedule a sync with the design team next week"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CcToSchedule;