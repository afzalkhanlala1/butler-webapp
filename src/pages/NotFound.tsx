import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import DevTestPanel from "@/components/common/DevTestPanel";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary underline-offset-4 hover:underline">
          Return to Home
        </a>
      </div>
      <div className="w-full max-w-xl">
        <DevTestPanel context="404" placeholder="e.g., Suggest where this route should redirect" />
      </div>
    </div>
  );
};

export default NotFound;
