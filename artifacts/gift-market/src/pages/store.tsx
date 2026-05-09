import { useListGifts } from "@workspace/api-client-react";
import { TonIcon } from "@/components/ton-icon";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Link } from "wouter";

export function Header() {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-card px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/5">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold">0</span>
        </div>
        <div className="bg-card px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/5">
          <TonIcon className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-blue-500">0.00</span>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-xs font-bold border border-white/10 shadow-lg shadow-primary/20">
        GM
      </div>
    </div>
  );
}

export function GiftCard({ gift }: { gift: any }) {
  return (
    <div className="bg-card rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative p-4 flex flex-col items-center justify-center">
        {gift.imageUrl ? (
          <img src={gift.imageUrl} alt={gift.name} className="w-3/4 h-3/4 object-contain drop-shadow-2xl z-10" />
        ) : (
          <div className="w-3/4 h-3/4 bg-white/5 rounded-2xl z-10" />
        )}
        
        {/* Number badge */}
        <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-mono text-white/70 border border-white/10">
          #{gift.id.toString().padStart(4, '0')}
        </div>
      </div>
      
      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-semibold text-sm truncate">{gift.name}</h3>
        <Button size="sm" className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl h-8">
          <span className="flex items-center justify-center gap-1.5 font-bold">
            {gift.price.toFixed(2)} <TonIcon className="w-3.5 h-3.5 text-primary" />
          </span>
        </Button>
      </div>
    </div>
  );
}

export default function StorePage() {
  const [search, setSearch] = useState("");
  const { data: gifts, isLoading } = useListGifts({ search: search || undefined });

  return (
    <div className="w-full flex flex-col min-h-full">
      <Header />
      
      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Banner */}
        <div className="w-full h-32 rounded-2xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 relative overflow-hidden flex items-center p-6">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary blur-3xl opacity-20 rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-1">New Collection</h2>
            <p className="text-sm text-white/70">Discover exclusive Telegram gifts</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search gifts..." 
              className="pl-9 bg-card border-white/5 rounded-xl h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-card border-white/5 rounded-xl h-10 w-10">
            <SlidersHorizontal className="w-4 h-4 text-white/70" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/5 pb-2">
          <button className="text-sm font-semibold text-primary relative">
            All items
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Collections
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-square rounded-2xl bg-white/5" />
                <Skeleton className="h-4 w-2/3 bg-white/5" />
                <Skeleton className="h-8 w-full rounded-xl bg-white/5" />
              </div>
            ))
          ) : gifts && gifts.length > 0 ? (
            gifts.map(gift => <GiftCard key={gift.id} gift={gift} />)
          ) : (
            <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-muted-foreground font-medium">No gifts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
