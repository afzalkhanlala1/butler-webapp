import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { Mail, Forward, Settings } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const Email = () => {
  useEffect(() => {
    document.title = "Butler Docs • Email";
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Email</h1>
              <p className="mt-3 text-lg text-muted-foreground">Forward emails to Butler for intelligent processing and responses.</p>
            </header>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Email Integration</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<Mail size={18} />}
                  title="Connect Email"
                  description="Link your email accounts to enable Butler email features."
                />
                <DocCard
                  icon={<Forward size={18} />}
                  title="Forward Emails"
                  description="Forward emails to Butler for automatic processing and action."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Email Commands</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Forward for Action</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Forward emails with instructions for Butler to take action
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Email Drafting</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask Butler to draft email responses based on context
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Email Summarization</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get summaries of long email threads and conversations
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Email"
                placeholder="e.g., Draft a reply to Sarah saying I'll review by Friday"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Email;