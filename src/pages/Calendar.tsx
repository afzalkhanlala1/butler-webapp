import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { Calendar as CalendarIcon, Clock, Users, Settings } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const Calendar = () => {
  useEffect(() => {
    document.title = "Butler Docs • Calendar Integration";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Integrations</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Calendar</h1>
              <p className="mt-3 text-lg text-muted-foreground">Let Butler manage your calendar and schedule meetings intelligently.</p>
            </header>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Calendar Setup</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<CalendarIcon size={18} />}
                  title="Connect Calendar"
                  description="Link Google Calendar, Outlook, or Apple Calendar with Butler."
                />
                <DocCard
                  icon={<Settings size={18} />}
                  title="Configure Preferences"
                  description="Set your availability, meeting preferences, and scheduling rules."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">What Butler Can Do</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DocCard
                  icon={<Clock size={18} />}
                  title="Smart Scheduling"
                  description="Find optimal meeting times based on all participants' availability."
                />
                <DocCard
                  icon={<Users size={18} />}
                  title="Meeting Coordination"
                  description="Coordinate with multiple participants to find the best meeting time."
                />
                <DocCard
                  icon={<CalendarIcon size={18} />}
                  title="Event Management"
                  description="Create, update, and manage calendar events with intelligent suggestions."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Example Commands</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Schedule a Meeting</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Schedule a 1-hour meeting with Sarah and John sometime next week"
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Block Time</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Block 2 hours tomorrow morning for focused work"
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Reschedule Events</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Move my 3 PM meeting to tomorrow at the same time"
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Calendar"
                placeholder="e.g., Create a 30-min meeting with Sarah next Tue at 2pm"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Calendar;