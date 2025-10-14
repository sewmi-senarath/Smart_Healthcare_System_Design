import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      // Navigation will be handled by App.tsx based on auth state
    } catch (error) {
      // Error is handled in AuthContext with toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="w-full max-w-md p-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl">HealthCare+</h1>
            <p className="text-muted-foreground">Smart Healthcare System</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-3">Demo Credentials:</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Patient</p>
                  <p className="text-muted-foreground">patient@example.com / password123</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Nurse</p>
                  <p className="text-muted-foreground">nurse@example.com / password123</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Doctor</p>
                  <p className="text-muted-foreground">doctor@example.com / password123</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Pharmacist</p>
                  <p className="text-muted-foreground">pharmacist@example.com / password123</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Healthcare Manager</p>
                  <p className="text-muted-foreground">manager@example.com / password123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
