import { useLocation } from "wouter";
import { ArrowLeft, Award } from "lucide-react";

type Founder = {
  id: string;
  name: string;
  img: string;
  badge?: string;
};

const FOUNDERS: Founder[] = [
  { id: "1", name: "Coach Idrise", img: "/assets/founder-photo.png", badge: "Gold Founder" },
  { id: "2", name: "A. Believer", img: "/assets/MPMTransparentLogo.png" },
  { id: "3", name: "B. Believer", img: "/assets/MPMTransparentLogo.png", badge: "Top Supporter" },
  { id: "4", name: "C. Believer", img: "/assets/MPMTransparentLogo.png" },
];

export default function FoundersPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pt-20 pb-12">
      <button
        aria-label="Go back to dashboard"
        onClick={() => setLocation("/dashboard")}
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-4 h-10 rounded-2xl bg-black/10 hover:bg-black/20 ring-1 ring-white/10 backdrop-blur-none transition"
        data-testid="button-back"
      >
        <ArrowLeft className="h-5 w-5 stroke-[2.5] text-white" />
        <span className="text-white font-medium">Dashboard</span>
      </button> 
      
      <section className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 p-6 rounded-2xl bg-black/50 ring-1 ring-white/10 backdrop-blur-md shadow-2xl text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
            Meet Our Founders
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-2">
            The early believers who helped build My Perfect Meals.
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {FOUNDERS.map((f) => (
            <article
              key={f.id}
              className="relative overflow-hidden rounded-2xl bg-black/55 ring-1 ring-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              data-testid={`card-founder-${f.id}`}
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={f.img}
                  alt={f.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-4 flex items-center justify-between gap-3">
                <h3 className="text-white font-medium truncate">{f.name}</h3>

                {f.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 ring-1 ring-yellow-300/30 px-2.5 py-1 text-[11px] text-yellow-100">
                    <Award className="h-3.5 w-3.5" />
                    {f.badge}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="h-6" />
      </section>
    </div>
  );
}
