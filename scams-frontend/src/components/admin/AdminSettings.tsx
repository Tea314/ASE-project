import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Globe, Key, HelpCircle } from 'lucide-react';
import type { User } from '@/types';
import { Profile } from '../Profile';

interface AdminSettingsProps {
  user: User;
  onUpdateProfile: (user: Partial<User>) => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

export function AdminSettings({ user, onUpdateProfile, onChangePassword, onLogout }: AdminSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">Manage system settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="system">System Preferences</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Profile
            user={user}
            onUpdateProfile={onUpdateProfile}
            onChangePassword={onChangePassword}
            onLogout={onLogout}
          />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Configure user roles and access levels</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4>Administrator Permissions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Full access to all system features
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Manage Rooms</Label>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Manage Bookings</Label>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Manage Users</Label>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>View Analytics</Label>
                      <Switch defaultChecked disabled />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4>Employee Permissions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Limited access to booking features
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>View Available Rooms</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Create Bookings</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Manage Own Bookings</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>View Others' Bookings</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <div>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>Configure global system settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="dateFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4>Booking Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-approve bookings</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve all booking requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow recurring bookings</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable users to create recurring reservations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send email notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Email users about booking confirmations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Branding</Label>
                <Input id="companyName" defaultValue="Acme Corporation" />
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                <div>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>Manage API keys and integrations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input value="sk_live_••••••••••••••••" disabled />
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Use this API key to integrate with external systems
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <div>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help and access resources</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4>Documentation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Access comprehensive guides and tutorials
                </p>
                <Button variant="outline">View Documentation</Button>
              </div>

              <Separator />

              <div>
                <h4>Contact Support</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get in touch with our support team
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> support@company.com
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> 1-800-123-4567
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4>Frequently Asked Questions</h4>
                <div className="mt-3 space-y-3">
                  <div className="p-3 rounded-lg border">
                    <p className="font-medium text-sm">How do I add a new room?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Navigate to Room Management and click the "Add New Room" button.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="font-medium text-sm">How do I resolve booking conflicts?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Go to Booking Management → Conflicts tab to view and resolve conflicts.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="font-medium text-sm">Can I export analytics reports?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yes, use the Export buttons in Analytics to download CSV or PDF reports.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
