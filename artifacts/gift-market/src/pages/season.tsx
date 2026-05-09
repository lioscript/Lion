import { Header } from "./store";
import { Star, Trophy, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SeasonPage() {
  return (
    <div className="w-full flex flex-col min-h-full">
      <Header />
      
      <div className="px-4 py-4 flex flex-col gap-6">
        
        {/* Season Banner */}
        <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-900/40 via-orange-900/20 to-card border border-yellow-500/20 p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="text-xs font-bold text-yellow-500 tracking-wider uppercase mb-1">CURRENT</div>
              <h1 className="text-3xl font-black mb-1">Season #1</h1>
              <p className="text-sm text-muted-foreground">Ends in 12 days</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-white">Rank 14,203</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Tabs */}
        <div className="flex bg-card p-1 rounded-xl border border-white/5">
          <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-white/10 text-white shadow-sm">
            Global
          </button>
          <button className="flex-1 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-white">
            Season 1
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Purchased" value="0" icon={<Trophy className="w-4 h-4 text-blue-400" />} />
          <StatCard title="Sold" value="0" icon={<Star className="w-4 h-4 text-green-400" />} />
          <StatCard title="Referrals" value="0" icon={<Users className="w-4 h-4 text-purple-400" />} />
          <StatCard title="Tasks" value="0/10" icon={<CheckCircle2 className="w-4 h-4 text-orange-400" />} />
        </div>

        {/* Tasks Section */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            Tasks <span className="bg-white/10 text-[10px] px-2 py-0.5 rounded-full font-mono">NEW</span>
          </h2>
          
          <div className="flex flex-col gap-2">
            <TaskItem 
              title="Connect Wallet" 
              reward="+1000" 
              isCompleted={false} 
              icon="👛" 
            />
            <TaskItem 
              title="Buy first Gift" 
              reward="+5000" 
              isCompleted={false} 
              icon="🎁" 
            />
            <TaskItem 
              title="Invite 3 Friends" 
              reward="+3000" 
              isCompleted={false} 
              icon="👥" 
            />
            <TaskItem 
              title="Follow Channel" 
              reward="+500" 
              isCompleted={true} 
              icon="📢" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        {icon}
      </div>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}

function TaskItem({ title, reward, isCompleted, icon }: { title: string, reward: string, isCompleted: boolean, icon: string }) {
  return (
    <div className="bg-card border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-100 transition-opacity">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
          {icon}
        </div>
        <div>
          <h4 className={`font-semibold text-sm ${isCompleted ? 'text-muted-foreground line-through' : 'text-white'}`}>{title}</h4>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className={`w-3 h-3 ${isCompleted ? 'text-muted-foreground' : 'text-yellow-500 fill-yellow-500'}`} />
            <span className={`text-xs font-bold ${isCompleted ? 'text-muted-foreground' : 'text-yellow-500'}`}>{reward}</span>
          </div>
        </div>
      </div>
      
      {isCompleted ? (
        <CheckCircle2 className="w-6 h-6 text-green-500" />
      ) : (
        <button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
