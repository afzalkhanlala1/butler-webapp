import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DevTestPanelProps {
  context: string;
  placeholder?: string;
}

const DevTestPanel = ({ context, placeholder }: DevTestPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Type a prompt to test your agent integration.",
        variant: "destructive"
      });
      return;
    }

    // Placeholder action: log to console and toast. Replace with webhook call later.
    // eslint-disable-next-line no-console
    console.log("DevTestPanel submission", { context, prompt });
    toast({
      title: "Captured test prompt",
      description: `Context: ${context}`
    });
    setPrompt("");
  };

  const computedPlaceholder =
    placeholder || `Enter a test prompt for ${context} (this will be sent to your agent webhook later) ...`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Developer Testing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`devtest-${context}`}>Prompt for {context}</Label>
            <Textarea
              id={`devtest-${context}`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={computedPlaceholder}
              className="min-h-[90px]"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Run Test</Button>
          </div>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          This panel is for developer testing. In the future it will POST to your Google agent webhook.
        </p>
      </CardContent>
    </Card>
  );
};

export default DevTestPanel;


