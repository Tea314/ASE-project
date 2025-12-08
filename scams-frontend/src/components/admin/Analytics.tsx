import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, Calendar } from 'lucide-react';
import type { UtilizationData, DepartmentUsage } from '@/types';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface AnalyticsProps {
  utilization: UtilizationData[];
  departmentUsage: DepartmentUsage[];
  onDownloadReport: (type: 'csv' | 'pdf') => void;
}

export function Analytics({ utilization, departmentUsage, onDownloadReport }: AnalyticsProps) {
  const peakHoursData = [
    { hour: '8 AM', bookings: 5 },
    { hour: '9 AM', bookings: 12 },
    { hour: '10 AM', bookings: 18 },
    { hour: '11 AM', bookings: 15 },
    { hour: '12 PM', bookings: 8 },
    { hour: '1 PM', bookings: 10 },
    { hour: '2 PM', bookings: 22 },
    { hour: '3 PM', bookings: 19 },
    { hour: '4 PM', bookings: 16 },
    { hour: '5 PM', bookings: 11 },
    { hour: '6 PM', bookings: 6 },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Analytics & Reports</h2>
          <p className="text-muted-foreground">Insights and usage statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onDownloadReport('csv')} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => onDownloadReport('pdf')} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">61.6%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">162</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentUsage.length}</div>
            <p className="text-xs text-muted-foreground">Using room booking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Room Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Room Utilization Rate</CardTitle>
            <CardDescription>Percentage of booked vs. available hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <ChartContainer
                config={{
                  utilizationRate: {
                    label: 'Utilization %',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilization} margin={{ top: 5, right: 20, bottom: 60, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="roomName" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="utilizationRate" fill="var(--color-utilizationRate)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Department Usage</CardTitle>
            <CardDescription>Booking distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center">
              <ChartContainer
                config={{
                  bookingCount: {
                    label: 'Bookings',
                    color: 'hsl(var(--chart-2))',
                  },
                }}
                className="h-[300px] w-full max-w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentUsage}
                      dataKey="bookingCount"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry) => entry.department}
                    >
                      {departmentUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Frequency - Peak Hours</CardTitle>
            <CardDescription>Number of bookings throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <ChartContainer
                config={{
                  bookings: {
                    label: 'Bookings',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[250px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={peakHoursData} margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="var(--color-bookings)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-bookings)', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentUsage.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{dept.department}</span>
                  <span className="text-muted-foreground">
                    {dept.bookingCount} bookings • {dept.totalHours}h
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(dept.bookingCount / 162) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
