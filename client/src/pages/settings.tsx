import { Settings as SettingsIcon, Users, Shield, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">System configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4" />
              Admin Users
            </CardTitle>
            <CardDescription>Authorized administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="font-medium">Allison</p>
                  <p className="text-sm text-muted-foreground">Primary Admin</p>
                </div>
                <Badge>Admin</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="font-medium">Roxanne</p>
                  <p className="text-sm text-muted-foreground">Primary Admin</p>
                </div>
                <Badge>Admin</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Your Profile
            </CardTitle>
            <CardDescription>Current logged in user</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">
                    {user.firstName
                      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Admin" : "Viewer"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">Not logged in</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Management
            </CardTitle>
            <CardDescription>Import and export options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="font-medium">Export Partners</p>
                  <p className="text-sm text-muted-foreground">Download as CSV</p>
                </div>
                <a
                  href="/api/partners/export"
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="font-medium">Export Assessments</p>
                  <p className="text-sm text-muted-foreground">Download as CSV</p>
                </div>
                <a
                  href="/api/assessments/export"
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              System Info
            </CardTitle>
            <CardDescription>Application details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="font-mono text-sm">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Environment</span>
                <Badge variant="outline">Production</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <Badge variant="secondary">PostgreSQL</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
