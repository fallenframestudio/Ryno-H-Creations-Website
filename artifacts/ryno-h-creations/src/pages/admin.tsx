import React, { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useAdminLogin, 
  useListPaintings, 
  useCreatePainting, 
  useUpdatePainting, 
  useDeletePainting,
  getListPaintingsQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("adminToken"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const loginMutation = useAdminLogin();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { username, password } }, {
      onSuccess: (data) => {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
        toast({ title: "Logged in successfully" });
      },
      onError: () => {
        toast({ title: "Login failed", variant: "destructive" });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md rounded-none">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-center">Gallery Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="rounded-none"
                />
              </div>
              <Button type="submit" className="w-full rounded-none" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-serif">Inventory Management</h1>
        <Button variant="outline" onClick={handleLogout} className="rounded-none">Logout</Button>
      </div>
      
      <div className="grid md:grid-cols-[350px_1fr] gap-12">
        <div>
          <CreatePaintingForm token={token} />
        </div>
        <div>
          <PaintingList token={token} />
        </div>
      </div>
    </div>
  );
}

function OrientationToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-none border border-input overflow-hidden">
      <button
        type="button"
        onClick={() => onChange("portrait")}
        className={`flex-1 py-2 text-sm font-medium transition-colors ${value === "portrait" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
      >
        Portrait
      </button>
      <button
        type="button"
        onClick={() => onChange("landscape")}
        className={`flex-1 py-2 text-sm font-medium transition-colors ${value === "landscape" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
      >
        Landscape
      </button>
    </div>
  );
}

function CreatePaintingForm({ token }: { token: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [sold, setSold] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = useCreatePainting({
    request: { headers: { Authorization: "Bearer " + token } }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !file) {
      toast({ title: "Please fill all required fields including image", variant: "destructive" });
      return;
    }

    try {
      const painting = await createMutation.mutateAsync({
        data: {
          title,
          description: description || undefined,
          price: Number(price),
          featured,
          sold,
          orientation
        }
      });

      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
      const uploadRes = await fetch(`${apiBase}/api/admin/paintings/${painting.id}/image`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");

      toast({ title: "Painting added successfully" });
      
      setTitle("");
      setDescription("");
      setPrice("");
      setFeatured(false);
      setSold(false);
      setOrientation("portrait");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
    } catch (error) {
      toast({ title: "Failed to create painting", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="rounded-none border-border/40 shadow-sm sticky top-24">
      <CardHeader className="bg-muted/50 border-b border-border/40 pb-4">
        <CardTitle className="font-serif text-lg">Add New Work</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (ZAR) *</Label>
            <Input id="price" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} required className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="rounded-none resize-none" rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Orientation</Label>
            <OrientationToggle value={orientation} onChange={setOrientation} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image File *</Label>
            <Input id="image" type="file" accept="image/*" ref={fileInputRef} onChange={e => setFile(e.target.files?.[0] || null)} required className="rounded-none cursor-pointer" />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(!!c)} />
              <Label htmlFor="featured" className="cursor-pointer">Feature on homepage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sold" checked={sold} onCheckedChange={(c) => setSold(!!c)} />
              <Label htmlFor="sold" className="cursor-pointer">Mark as Sold</Label>
            </div>
          </div>
          <Button type="submit" className="w-full rounded-none mt-4" disabled={createMutation.isPending || isUploading}>
            {(createMutation.isPending || isUploading) ? "Uploading..." : "Publish to Gallery"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PaintingList({ token }: { token: string }) {
  const { data: paintings, isLoading } = useListPaintings();
  const updateMutation = useUpdatePainting({
    request: { headers: { Authorization: "Bearer " + token } }
  });
  const deleteMutation = useDeletePainting({
    request: { headers: { Authorization: "Bearer " + token } }
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const handleUpdatePrice = (id: number) => {
    updateMutation.mutate({ id, data: { price: Number(editPrice) } }, {
      onSuccess: () => {
        setEditingId(null);
        toast({ title: "Price updated" });
        queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
      }
    });
  };

  const handleToggleFeatured = (id: number, currentFeatured: boolean) => {
    updateMutation.mutate({ id, data: { featured: !currentFeatured } }, {
      onSuccess: () => {
        toast({ title: "Featured status updated" });
        queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
      }
    });
  };

  const handleToggleSold = (id: number, currentSold: boolean) => {
    updateMutation.mutate({ id, data: { sold: !currentSold } }, {
      onSuccess: () => {
        toast({ title: currentSold ? "Marked as available" : "Marked as sold" });
        queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
      }
    });
  };

  const handleToggleOrientation = (id: number, currentOrientation: string) => {
    const next = currentOrientation === "landscape" ? "portrait" : "landscape";
    updateMutation.mutate({ id, data: { orientation: next } }, {
      onSuccess: () => {
        toast({ title: `Orientation set to ${next}` });
        queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this painting?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Painting deleted" });
          queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
        }
      });
    }
  };

  if (isLoading) return <div className="animate-pulse flex flex-col gap-4"><div className="h-20 bg-muted"/><div className="h-20 bg-muted"/></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif mb-4">Current Inventory ({paintings?.length || 0})</h2>
      {paintings?.map(painting => (
        <div key={painting.id} className={`flex gap-4 p-4 border bg-card hover:bg-muted/20 transition-colors ${painting.sold ? "border-border/20 opacity-70" : "border-border/40"}`}>
          <div className="w-20 h-20 bg-muted shrink-0 flex items-center justify-center overflow-hidden relative">
            {painting.imageUrl ? (
              <img src={painting.imageUrl} alt={painting.title} className="w-full h-full object-cover" />
            ) : <span className="text-xs text-muted-foreground">No img</span>}
            {painting.sold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold tracking-wider">SOLD</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h3 className="font-medium truncate">{painting.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{painting.orientation}</p>
            {editingId === painting.id ? (
              <div className="flex items-center gap-2 mt-2">
                <Input 
                  type="number" 
                  value={editPrice} 
                  onChange={e => setEditPrice(e.target.value)} 
                  className="h-8 w-24 rounded-none" 
                  autoFocus
                />
                <Button size="sm" onClick={() => handleUpdatePrice(painting.id)} className="h-8 rounded-none">Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8">Cancel</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1 cursor-pointer hover:text-foreground hover:underline" onClick={() => { setEditingId(painting.id); setEditPrice(painting.price.toString()); }}>
                R {painting.price.toLocaleString('en-ZA')}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0 items-end justify-center">
            <div className="flex items-center gap-2 text-xs">
              <Checkbox 
                id={`feat-${painting.id}`} 
                checked={painting.featured} 
                onCheckedChange={() => handleToggleFeatured(painting.id, painting.featured)} 
              />
              <Label htmlFor={`feat-${painting.id}`} className="cursor-pointer text-xs">Featured</Label>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Checkbox 
                id={`sold-${painting.id}`} 
                checked={painting.sold} 
                onCheckedChange={() => handleToggleSold(painting.id, painting.sold)} 
              />
              <Label htmlFor={`sold-${painting.id}`} className="cursor-pointer text-xs">Sold</Label>
            </div>
            <button
              onClick={() => handleToggleOrientation(painting.id, painting.orientation)}
              className="text-[10px] tracking-wide uppercase text-muted-foreground border border-border/40 px-2 py-1 hover:border-primary hover:text-primary transition-colors"
            >
              {painting.orientation === "landscape" ? "↔ Land" : "↕ Port"}
            </button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(painting.id)} className="h-7 text-xs rounded-none">
              Delete
            </Button>
          </div>
        </div>
      ))}
      {paintings?.length === 0 && (
        <p className="text-muted-foreground italic">No works in inventory yet.</p>
      )}
    </div>
  );
}
