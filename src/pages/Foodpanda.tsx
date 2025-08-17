import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Clock, MapPin, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const Foodpanda = () => {
  useEffect(() => {
    document.title = "Butler Docs • Foodpanda";
  }, []);

  const features = [
    { title: "Quick Ordering", description: "Ask Butler to order your usual meals from favorite restaurants.", icon: Utensils },
    { title: "Scheduled Delivery", description: "Set delivery windows so food arrives exactly when you need it.", icon: Clock },
    { title: "Address Aware", description: "Use saved addresses and share live location for accurate drop‑offs.", icon: MapPin },
    { title: "Reorder & Track", description: "Reorder previous meals and track delivery progress hands‑free.", icon: ShoppingBag },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Foodpanda</h1>
              <p className="mt-3 text-lg text-muted-foreground">Use Butler to order food from Foodpanda with natural language instructions.</p>
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
                  <CardTitle>Example Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Order My Usual</h3>
                    <p className="text-sm text-muted-foreground">"Order my usual from Burger Shack to arrive at 1 PM."</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Dietary Preferences</h3>
                    <p className="text-sm text-muted-foreground">"Find vegetarian options nearby under $15 and order the highest rated."</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Group Order</h3>
                    <p className="text-sm text-muted-foreground">"Start a group order for the team and send a link to the Slack channel."</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Foodpanda"
                placeholder="e.g., Order a pepperoni pizza from the nearest restaurant for 7:30pm"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Foodpanda;


