import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { proStore, ClientProfile, ProRole } from "@/lib/proData";
import { Plus, User2, ArrowRight, ArrowLeft, Archive, RotateCcw } from "lucide-react";
import TrashButton from "@/components/ui/TrashButton";

export default function ProClients(){
  const [, setLocation] = useLocation();
  const [clients, setClients] = useState<ClientProfile[]>(() => proStore.listClients());
  const [showArchived, setShowArchived] = useState(false);
  const [name,setName] = useState(""); 
  const [email,setEmail]=useState("");
  const [role, setRole] = useState<ProRole>("trainer");

  const add = () => {
    if (!name.trim()) return;
    const c: ClientProfile = { id: crypto.randomUUID(), name: name.trim(), email: email.trim() || undefined, role };
    const next = [c, ...clients]; setClients(next); proStore.saveClients(next);
    setName(""); setEmail(""); setRole("trainer");
  };
  
  const archiveClient = (id: string) => {
    proStore.archiveClient(id);
    setClients([...proStore.listClients()]);
  };
  
  const restoreClient = (id: string) => {
    proStore.restoreClient(id);
    setClients([...proStore.listClients()]);
  };
  
  const deleteClient = (id: string, name: string) => {
    proStore.deleteClient(id);
    setClients([...proStore.listClients()]);
  };
  
  const go = (id:string)=> setLocation(`/pro/clients/${id}`);

  return (
    <div className="min-h-screen p-4 text-white bg-gradient-to-br from-black/60 via-indigo-600 to-black/80">
      <div className="max-w-5xl mx-auto space-y-6 pt-2">
        <button
          onClick={() => setLocation("/pro-portal")}
          className="mb-4 w-12 h-12 rounded-2xl bg-black/10 hover:bg-black/20 active:bg-black/20 flex items-center justify-center transition-colors shrink-0 overflow-hidden"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 text-white shrink-0" />
        </button>

        <div className="rounded-2xl p-6 bg-white/5 border border-white/20 mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">👥 Pro Portal — Clients</h1>
              <p className="text-white mt-1">Add clients and open their dashboards.</p>
            </div>
            <Button
              onClick={() => setShowArchived(!showArchived)}
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              {showArchived ? "Show Active" : "Show Archived"}
            </Button>
          </div>
        </div>

        <Card className="bg-white/5 border border-white/20">
          <CardHeader><CardTitle className="text-white">Add Client</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Name" className="bg-black/30 border-white/30 text-white" value={name} onChange={e=>setName(e.target.value)} />
              <Input placeholder="Email (optional)" className="bg-black/30 border-white/30 text-white" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select value={role} onValueChange={(v) => setRole(v as ProRole)}>
                <SelectTrigger className="bg-black/30 border-white/30 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trainer">Trainer / Coach</SelectItem>
                  <SelectItem value="doctor">Doctor / Physician</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="pa">Physician Assistant</SelectItem>
                  <SelectItem value="nutritionist">Nutritionist</SelectItem>
                  <SelectItem value="dietitian">Dietitian</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={add} className="bg-white/10 border border-white/20 text-white hover:bg-white/20"><Plus className="h-4 w-4 mr-1" />Add Client</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {clients.filter(c => showArchived ? c.archived : !c.archived).length===0 ? (
            <div className="text-white">{showArchived ? "No archived clients." : "No active clients yet. Add one above."}</div>
          ) : clients.filter(c => showArchived ? c.archived : !c.archived).map(c=>(
            <Card key={c.id} className="bg-white/5 border border-white/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center"><User2 className="h-5 w-5 text-white" /></div>
                  <div>
                    <div className="font-semibold text-white">{c.name}</div>
                    {c.email && <div className="text-white text-sm">{c.email}</div>}
                    {c.role && (
                      <div className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/30 text-purple-200 border border-purple-400/30">
                        {c.role === "doctor" ? "Doctor" : c.role === "nurse" ? "Nurse" : c.role === "pa" ? "PA" : c.role === "nutritionist" ? "Nutritionist" : c.role === "dietitian" ? "Dietitian" : "Trainer"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.archived ? (
                    <>
                      <TrashButton
                        onClick={() => deleteClient(c.id, c.name)}
                        size="sm"
                        confirm
                        confirmMessage={`Delete ${c.name} permanently? This will remove all data and cannot be undone.`}
                        ariaLabel={`Permanently delete ${c.name}`}
                        data-testid={`button-delete-client-${c.id}`}
                      />
                      <Button
                        onClick={() => restoreClient(c.id)}
                        variant="ghost"
                        size="icon"
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        data-testid={`button-restore-client-${c.id}`}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => archiveClient(c.id)}
                      variant="ghost"
                      size="icon"
                      className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                      data-testid={`button-archive-client-${c.id}`}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  <Button onClick={()=>go(c.id)} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Open <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
