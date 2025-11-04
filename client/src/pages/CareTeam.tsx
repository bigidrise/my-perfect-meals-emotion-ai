import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GlassCard, GlassCardContent } from "@/components/glass/GlassCard";
import {
  Home,
  Users,
  ShieldCheck,
  Mail,
  KeyRound,
  UserPlus2,
  ClipboardEdit,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Info,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Types
type Role = "trainer" | "doctor" | "nutritionist" | "other";
type Permissions = {
  canViewMacros: boolean;
  canAddMeals: boolean;
  canEditPlan: boolean;
};
type CareMember = {
  id: string;
  name: string;
  email?: string;
  role: Role;
  status: "pending" | "active" | "revoked";
  permissions: Permissions;
};

// Default permissions by role (you can tweak later)
const DEFAULT_PERMS: Record<Role, Permissions> = {
  trainer: { canViewMacros: true, canAddMeals: true, canEditPlan: true },
  doctor: { canViewMacros: true, canAddMeals: false, canEditPlan: false },
  nutritionist: { canViewMacros: true, canAddMeals: true, canEditPlan: true },
  other: { canViewMacros: true, canAddMeals: false, canEditPlan: false },
};

export default function CareTeamPage() {
  const [, setLocation] = useLocation();

  // UI state
  const [members, setMembers] = useState<CareMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [invEmail, setInvEmail] = useState("");
  const [role, setRole] = useState<Role>("trainer");
  const [perms, setPerms] = useState<Permissions>(DEFAULT_PERMS["trainer"]);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load existing connections AND check for invite code in URL
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/api/care-team");
        if (mounted) setMembers(data.members);

        // Check for invite code in URL (e.g., /care-team?code=MP-XXXX-XXX)
        const urlParams = new URLSearchParams(window.location.search);
        const codeFromUrl = urlParams.get('code');
        
        if (codeFromUrl && mounted) {
          // Auto-accept invitation from URL
          try {
            const response = await apiRequest("/api/care-team/connect", { 
              method: "POST", 
              body: JSON.stringify({ code: codeFromUrl }) 
            });
            setMembers((prev) => [response.member, ...prev]);
            alert(`✅ Successfully accepted invitation! Welcome to the Care Team.`);
            // Clear the code from URL
            window.history.replaceState({}, '', '/care-team');
          } catch (e: any) {
            setError(e?.message ?? "Invalid or expired invitation code.");
          }
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load care team.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Keep perms synced to role unless user toggles manually
  useEffect(() => {
    setPerms(DEFAULT_PERMS[role]);
  }, [role]);

  const pending = useMemo(
    () => members.filter((m) => m.status === "pending"),
    [members],
  );
  const active = useMemo(
    () => members.filter((m) => m.status === "active"),
    [members],
  );

  async function inviteByEmail() {
    setError(null);
    if (!invEmail.trim()) {
      setError("Enter an email to invite.");
      return;
    }
    try {
      setLoading(true);
      const response = await apiRequest("/api/care-team/invite", { 
        method: "POST", 
        body: JSON.stringify({ email: invEmail, role, permissions: perms }) 
      });
      setMembers((prev) => [response.member, ...prev]);
      setInvEmail("");
      setError(null);
      alert(`✅ Invitation sent to ${invEmail}! They'll receive an email from support@myperfectmeals.com`);
    } catch (e: any) {
      setError(e?.message ?? "Failed to send invite.");
    } finally {
      setLoading(false);
    }
  }

  async function connectWithCode() {
    setError(null);
    if (!accessCode.trim()) {
      setError("Enter an access code.");
      return;
    }
    try {
      setLoading(true);
      const response = await apiRequest("/api/care-team/connect", { 
        method: "POST", 
        body: JSON.stringify({ code: accessCode }) 
      });
      setMembers((prev) => [response.member, ...prev]);
      setAccessCode("");
      alert(`✅ Successfully connected with access code!`);
    } catch (e: any) {
      setError(e?.message ?? "Invalid or expired access code.");
    } finally {
      setLoading(false);
    }
  }

  const togglePerm = (key: keyof Permissions) => {
    setPerms((p) => ({ ...p, [key]: !p[key] }));
  };

  async function approveMember(id: string) {
    try {
      await apiRequest(`/api/care-team/${id}/approve`, { method: "POST" });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "active" as const } : m)),
      );
      alert("✅ Member approved successfully!");
    } catch {
      setError("Failed to approve member.");
    }
  }

  async function revokeMember(id: string) {
    try {
      await apiRequest(`/api/care-team/${id}/revoke`, { method: "POST" });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "revoked" as const } : m)),
      );
      alert("✅ Access revoked successfully!");
    } catch {
      setError("Failed to revoke access.");
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4 sm:p-6"
    >
      {/* Back / Home */}
      <button
        onClick={() => setLocation("/dashboard")}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/10 backdrop-blur-none border border-white/20 hover:bg-black/20 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
        data-testid="button-back-dashboard"
      >
        <Home className="h-4 w-4" />
        
      </button>

      <div className="max-w-6xl mx-auto pt-14 sm:pt-16 space-y-6">
        {/* Header */}
        <GlassCard>
          <GlassCardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-white/90" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Care Team & Pro Access
                </h1>
                <p className="text-white/70 text-sm">
                  Invite your trainer, doctor, or nutritionist. You stay in
                  control of what they can see or change.
                </p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Invite Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invite by Email */}
          <GlassCard className="border-2 border-indigo-500/40">
            <GlassCardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-300" />
                <h2 className="text-xl font-bold text-white">
                  Invite by Email
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">Professional Role</Label>
                  <Select
                    value={role}
                    onValueChange={(v) => setRole(v as Role)}
                  >
                    <SelectTrigger className="bg-black/40 border-white/20 text-white">
                      <SelectValue placeholder="Choose role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nutritionist">Nutritionist</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/80">Email</Label>
                  <Input
                    value={invEmail}
                    onChange={(e) => setInvEmail(e.target.value)}
                    placeholder="pro@domain.com"
                    className="bg-black/40 text-white border-white/20 placeholder:text-white/40"
                    data-testid="input-invite-email"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-white/80">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-semibold">Permissions</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <PermToggle
                    label="View Macros"
                    checked={perms.canViewMacros}
                    onChange={() => togglePerm("canViewMacros")}
                  />
                  <PermToggle
                    label="Add Meals"
                    checked={perms.canAddMeals}
                    onChange={() => togglePerm("canAddMeals")}
                  />
                  <PermToggle
                    label="Edit Plan"
                    checked={perms.canEditPlan}
                    onChange={() => togglePerm("canEditPlan")}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Info className="h-3.5 w-3.5" /> You can change these anytime
                  per person.
                </div>
              </div>

              <Button
                disabled={loading}
                onClick={inviteByEmail}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                data-testid="button-send-invite"
              >
                <UserPlus2 className="h-4 w-4 mr-2" />
                Send Invite
              </Button>
            </GlassCardContent>
          </GlassCard>

          {/* Connect with Access Code */}
          <GlassCard className="border-2 border-teal-500/40">
            <GlassCardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-teal-300" />
                <h2 className="text-xl font-bold text-white">
                  Connect with Access Code
                </h2>
              </div>
              <p className="text-sm text-white/70">
                If your professional gave you a code, enter it here to link
                instantly.
              </p>
              <div>
                <Label className="text-white/80">Access Code</Label>
                <Input
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="e.g. MP-9ZX4-QL"
                  className="bg-black/40 text-white border-white/20 placeholder:text-white/40"
                  data-testid="input-access-code"
                />
              </div>
              <Button
                disabled={loading}
                onClick={connectWithCode}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                data-testid="button-connect-code"
              >
                <ClipboardEdit className="h-4 w-4 mr-2" />
                Link with Code
              </Button>
            </GlassCardContent>
          </GlassCard>

          {/* How it Works */}
          <GlassCard className="border-2 border-emerald-500/40">
            <GlassCardContent className="p-6 space-y-3">
              <h2 className="text-xl font-bold text-white">How it Works</h2>
              <ul className="list-disc pl-5 text-white/80 text-sm space-y-2">
                <li>You invite your pro or connect with their access code.</li>
                <li>
                  They get limited access based on the permissions you set.
                </li>
                <li>Trainers can add meals; doctors can review macros.</li>
                <li>
                  You can revoke access anytime. You're always in control.
                </li>
              </ul>
              <div className="text-xs text-white/60">
                Note: This is not medical advice. Always follow your licensed
                provider's instructions.
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-900/30 text-red-100 p-3">
            {error}
          </div>
        )}

        {/* Active Connections */}
        <SectionHeader
          title="Active Care Team"
          subtitle="Connected professionals"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.length === 0 && (
            <EmptyCard label="No active connections yet." />
          )}
          {active.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onApprove={undefined}
              onRevoke={() => revokeMember(m.id)}
              setLocation={setLocation}
            />
          ))}
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

      {/* Floating back-to-top & back buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-3">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
          title="Back to top"
        >
          <ArrowLeft className="rotate-90 w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}

// ---------- Small Components ----------
function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-white font-bold text-lg">{title}</h3>
      {subtitle && <div className="text-white/60 text-sm">{subtitle}</div>}
    </div>
  );
}

function EmptyCard({ label }: { label: string }) {
  return (
    <Card className="bg-black/30 border border-white/10">
      <CardContent className="p-6">
        <div className="text-white/70 text-sm">{label}</div>
      </CardContent>
    </Card>
  );
}

function PermToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/70 text-xs font-medium">{label}</span>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-indigo-500 scale-75"
      />
    </div>
  );
}

function roleBadge(role: Role) {
  const map: Record<Role, { text: string; className: string }> = {
    trainer: {
      text: "Trainer",
      className: "bg-emerald-600/20 text-emerald-300 border-emerald-400/40",
    },
    doctor: {
      text: "Doctor",
      className: "bg-sky-600/20 text-sky-300 border-sky-400/40",
    },
    nutritionist: {
      text: "Nutritionist",
      className: "bg-amber-600/20 text-amber-300 border-amber-400/40",
    },
    other: {
      text: "Other",
      className: "bg-zinc-600/20 text-zinc-300 border-zinc-400/40",
    },
  };
  const r = map[role];
  return <Badge className={`${r.className} border`}>{r.text}</Badge>;
}

function statusBadge(status: CareMember["status"]) {
  if (status === "active")
    return (
      <Badge className="bg-green-600/20 text-green-300 border border-green-400/40">
        Active
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="bg-yellow-600/20 text-yellow-300 border border-yellow-400/40">
        Pending
      </Badge>
    );
  return (
    <Badge className="bg-red-600/20 text-red-300 border border-red-400/40">
      Revoked
    </Badge>
  );
}

function MemberCard({
  member,
  onApprove,
  onRevoke,
  setLocation,
}: {
  member: CareMember;
  onApprove?: () => void;
  onRevoke?: () => void;
  setLocation: (path: string) => void;
}) {
  return (
    <GlassCard className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            {member.name ?? "Unnamed Pro"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {statusBadge(member.status)}
          </div>
        </div>
        {member.email && (
          <CardDescription className="text-white/70 mt-1">
            {member.email}
          </CardDescription>
        )}
      </CardHeader>

      <GlassCardContent className="p-4">
        <div className="flex items-center gap-2">
          {member.status === "active" && (
            <Button
              onClick={() => setLocation("/pro-portal")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              data-testid="button-open-pro-portal"
            >
              <ClipboardEdit className="h-4 w-4 mr-2" />
              Open Pro Portal
            </Button>
          )}
          {member.status === "pending" && onApprove && (
            <Button
              onClick={onApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              data-testid="button-approve-member"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          {onRevoke && (
            <Button
              onClick={onRevoke}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-revoke-member"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Revoke
            </Button>
          )}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
