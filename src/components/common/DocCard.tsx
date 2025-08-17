import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

interface DocCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

const DocCard = ({ icon, title, description, href }: DocCardProps) => {
  const Wrapper = href ? ("a" as any) : ("div" as any);
  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        "group block focus:outline-none",
        href && "focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      )}
    >
      <Card className="transition-transform duration-200 hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                {href && (
                  <ArrowUpRight className="text-muted-foreground" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default DocCard;
