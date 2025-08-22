import TopNav from "@/components/layout/TopNav";
import SidebarNav from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, Zap, Globe } from "lucide-react";
import { useEffect } from "react";

const Search = () => {
  useEffect(() => {
    document.title = "Butler Docs • Search";
  }, []);

  const features = [
    { title: "Universal Search", description: "Search across all your connected apps and services", icon: SearchIcon },
    { title: "Smart Filters", description: "Filter results by date, type, source, and relevance", icon: Filter },
    { title: "Instant Results", description: "Get lightning-fast search results as you type", icon: Zap },
    { title: "Context Aware", description: "Search understands context and provides relevant suggestions", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <SidebarNav />

          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Tools</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Search</h1>
              <p className="mt-3 text-lg text-muted-foreground">Find anything across all your apps and data with Butler's powerful search capabilities.</p>
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
                  <CardTitle>Search Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">"Find emails from Sarah about the project"</h3>
                    <p className="text-sm text-muted-foreground">Search specific emails by sender and topic.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"Show me meetings from last week"</h3>
                    <p className="text-sm text-muted-foreground">Find calendar events within specific timeframes.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"Look for documents containing 'budget'"</h3>
                    <p className="text-sm text-muted-foreground">Search through document contents across all connected services.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">"Find my notes about the client meeting"</h3>
                    <p className="text-sm text-muted-foreground">Locate specific notes and thoughts you've captured.</p>
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

export default Search;