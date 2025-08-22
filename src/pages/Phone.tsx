import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { Phone as PhoneIcon, MessageSquare, Settings } from "lucide-react";
import { useEffect } from "react";

const Phone = () => {
  useEffect(() => {
    document.title = "Butler Docs • Phone Calls";
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Phone Calls</h1>
              <p className="mt-3 text-lg text-muted-foreground">Call Butler directly for immediate assistance and task management.</p>
            </header>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Getting Started with Phone Calls</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<PhoneIcon size={18} />}
                  title="Add Your Phone Number"
                  description="Connect your phone number to start calling Butler directly."
                />
                <DocCard
                  icon={<Settings size={18} />}
                  title="Configure Call Settings"
                  description="Set up your preferences for how Butler handles your calls."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">What You Can Do</h2>
              <p className="mt-1 text-muted-foreground">Butler can help you with various tasks over the phone.</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Schedule Meetings</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Butler, schedule a meeting with John for tomorrow at 2 PM"
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Set Reminders</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Remind me to call the doctor at 3 PM today"
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Get Updates</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    "What's on my calendar for today?"
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

export default Phone;