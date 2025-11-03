// client/src/pages/pro/ProClientDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proStore, Targets, ClinicalContext } from "@/lib/proData";
import {
  Settings,
  ClipboardList,
  ArrowLeft,
  Activity,
  Stethoscope,
  Calendar,
  Trophy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProRole =
  | "doctor"
  | "nurse"
  | "pa"
  | "nutritionist"
  | "dietitian"
  | "trainer";

function getRoleLabel(role: ProRole): string {
  switch (role) {
    case "doctor":
      return "Physician";
    case "nurse":
      return "Clinician";
    case "pa":
      return "Clinician";
    case "nutritionist":
      return "Dietitian";
    case "dietitian":
      return "Dietitian";
    case "trainer":
      return "Coach";
    default:
      return "Professional";
  }
}

export default function ProClientDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/pro/clients/:id");
  const clientId = params?.id as string;

  const client = useMemo(
    () => proStore.listClients().find((c) => c.id === clientId),
    [clientId],
  );
  const [t, setT] = useState<Targets>(() => proStore.getTargets(clientId));
  const [ctx, setCtx] = useState<ClinicalContext>(() =>
    proStore.getContext(clientId),
  );

  useEffect(() => {
    setT(proStore.getTargets(clientId));
    setCtx(proStore.getContext(clientId));
  }, [clientId]);

  // Read role from CLIENT first (set when client was added), then ctx, then default to trainer
  const role = (client?.role ?? ctx.role ?? "trainer") as ProRole;
  const isTrainer = role === "trainer";
  const isClinician = [
    "doctor",
    "nurse",
    "pa",
    "nutritionist",
    "dietitian",
  ].includes(role);
  const roleLabel = getRoleLabel(role);

  console.log("🔍 Client Dashboard Debug:", {
    clientId,
    clientRole: client?.role,
    ctxRole: ctx.role,
    finalRole: role,
    roleLabel,
  });

  const saveTargets = () => {
    proStore.setTargets(clientId, t);
    toast({
      title: "✅ Targets saved",
      description: "Macro targets updated successfully.",
    });
  };

  const saveContext = () => {
    proStore.setContext(clientId, ctx);
    toast({
      title: "✅ Context saved",
      description: isTrainer
        ? "Coaching notes saved."
        : `${roleLabel} notes and clinical context saved.`,
    });
  };

  const scheduleFollowUp = () => {
    if (!ctx.followupWeeks) {
      toast({
        title: "⚠️ Select weeks",
        description: "Choose 4, 8, or 12 weeks for follow-up.",
      });
      return;
    }
    proStore.scheduleFollowUp(
      clientId,
      ctx.followupWeeks,
      ctx.patientNote || "Follow-up scheduled",
    );
    toast({
      title: "✅ Follow-up scheduled",
      description: `${ctx.followupWeeks}-week follow-up added.`,
    });
    // Clear dropdown and trigger re-render to show new follow-up
    setCtx({ ...ctx, followupWeeks: undefined });
  };

  const toggleClinicalTag = (
    tag:
      | "GLP-1"
      | "Cardiac"
      | "Renal"
      | "Bariatric"
      | "Post-Op"
      | "Diabetes"
      | "General",
  ) => {
    const current = ctx.clinicalTags || [];
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setCtx({ ...ctx, clinicalTags: next });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-4 text-white bg-gradient-to-br from-black/60 via-orange-600 to-black/80"
    >
      {/* Back Button */}
      <button
        onClick={() => setLocation("/pro/clients")}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/10 backdrop-blur-none border border-white/20 hover:bg-black/20 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="max-w-5xl mx-auto space-y-6 pt-14 sm:pt-16 pb-16">
        <div className="rounded-2xl p-6 bg-white/5 border border-white/20 mt-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-white/70 mt-1">
            {isTrainer &&
              "Set macro targets, carb directives, and coaching notes."}
            {isClinician &&
              `Set macro targets, clinical context, and ${roleLabel.toLowerCase()} notes.`}
          </p>
          <p className="text-white/90 mt-3 text-lg">
            👤 {client?.name || "Client"}
          </p>
        </div>

        {/* MACRO TARGETS - SHOWN TO BOTH */}
        <Card className="bg-white/5 border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" /> Macro Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-sm text-white/70 mb-1 block">
                Calories
              </label>
              <Input
                inputMode="numeric"
                className="bg-black/30 border-white/30 text-white"
                value={t.kcal}
                onChange={(e) =>
                  setT({ ...t, kcal: Number(e.target.value || 0) })
                }
                placeholder="kcal"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 mb-1 block">
                Protein (g)
              </label>
              <Input
                inputMode="numeric"
                className="bg-black/30 border-white/30 text-white"
                value={t.protein}
                onChange={(e) =>
                  setT({ ...t, protein: Number(e.target.value || 0) })
                }
                placeholder="protein"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 mb-1 block">
                Carbs (g)
              </label>
              <Input
                inputMode="numeric"
                className="bg-black/30 border-white/30 text-white"
                value={t.carbs}
                onChange={(e) =>
                  setT({ ...t, carbs: Number(e.target.value || 0) })
                }
                placeholder="carbs"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 mb-1 block">
                Fat (g)
              </label>
              <Input
                inputMode="numeric"
                className="bg-black/30 border-white/30 text-white"
                value={t.fat}
                onChange={(e) =>
                  setT({ ...t, fat: Number(e.target.value || 0) })
                }
                placeholder="fat"
              />
            </div>

            {/* DIETARY DIRECTIVES - ORGANIZED BY ROLE */}
            <div className="col-span-full mt-3">
              <label className="text-sm font-medium text-white/90 mb-2 block">
                {isClinician
                  ? "Medical Dietary Directives"
                  : "Performance Dietary Directives"}
              </label>

              {isClinician && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.diabetesFriendly}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: {
                            ...t.flags,
                            diabetesFriendly: e.target.checked,
                          },
                        })
                      }
                    />
                    Diabetes-Friendly
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.lowSodium}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: { ...t.flags, lowSodium: e.target.checked },
                        })
                      }
                    />
                    Low-Sodium
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.glp1}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: { ...t.flags, glp1: e.target.checked },
                        })
                      }
                    />
                    GLP-1 Support
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.cardiac}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: { ...t.flags, cardiac: e.target.checked },
                        })
                      }
                    />
                    Cardiac-Friendly
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.renal}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: { ...t.flags, renal: e.target.checked },
                        })
                      }
                    />
                    Renal-Friendly
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.postBariatric}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: {
                            ...t.flags,
                            postBariatric: e.target.checked,
                          },
                        })
                      }
                    />
                    Post-Bariatric
                  </label>
                </div>
              )}

              {isTrainer && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.highProtein}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: { ...t.flags, highProtein: e.target.checked },
                        })
                      }
                    />
                    High-Protein Focus
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.carbCycling}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: { ...t.flags, carbCycling: e.target.checked },
                        })
                      }
                    />
                    Carb Cycling Protocol
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!t.flags?.antiInflammatory}
                      onChange={(e) =>
                        setT({
                          ...t,
                          flags: {
                            ...t.flags,
                            antiInflammatory: e.target.checked,
                          },
                        })
                      }
                    />
                    Anti-Inflammatory
                  </label>
                </div>
              )}
            </div>

            <div className="col-span-full flex gap-2">
              <Button
                onClick={saveTargets}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30"
              >
                Save Targets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TRAINER-ONLY: CARB DIRECTIVE */}
        {isTrainer && (
          <Card className="bg-white/5 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" /> Carb Directive
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  Starchy Cap (g/day)
                </label>
                <Input
                  inputMode="numeric"
                  className="bg-black/30 border-white/30 text-white"
                  value={t.carbDirective?.starchyCapG ?? ""}
                  onChange={(e) =>
                    setT({
                      ...t,
                      carbDirective: {
                        ...t.carbDirective,
                        starchyCapG: e.target.value
                          ? Number(e.target.value)
                          : null,
                      },
                    })
                  }
                  placeholder="e.g., 25"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  Fibrous Floor (g/day)
                </label>
                <Input
                  inputMode="numeric"
                  className="bg-black/30 border-white/30 text-white"
                  value={t.carbDirective?.fibrousFloorG ?? ""}
                  onChange={(e) =>
                    setT({
                      ...t,
                      carbDirective: {
                        ...t.carbDirective,
                        fibrousFloorG: e.target.value
                          ? Number(e.target.value)
                          : null,
                      },
                    })
                  }
                  placeholder="e.g., 300"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  Added Sugar Cap (g/day)
                </label>
                <Input
                  inputMode="numeric"
                  className="bg-black/30 border-white/30 text-white"
                  value={t.carbDirective?.addedSugarCapG ?? ""}
                  onChange={(e) =>
                    setT({
                      ...t,
                      carbDirective: {
                        ...t.carbDirective,
                        addedSugarCapG: e.target.value
                          ? Number(e.target.value)
                          : null,
                      },
                    })
                  }
                  placeholder="e.g., 25"
                />
              </div>
              <div className="col-span-full">
                <Button
                  onClick={saveTargets}
                  className="bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30"
                >
                  Save Carb Directive
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TRAINER-ONLY: COACHING NOTE */}
        {isTrainer && (
          <Card className="bg-white/5 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ClipboardList className="h-5 w-5" /> {roleLabel} Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                className="bg-black/30 border-white/30 text-white min-h-[100px]"
                placeholder="Training notes, progress tracking, observations..."
                value={ctx.coachNote || ""}
                onChange={(e) => setCtx({ ...ctx, coachNote: e.target.value })}
              />
              <Button
                onClick={saveContext}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30"
              >
                Save {roleLabel} Notes
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CLINICIAN-ONLY: CLINICAL CONTEXT */}
        {isClinician && (
          <Card className="bg-white/5 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Stethoscope className="h-5 w-5" /> Clinical Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  Diagnosis
                </label>
                <Input
                  className="bg-black/30 border-white/30 text-white"
                  placeholder="e.g., Type 2 Diabetes, Post-Bariatric"
                  value={ctx.diagnosis || ""}
                  onChange={(e) =>
                    setCtx({ ...ctx, diagnosis: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">
                  Clinical Tags
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      "GLP-1",
                      "Cardiac",
                      "Renal",
                      "Bariatric",
                      "Post-Op",
                      "Diabetes",
                      "General",
                    ] as const
                  ).map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 text-sm text-white/80"
                    >
                      <input
                        type="checkbox"
                        checked={ctx.clinicalTags?.includes(tag) || false}
                        onChange={() => toggleClinicalTag(tag)}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  {roleLabel} Notes
                </label>
                <Textarea
                  className="bg-black/30 border-white/30 text-white min-h-[100px]"
                  placeholder={`${roleLabel} notes, observations, treatment plan...`}
                  value={ctx.patientNote || ""}
                  onChange={(e) =>
                    setCtx({ ...ctx, patientNote: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={saveContext}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30"
              >
                Save {roleLabel} Notes & Context
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CLINICIAN-ONLY: FOLLOW-UP SCHEDULER */}
        {isClinician && (
          <Card className="bg-white/5 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Follow-Up Scheduler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-white/70 mb-2 block">
                  Schedule Follow-Up
                </label>
                <div className="flex gap-2">
                  <select
                    className="bg-black/30 border border-white/30 text-white rounded-md px-3 py-2 flex-1"
                    value={ctx.followupWeeks || ""}
                    onChange={(e) =>
                      setCtx({
                        ...ctx,
                        followupWeeks: e.target.value
                          ? (Number(e.target.value) as 4 | 8 | 12)
                          : undefined,
                      })
                    }
                  >
                    <option value="">Select timeframe</option>
                    <option value="4">4 weeks</option>
                    <option value="8">8 weeks</option>
                    <option value="12">12 weeks</option>
                  </select>
                  <Button
                    onClick={scheduleFollowUp}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Schedule
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  Upcoming Follow-Ups
                </label>
                <div className="space-y-2">
                  {proStore
                    .listFollowUps(clientId)
                    .filter((f) => !f.done)
                    .map((f) => (
                      <div
                        key={f.id}
                        className="bg-black/20 border border-white/20 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm text-white">
                            {new Date(f.dueAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-white/60">{f.note}</div>
                        </div>
                        <Button
                          onClick={() => {
                            proStore.markFollowUpDone(f.id);
                            toast({ title: "✅ Follow-up completed" });
                            setCtx({ ...ctx }); // trigger re-render
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1"
                        >
                          Done
                        </Button>
                      </div>
                    ))}
                  {proStore.listFollowUps(clientId).filter((f) => !f.done)
                    .length === 0 && (
                    <div className="text-sm text-white/50 italic">
                      No upcoming follow-ups
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PHYSICIANS SECTION */}
        <Card className="bg-white/5 border border-white/20">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-bold text-white mb-2">Physicians</h2>
            <Button
              onClick={() => {
                localStorage.setItem("pro-client-id", clientId);
                setLocation("/diabetic-hub");
              }}
              className="w-full sm:w-[400px] bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 hover:opacity-90 text-white font-semibold rounded-xl"
              data-testid="button-diabetic-hub"
            >
              🩸 Diabetic Hub
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("pro-client-id", clientId);
                setLocation("/glp1-hub");
              }}
              className="w-full sm:w-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 hover:opacity-90 text-white font-semibold rounded-xl"
              data-testid="button-glp1-hub"
            >
              💉 GLP-1 Hub
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("pro-client-id", clientId);
                setLocation("/medical-diets-hub");
              }}
              className="w-full sm:w-[400px] bg-gradient-to-br from-red-950 via-red-900 to-black hover:opacity-90 text-white font-semibold rounded-xl"
              data-testid="button-medical-diets-hub"
            >
              ❤️ Medical Diets Hub
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("pro-client-id", clientId);
                setLocation("/clinical-lifestyle-hub");
              }}
              className="w-full sm:w-[400px] bg-gradient-to-br from-sky-950 via-sky-900 to-black hover:opacity-90 text-white font-semibold rounded-xl"
              data-testid="button-clinical-lifestyle-hub"
            >
              🧬 Clinical Lifestyle Hub
            </Button>
          </CardContent>
        </Card>

        {/* TRAINERS SECTION */}
        <Card className="bg-white/5 border border-white/20">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-bold text-white mb-2">Trainers</h2>
            <Button
              onClick={() =>
                setLocation(`/pro/clients/${clientId}/athlete-board`)
              }
              className="w-full sm:w-[400px] bg-gradient-to-br from-indigo-950 via-purple-900 to-black hover:opacity-90 text-white font-semibold rounded-xl"
              data-testid="button-athlete-board"
            >
              <Trophy className="h-4 w-4 mr-2" /> Competition + Beachbody Meal
              Board
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
