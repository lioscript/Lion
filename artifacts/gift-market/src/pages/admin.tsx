import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  useAdminListGifts, 
  usePreviewGift, 
  useCreateGift, 
  useUpdateGift, 
  useDeleteGift 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TonIcon } from "@/components/ton-icon";
import { ArrowLeft, Plus, Image as ImageIcon, Link as LinkIcon, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function AdminPage() {
  const { toast } = useToast();
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const { data: gifts, refetch: refetchGifts } = useAdminListGifts();
  
  const previewMutation = usePreviewGift();
  const createMutation = useCreateGift();
  const updateMutation = useUpdateGift();
  const deleteMutation = useDeleteGift();

  const handlePreview = () => {
    if (!link) return;
    previewMutation.mutate(
      { data: { link } },
      {
        onError: () => {
          toast({ title: "Error", description: "Could not fetch gift details", variant: "destructive" });
        }
      }
    );
  };

  const handleCreate = () => {
    if (!previewMutation.data || !price) return;
    
    createMutation.mutate(
      {
        data: {
          name: previewMutation.data.name,
          giftSlug: previewMutation.data.giftSlug,
          telegramLink: link,
          imageUrl: previewMutation.data.imageUrl,
          attributes: previewMutation.data.attributes,
          price: parseFloat(price),
          isListed: true
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Gift added to marketplace" });
          setIsAddOpen(false);
          setLink("");
          setPrice("");
          previewMutation.reset();
          refetchGifts();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create gift", variant: "destructive" });
        }
      }
    );
  };

  const toggleStatus = (id: number, currentStatus: boolean) => {
    updateMutation.mutate(
      { id, data: { isListed: !currentStatus } },
      { onSuccess: () => refetchGifts() }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this gift?")) {
      deleteMutation.mutate(
        { id },
        { onSuccess: () => refetchGifts() }
      );
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-lg">Admin Panel</h1>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-white rounded-lg">
              <Plus className="w-4 h-4 mr-1" /> Add Gift
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-foreground w-[90vw] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Import Telegram Gift</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground font-medium">Telegram Gift Link</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="https://t.me/nft/..." 
                      className="pl-9 bg-background border-white/10"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={handlePreview}
                    disabled={!link || previewMutation.isPending}
                  >
                    Preview
                  </Button>
                </div>
              </div>

              {previewMutation.data && (
                <div className="border border-white/10 rounded-xl p-4 bg-background/50 flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                      {previewMutation.data.imageUrl ? (
                        <img src={previewMutation.data.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold">{previewMutation.data.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Slug: {previewMutation.data.giftSlug}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground font-medium">Listing Price (TON)</label>
                    <div className="relative">
                      <TonIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00" 
                        className="pl-9 bg-background border-white/10 text-lg font-bold"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary text-white h-12 rounded-xl font-bold mt-2"
                    onClick={handleCreate}
                    disabled={!price || createMutation.isPending}
                  >
                    Publish to Store
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">All Gifts Inventory</h2>
        
        {gifts?.length === 0 ? (
          <div className="text-center p-8 bg-card border border-white/5 rounded-2xl text-muted-foreground">
            No gifts in database
          </div>
        ) : (
          gifts?.map(gift => (
            <div key={gift.id} className="bg-card border border-white/5 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center p-1">
                  {gift.imageUrl && <img src={gift.imageUrl} className="w-full h-full object-contain" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{gift.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-primary font-bold flex items-center gap-1">
                      {gift.price} <TonIcon className="w-3 h-3" />
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${gift.isListed ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                      {gift.isListed ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {gift.isListed ? 'Listed' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch 
                  checked={gift.isListed} 
                  onCheckedChange={() => toggleStatus(gift.id, gift.isListed)} 
                />
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => handleDelete(gift.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
