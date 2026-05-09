import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/bottom-nav";

import OnboardingPage from "@/pages/onboarding";
import StorePage from "@/pages/store";
import MyGiftsPage from "@/pages/my-gifts";
import SeasonPage from "@/pages/season";
import ProfilePage from "@/pages/profile";
import AdminPage from "@/pages/admin";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect to="/" />;
  if (adminOnly && !user.isAdmin) return <Redirect to="/store" />;
  if (user.isNewUser && !user.onboardingComplete) return <Redirect to="/" />;

  return <Component />;
}

function OnboardingOrRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && (!user.isNewUser || user.onboardingComplete)) {
    return <Redirect to="/store" />;
  }

  return <OnboardingPage />;
}

function Router() {
  return (
    <div className="min-h-[100dvh] pb-16 bg-background text-foreground flex flex-col relative w-full overflow-x-hidden">
      <Switch>
        <Route path="/" component={OnboardingOrRedirect} />
        <Route path="/store">{() => <ProtectedRoute component={StorePage} />}</Route>
        <Route path="/my-gifts">{() => <ProtectedRoute component={MyGiftsPage} />}</Route>
        <Route path="/season">{() => <ProtectedRoute component={SeasonPage} />}</Route>
        <Route path="/profile">{() => <ProtectedRoute component={ProfilePage} />}</Route>
        <Route path="/admin">{() => <ProtectedRoute component={AdminPage} adminOnly={true} />}</Route>
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
