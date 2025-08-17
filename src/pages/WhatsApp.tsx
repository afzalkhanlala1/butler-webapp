import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import DocCard from "@/components/common/DocCard";
import { MessageCircle, Settings, Smartphone } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const WhatsApp = () => {
  useEffect(() => {
    document.title = "Butler Docs • WhatsApp";
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">WhatsApp</h1>
              <p className="mt-3 text-lg text-muted-foreground">Connect with Butler through WhatsApp for convenient messaging.</p>
            </header>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Getting Started</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocCard
                  icon={<MessageCircle size={18} />}
                  title="Connect WhatsApp"
                  description="Link your WhatsApp account to start messaging Butler."
                />
                <DocCard
                  icon={<Smartphone size={18} />}
                  title="Mobile Integration"
                  description="Access Butler seamlessly through your WhatsApp mobile app."
                />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Rich Media Support</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send images, documents, and voice messages to Butler
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Group Conversations</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Include Butler in group chats for team coordination
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="WhatsApp"
                placeholder="e.g., Send location to Butler and ask to book nearest coffee shop"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;