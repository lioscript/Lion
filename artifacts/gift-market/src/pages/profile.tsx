import { useAuth } from "@/hooks/use-auth";
import { Header } from "./store";
import { TonIcon } from "@/components/ton-icon";
import { Settings, Copy, Share2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col min-h-full">
      <Header />
      
      <div className="px-4 py-6 flex flex-col gap-6">
        
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-2xl font-bold border-2 border-card shadow-lg shadow-primary/20">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-md font-mono">
                  {user?.telegramId}
                </span>
                <Copy className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-white">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Admin Banner */}
        {user?.isAdmin && (
          <Link href="/admin">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-xl text-red-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-red-500">Admin Dashboard</h3>
                  <p className="text-xs text-red-500/70">Manage marketplace gifts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500" />
            </div>
          </Link>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">Inventory</span>
            <span className="text-xl font-bold">0</span>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">Bought</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">0</span>
              <TonIcon className="w-3 h-3 text-primary" />
            </div>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">Sold</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">0</span>
              <TonIcon className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>

        {/* Cashback Level */}
        <div className="bg-card border border-white/5 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                Cashback Bonus <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">Level 1</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Current return: 5% of fees</p>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between text-xs mb-2 font-medium">
              <span className="text-white">0 TON</span>
              <span className="text-muted-foreground">100 TON to Lvl 2</span>
            </div>
            <Progress value={5} className="h-2 bg-white/5" />
          </div>
        </div>

        {/* Invite Friends */}
        <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 rounded-3xl p-5">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-xl mb-1">Invite Friends</h3>
              <p className="text-sm text-white/70">Earn 10% of your friends' trading fees for life.</p>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1 bg-primary text-white rounded-xl h-12 font-semibold">
                Share Link
              </Button>
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl bg-white/5 border-white/10 shrink-0">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Just for the ChevronRight icon internally
import { ChevronRight } from "lucide-react";
