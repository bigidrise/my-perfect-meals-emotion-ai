import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  // Redirect to onboarding for profile setup
  useEffect(() => {
    window.location.href = "/onboarding";
  }, []);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Redirecting to Profile Setup</h2>
          <p className="text-muted-foreground">
            Taking you to the complete profile setup page...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}