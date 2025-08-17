import TopNav from "@/components/layout/TopNav";
// Sidebar is hidden on the pricing page per request
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";
import { Link } from "react-router-dom";

const Pricing = () => {
  useEffect(() => {
    document.title = "Butler Docs • Pricing Plans";
  }, []);

  const plans = [
    {
      name: "Starter",
      price: "$19",
      description: "Perfect for individuals getting started with Butler",
      features: [
        "Up to 100 tasks per month",
        "Basic integrations",
        "Email support",
        "Phone & SMS access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      description: "Ideal for busy professionals and small teams",
      features: [
        "Unlimited tasks",
        "All integrations",
        "Priority support",
        "Advanced scheduling",
        "Team collaboration",
        "Custom workflows"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantees",
        "Advanced security",
        "Training & onboarding"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div>
          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Get Started</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Pricing Plans</h1>
              <p className="mt-3 text-lg text-muted-foreground">Choose the perfect plan for your needs. Start with a 14-day free trial.</p>
            </header>

            <section className="mt-10">
              <div className="grid gap-6 lg:grid-cols-3">
                {plans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.popular ? 'border-accent shadow-lg' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        variant={plan.popular ? "default" : "outline"} 
                        className="w-full"
                        asChild
                      >
                        <Link to="/checkout">
                          {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Can I change plans anytime?</h3>
                      <p className="text-sm text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time.</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Is there a free trial?</h3>
                      <p className="text-sm text-muted-foreground">Yes, all plans come with a 14-day free trial.</p>
                    </div>
                    <div>
                      <h3 className="font-medium">What payment methods do you accept?</h3>
                      <p className="text-sm text-muted-foreground">We accept all major credit cards and PayPal.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <DevTestPanel
                context="Pricing"
                placeholder="e.g., Ask for a custom enterprise quote with SSO and SLA"
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Pricing;