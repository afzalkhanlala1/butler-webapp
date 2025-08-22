import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Clock, MapPin, Route } from "lucide-react";
import { useEffect } from "react";

const Careem = () => {
  useEffect(() => {
    document.title = "Butler Docs • Careem";
  }, []);

  const features = [
    { title: "Ride Booking", description: "Ask Butler to book a Careem ride to your destination with pickup optimization.", icon: Car },
    { title: "Scheduled Rides", description: "Schedule rides for later with reminders before pickup.", icon: Clock },
    { title: "Location Awareness", description: "Share your live location and saved places for quick pickups.", icon: MapPin },
    { title: "Multi‑stop Routes", description: "Plan errands with multiple stops and estimated arrival times.", icon: Route },
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
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Careem</h1>
              <p className="mt-3 text-lg text-muted-foreground">Use Butler to book, schedule, and manage rides with Careem.
              </p>
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
                    <h3 className="font-medium mb-2">Schedule Morning Commute</h3>
                    <p className="text-sm text-muted-foreground">"Book a Careem from home to the office for 8:15 AM tomorrow."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Airport Ride</h3>
                    <p className="text-sm text-muted-foreground">"Arrange a ride to the airport at 4 PM and remind me 30 minutes before pickup."
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Multi‑stop Errands</h3>
                    <p className="text-sm text-muted-foreground">"Plan a trip to the bank, then the pharmacy, then home."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            
          </main>
        </div>
      </div>
    </div>
  );
};

export default Careem;


