import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, MessageSquare, Slack, Bell, ListTodo, NotebookPen } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const Index = () => {
  useEffect(() => {
    document.title = "Butler Docs • Introduction";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header id="introduction" className="pt-10">
              <p className="text-sm font-medium text-accent">Get Started</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Introduction</h1>
              <p className="mt-3 text-lg text-muted-foreground">Meet your new personal assistant, Butler.</p>
            </header>

            {/* No YouTube video per request */}

            <section id="get-started" className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<MessageSquare size={18} />}
                  title="Get Started"
                  description="Sign up at app.trybutler.com and start using Butler on the web."
                />
                <DocCard
                  icon={<MessageSquare size={18} />}
                  title="Download the App"
                  description="Use Butler on your phone with the iOS app."
                />
              </div>
            </section>

            <section id="contact-info" className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Give Butler your contact info</h2>
              <p className="mt-1 text-muted-foreground">Butler is reachable through your communication channels.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard icon={<Mail size={18} />} title="Email" description="Give Butler your email so you can forward emails with commands or questions." />
                <DocCard icon={<Slack size={18} />} title="Slack" description="Connect Slack so Butler can interact in your workspace." />
              </div>
            </section>

            <section id="integrations" className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Integrate Butler</h2>
              <p className="mt-1 text-muted-foreground">Connect Butler to your tools and services so he can use them on your behalf.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DocCard icon={<Calendar size={18} />} title="Calendar" description="Butler can manage your calendar and schedule events for you." />
                <DocCard icon={<Mail size={18} />} title="Inbox" description="Butler can check your emails and draft replies on your behalf." />
                <DocCard icon={<Bell size={18} />} title="Reminders" description="Butler can send you reminders via Slack, email, or push notification." />
                <DocCard icon={<ListTodo size={18} />} title="To-dos" description="Butler can track and manage your to‑do list items." />
                <DocCard icon={<NotebookPen size={18} />} title="Notes" description="Butler can take notes for you during conversations and keep track of them." />
                <DocCard icon={<Slack size={18} />} title="Slack" description="Butler can read, send, and reply to messages on your behalf in Slack." />
              </div>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Docs Home"
                placeholder="e.g., What should I try next?"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
