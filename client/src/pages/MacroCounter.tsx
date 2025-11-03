// client/src/pages/MacroCounter.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, User2, Info, Ruler, Scale, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setMacroTargets } from "@/lib/dailyLimits";
import ReadOnlyNote from "@/components/ReadOnlyNote";

type Goal = "loss" | "maint" | "gain";
type Sex = "male" | "female";
type Units = "imperial" | "metric";
type BodyType = "ecto" | "meso" | "endo";

const toNum = (v: string | number) => {
  const n = typeof v === "string" ? v.trim() : v;
  const out = Number(n || 0);
  return Number.isFinite(out) ? out : 0;
};

const kgFromLbs = (lbs: number) => lbs * 0.45359237;
const cmFromFeetInches = (ft: number, inch: number) => ft * 30.48 + inch * 2.54;

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

function mifflin({ sex, kg, cm, age }: { sex: Sex; kg: number; cm: number; age: number }) {
  const b = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
  return Math.max(800, Math.round(b));
}

function goalAdjust(tdee: number, goal: Goal) {
  if (goal === "loss") return Math.round(tdee * 0.85);
  if (goal === "gain") return Math.round(tdee * 1.1);
  return Math.round(tdee);
}

function calcMacrosBase({ calories, kg, proteinPerKg, fatPct, sex }: any) {
  const pG = Math.round(kg * proteinPerKg);
  const pK = pG * 4;
  const fK = Math.round(calories * fatPct);
  const fG = Math.round(fK / 9);
  const cK = Math.max(0, calories - pK - fK);
  const cG = Math.round(cK / 4);
  return { calories, protein: { g: pG, kcal: pK }, fat: { g: fG, kcal: fK }, carbs: { g: cG, kcal: cK } };
}

function applyBodyTypeTilt(base: any, bodyType: BodyType) {
  let tilt = 0;
  if (bodyType === "ecto") tilt = +0.14;
  if (bodyType === "endo") tilt = -0.18;
  if (tilt === 0) return base;
  const shiftKcal = Math.round(base.calories * Math.abs(tilt));
  if (tilt > 0) {
    const nextFatK = Math.max(0, base.fat.kcal - shiftKcal);
    const nextCarbK = base.carbs.kcal + shiftKcal;
    return { ...base, fat: { kcal: nextFatK, g: Math.round(nextFatK / 9) }, carbs: { kcal: nextCarbK, g: Math.round(nextCarbK / 4) } };
  } else {
    const nextCarbK = Math.max(0, base.carbs.kcal - shiftKcal);
    const nextFatK = base.fat.kcal + shiftKcal;
    return { ...base, fat: { kcal: nextFatK, g: Math.round(nextFatK / 9) }, carbs: { kcal: nextCarbK, g: Math.round(nextCarbK / 4) } };
  }
}

function BodyTypeGuide() {
  return (
    <div className="mb-3">
      <details className="rounded-xl border border-white/15 bg-white/5 p-3">
        <summary className="cursor-pointer select-none text-sm font-semibold text-white/90">
          Body Type Guide (tap to expand)
        </summary>

        <div className="mt-2 space-y-3 text-sm text-white/80">
          <div>
            <div className="font-semibold text-white">Ectomorph</div>
            <p className="mt-1 leading-relaxed">
              Naturally lean or "hard gainer." Smaller frame, narrower shoulders/hips, and tends to
              struggle gaining weight or muscle. Often a faster metabolism.{" "}
              <span className="text-white/90">Strategy:</span> a bit more calories and carbs; keep protein steady.
            </p>
          </div>

          <div>
            <div className="font-semibold text-white">Mesomorph</div>
            <p className="mt-1 leading-relaxed">
              Athletic middle build—can gain muscle and lose fat more easily. Medium frame and usually
              responds well to training and nutrition changes.{" "}
              <span className="text-white/90">Strategy:</span> balanced calories and macros; adjust up/down with goals.
            </p>
          </div>

          <div>
            <div className="font-semibold text-white">Endomorph</div>
            <p className="mt-1 leading-relaxed">
              Bigger frame ("full house") that gains weight more easily and may lose it more slowly.
              Often benefits from tighter calorie control and mindful carbs.{" "}
              <span className="text-white/90">Strategy:</span> slightly fewer starchy carbs, a bit more fat for satiety.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-2">
            <div className="text-white/90 font-medium text-[13px]">How to choose quickly</div>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>If you've always been naturally thin and struggle to gain → <b>Ectomorph</b></li>
              <li>If you build/lean fairly easily with training → <b>Mesomorph</b></li>
              <li>If you gain easily and fat loss feels slower → <b>Endomorph</b></li>
            </ul>
            <p className="mt-2 text-[12px] text-white/60">
              Not exact? Pick the one that best matches your history and how your body responds. This just sets a smart starting split.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}

export default function MacroCounter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [goal, setGoal] = useState<Goal>("maint");
  const [bodyType, setBodyType] = useState<BodyType>("meso");
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState<number>(30);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(7);
  const [weightLbs, setWeightLbs] = useState<number>(160);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(72.5);
  const [activity, setActivity] = useState<keyof typeof ACTIVITY_FACTORS>("light");
  const [proteinPerKg, setProteinPerKg] = useState<number>(1.8);
  const [fatPct, setFatPct] = useState<number>(0.3);

  const kg = units === "imperial" ? kgFromLbs(weightLbs) : weightKg;
  const cm = units === "imperial" ? cmFromFeetInches(heightFt, heightIn) : heightCm;

  const results = useMemo(() => {
    const bmr = mifflin({ sex, kg, cm, age });
    const tdee = Math.round(bmr * ACTIVITY_FACTORS[activity]);
    const target = goalAdjust(tdee, goal);
    const base = calcMacrosBase({ calories: target, kg, sex, proteinPerKg, fatPct });
    const macros = applyBodyTypeTilt(base, bodyType);
    return { bmr, tdee, target, macros };
  }, [sex, kg, cm, age, activity, goal, proteinPerKg, fatPct, bodyType]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 text-white px-4 pt-8 pb-32"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Macro Calculator</h1>
        <p className="text-center text-white/80">
          Understand what macros you need for <b>cut</b>, <b>maintenance</b>, or <b>gain</b>.
        </p>

        {/* Goal & Body Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-zinc-900/80 border border-white/30 text-white">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-emerald-300" /> Your Goal
              </h3>
              <RadioGroup value={goal} onValueChange={(v: Goal) => setGoal(v)} className="mt-3 grid grid-cols-3 gap-3">
                {[
                  { v: "loss", label: "Cut" },
                  { v: "maint", label: "Maintain" },
                  { v: "gain", label: "Gain" },
                ].map((g) => (
                  <Label key={g.v} htmlFor={g.v} className={`px-3 py-2 border rounded-lg cursor-pointer text-center ${goal === g.v ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}`}>
                    <RadioGroupItem id={g.v} value={g.v} className="sr-only" />
                    {g.label}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 border border-white/30 text-white">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold flex items-center">
                <User2 className="h-5 w-5 mr-2 text-pink-300" /> Body Type
              </h3>
              <BodyTypeGuide />
              <RadioGroup value={bodyType} onValueChange={(v: BodyType) => setBodyType(v)} className="mt-3 grid grid-cols-3 gap-3">
                {[
                  { v: "ecto", label: "Ecto" },
                  { v: "meso", label: "Meso" },
                  { v: "endo", label: "Endo" },
                ].map((b) => (
                  <Label key={b.v} htmlFor={b.v} className={`px-3 py-2 border rounded-lg cursor-pointer text-center ${bodyType === b.v ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}`}>
                    <RadioGroupItem id={b.v} value={b.v} className="sr-only" />
                    {b.label}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Inputs */}
        <Card className="bg-zinc-900/80 border border-white/30 text-white">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Ruler className="h-5 w-5 mr-2" /> Your Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold">Units</div>
                  <RadioGroup value={units} onValueChange={(v: Units) => setUnits(v)} className="grid grid-cols-2 gap-2">
                    {["imperial", "metric"].map((u) => (
                      <Label key={u} htmlFor={u} className={`px-3 py-2 border rounded-lg text-sm cursor-pointer ${units === u ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}`}>
                        <RadioGroupItem id={u} value={u} className="sr-only" />
                        {u === "imperial" ? "US" : "Metric"}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <div className="text-xs font-semibold">Sex</div>
                  <RadioGroup value={sex} onValueChange={(v: Sex) => setSex(v)} className="grid grid-cols-2 gap-2">
                    {["female", "male"].map((s) => (
                      <Label key={s} htmlFor={s} className={`px-3 py-2 border rounded-lg text-sm cursor-pointer ${sex === s ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}`}>
                        <RadioGroupItem id={s} value={s} className="sr-only" />
                        {s}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs font-semibold">Age</div>
                    <Input type="number" className="bg-black/60 border-white/50 text-white" value={age} onChange={(e) => setAge(toNum(e.target.value))} />
                  </div>
                  {units === "imperial" ? (
                    <>
                      <div>
                        <div className="text-xs font-semibold">Height (ft)</div>
                        <Input type="number" className="bg-black/60 border-white/50 text-white" value={heightFt} onChange={(e) => setHeightFt(toNum(e.target.value))} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Height (in)</div>
                        <Input type="number" className="bg-black/60 border-white/50 text-white" value={heightIn} onChange={(e) => setHeightIn(toNum(e.target.value))} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2">
                        <div className="text-xs font-semibold">Height (cm)</div>
                        <Input type="number" className="bg-black/60 border-white/50 text-white" value={heightCm} onChange={(e) => setHeightCm(toNum(e.target.value))} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Weight (kg)</div>
                        <Input type="number" className="bg-black/60 border-white/50 text-white" value={weightKg} onChange={(e) => setWeightKg(toNum(e.target.value))} />
                      </div>
                    </>
                  )}
                </div>

                <ReadOnlyNote>
                  <strong>Finish setup first:</strong> Changing your weight recalculates your targets. Complete all settings, then click <strong>Set Macro Targets</strong>.
                </ReadOnlyNote>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold">Activity</div>
                  <RadioGroup value={activity} onValueChange={(v: keyof typeof ACTIVITY_FACTORS) => setActivity(v)} className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.keys(ACTIVITY_FACTORS).map((k) => (
                      <Label key={k} htmlFor={k} className={`px-3 py-2 border rounded-lg text-sm cursor-pointer ${activity === k ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}`}>
                        <RadioGroupItem id={k} value={k} className="sr-only" />
                        {k}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold">Protein (g/kg)</div>
                    <Input type="number" step="0.1" className="bg-black/60 border-white/50 text-white" value={proteinPerKg} onChange={(e) => setProteinPerKg(parseFloat(e.target.value || "0"))} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Fat share (% kcal)</div>
                    <Input type="number" step="1" className="bg-black/60 border-white/50 text-white" value={Math.round(fatPct * 100)} onChange={(e) => setFatPct(toNum(e.target.value) / 100)} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-zinc-900/80 border border-white/30 text-white">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Scale className="h-5 w-5 mr-2 text-indigo-300" /> Your Baseline
            </h3>
            <div className="grid md:grid-cols-4 gap-3">
              <Stat label="BMR" value={results.bmr} suffix="kcal" />
              <Stat label="TDEE" value={results.tdee} suffix="kcal" />
              <Stat label="Target kcal" value={results.target} suffix="kcal" />
              <Stat label="Protein / Carbs / Fat" value={results.macros.protein.g} sub={`${results.macros.carbs.g}g C / ${results.macros.fat.g}g F`} />
            </div>
          </CardContent>
        </Card>

        {/* Save Targets */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setMacroTargets({
                calories: results.target,
                protein_g: results.macros.protein.g,
                carbs_g: results.macros.carbs.g,
                fat_g: results.macros.fat.g,
              });
              toast({ title: "Macro Targets Set!", description: "Your targets have been saved." });
              setLocation("/my-biometrics");
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 text-lg py-3 shadow-2xl hover:shadow-red-500/50 transition-all duration-200 animate-pulse"
          >
            <Target className="h-5 w-5 mr-2" /> Set Macro Targets
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, suffix, sub }: { label: string; value: number; suffix?: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/30 bg-black/70 p-3 text-white">
      <div className="text-[11px] uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-sm font-semibold">{Math.round(value)} {suffix || ""}</div>
      {sub && <div className="text-xs">{sub}</div>}
    </div>
  );
}
