import { Lock, Users, ClipboardList, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              PP
            </div>
            <span className="font-semibold text-lg">PlayPartner</span>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Private Partner Management
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            A fast, private, and efficient system for managing partner relationships.
            Built for low upkeep and quick decision-making.
          </p>

          <Button size="lg" asChild data-testid="button-get-started">
            <a href="/api/login">Get Started</a>
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card className="text-left">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium mb-2">Partner Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive profiles with intimacy, logistics, and media tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardContent className="p-6">
                <ClipboardList className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium mb-2">Admin Assessments</h3>
                <p className="text-sm text-muted-foreground">
                  Track ratings, status, and notes from multiple admins.
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium mb-2">Risk Management</h3>
                <p className="text-sm text-muted-foreground">
                  Visual risk flags, conflict detection, and blacklist support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardContent className="p-6">
                <Lock className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Sensitive data protected by default with reveal-on-click.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          Private management system. Access restricted to authorized users.
        </div>
      </footer>
    </div>
  );
}
