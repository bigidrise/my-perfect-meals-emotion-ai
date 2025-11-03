import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ChevronDown, ChevronUp, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type SiteType = "abdomen" | "thigh" | "upper_arm" | "buttock";

export default function GLP1Hub() {
  const [, setLocation] = useLocation();
  const [shotDate, setShotDate] = useState<string>("");
  const [dosage, setDosage] = useState<string>("0.5");
  const [currentSite, setCurrentSite] = useState<SiteType | "">("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string>("");
  const [data, setData] = useState<{ date: string; shot: number }[]>([]);
  const [view, setView] = useState<"daily" | "7day" | "30day">("7day");
  const [siteHistory, setSiteHistory] = useState<SiteType[]>([]);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    document.title = "GLP-1 Hub | My Perfect Meals";
    const saved = localStorage.getItem("glp1-site-history");
    if (saved) {
      setSiteHistory(JSON.parse(saved));
    }
  }, []);

  const logShot = async () => {
    const dateVal = shotDate || new Date().toISOString().slice(0, 10);
    setSaving(true);
    try {
      setData((prev) => [...prev, { date: dateVal, shot: 1 }]);

      if (currentSite) {
        const newHistory = [currentSite, ...siteHistory].slice(0, 4);
        setSiteHistory(newHistory);
        localStorage.setItem("glp1-site-history", JSON.stringify(newHistory));
      }

      setSavedMsg("Shot logged successfully!");
      setShotDate("");
      setCurrentSite("");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch {
      alert("Could not save right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(() => {
    const now = new Date();
    let days = 1;
    if (view === "7day") days = 7;
    if (view === "30day") days = 30;
    const arr: { date: string; shot: number | null }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const found = data.filter((x) => x.date === ds).length;
      arr.push({ date: ds.slice(5), shot: found > 0 ? found : null });
    }
    return arr;
  }, [data, view]);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Back (uses hub path) */}
      <button
        type="button"
        onClick={() => {
          const clientId = localStorage.getItem("pro-client-id");
          if (clientId) {
            setLocation(`/pro/clients/${clientId}/dashboard`);
          } else {
            setLocation("/dashboard");
          }
        }}
        aria-label="Back to Client Dashboard"
        className="fixed top-4 left-4 z-[9999] bg-black/10 border border-white/20 text-white hover:bg-black/20 rounded-2xl px-3 py-2 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium"></span>
      </button>

      {/* Premium Feature Banner */}
      <div className="fixed top-4 right-4 z-[9999] bg-purple-600/90 backdrop-blur-lg border border-purple-400/50 rounded-xl px-4 py-2 text-white shadow-2xl">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span className="font-semibold text-sm">Premium • $19.99/mo</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 mt-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-cyan-300 to-black rounded-2xl shadow-2xl shadow-black/80 p-5 text-white relative overflow-hidden">
          <h1 className="text-2xl font-extrabold">GLP-1 Hub</h1>
          <p className="opacity-95">Track your GLP-1 medication - simple, reliable, and always with you.</p>
        </div>

        {/* Important Medical Note Dropdown */}
        <section className="bg-black/40 backdrop-blur-lg border border-purple-300/30 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => setNoteOpen(!noteOpen)}
            className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
          >
            <span className="font-semibold">
              <span className="text-emerald-400">Important:</span>{" "}
              <span className="text-white">How This App Supports Your Care</span>
            </span>
            {noteOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {noteOpen && (
            <div className="px-4 pb-4">
              <p className="text-sm leading-relaxed text-white/90">
                <span className="font-semibold text-emerald-400">Important:</span> My Perfect Meals is designed to work{" "}
                <span className="font-semibold text-white">with</span> your doctor, dietitian, or healthcare provider — never
                instead of them. Use the information and tools here to stay consistent between visits, to understand your
                body, and to make small, confident choices that honor your professional guidance. Every tracker, every meal,
                and every suggestion in this app is meant to <span className="italic">support</span> your care plan, not
                replace it.
              </p>
            </div>
          )}
        </section>

        {/* Shot Tracker - Log Shots */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-4 backdrop-blur">
          <h2 className="text-white font-bold mb-2">Log GLP-1 Shot</h2>
          <p className="text-white/80 text-sm mb-3">Track your medication - date, dosage, and location.</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={shotDate}
              onChange={(e) => setShotDate(e.target.value)}
              className="rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm"
              placeholder="Date"
            />
            <select
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm"
            >
              <option value="0.25">0.25mg</option>
              <option value="0.5">0.5mg</option>
              <option value="1">1mg</option>
              <option value="1.7">1.7mg</option>
              <option value="2">2mg</option>
              <option value="2.4">2.4mg</option>
            </select>
            <select
              value={currentSite}
              onChange={(e) => setCurrentSite(e.target.value as SiteType)}
              className="rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm"
            >
              <option value="">Site...</option>
              <option value="abdomen">Abdomen</option>
              <option value="thigh">Thigh</option>
              <option value="upper_arm">Upper Arm</option>
              <option value="buttock">Buttock</option>
            </select>
            <Button
              onClick={logShot}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2"
              data-testid="button-log-shot"
            >
              {saving ? "Saving…" : "Log Shot"}
            </Button>
            {savedMsg && <span className="text-purple-300 text-sm">{savedMsg}</span>}
          </div>
        </section>

        {/* Shot History Graph */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-5 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold">Shot History</h2>
            <div className="flex gap-2">
              {["daily", "7day", "30day"].map((v) => (
                <Button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={`rounded-xl px-3 py-1 text-sm ${
                    view === v
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {v === "daily" ? "Daily" : v === "7day" ? "7-Day" : "30-Day"}
                </Button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(192,132,252,0.3)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="shot"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#a855f7" }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* 4-Site Rotation Tracker */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-4 backdrop-blur">
          <h2 className="text-white font-bold mb-2">Last 4 Injection Sites</h2>
          <p className="text-white/80 text-sm mb-3">Track your rotation to avoid using the same site.</p>
          <div className="grid grid-cols-4 gap-2">
            {siteHistory.length === 0 ? (
              <div className="col-span-4 text-white/50 text-center py-4 text-sm">
                No sites logged yet. Log a shot above to start tracking.
              </div>
            ) : (
              <>
                {siteHistory.map((site, index) => {
                  const siteColors = {
                    abdomen: "bg-purple-600/80 border-purple-400",
                    thigh: "bg-blue-600/80 border-blue-400",
                    upper_arm: "bg-green-600/80 border-green-400",
                    buttock: "bg-orange-600/80 border-orange-400",
                  };
                  const siteLabels = {
                    abdomen: "Abdomen",
                    thigh: "Thigh",
                    upper_arm: "Upper Arm",
                    buttock: "Buttock",
                  };
                  return (
                    <div
                      key={index}
                      className={`${siteColors[site]} border-2 rounded-xl p-3 text-center`}
                    >
                      <div className="text-white font-bold text-sm">{siteLabels[site]}</div>
                      <div className="text-white/80 text-xs mt-1">
                        {index === 0 ? "Most Recent" : `#${index + 1}`}
                      </div>
                    </div>
                  );
                })}
                {[...Array(4 - siteHistory.length)].map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="bg-white/5 border-2 border-white/20 rounded-xl p-3 text-center"
                  >
                    <div className="text-white/40 text-sm">Not Used</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* CTA → Meals */}
        <section className="bg-gradient-to-r from-black via-purple-300 to-black rounded-xl p-4 shadow-xl">
          <h3 className="text-white font-bold text-lg mb-1">Find Meals for GLP-1 Users</h3>
          <p className="text-white/90 text-sm mb-3">Small portions • Calorie-dense • Mixed cuisines.</p>
          <Button
            onClick={() => setLocation("/glp1-meal-builder")}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl"
            data-testid="button-go-to-glp1-meals"
          >
            Go to GLP-1 Meal Builder
          </Button>
        </section>
      </div>

      {/* Floating */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setLocation("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-3 shadow-lg"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
