import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLocation } from "wouter";
import { Brain, Sparkles, ArrowLeft, Home } from "lucide-react";

export default function CravingHub() {
  const [, setLocation] = useLocation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4 sm:p-6"
    >
      <Button
        variant="ghost"
        onClick={() => setLocation("/dashboard")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-white bg-black/10 backdrop-blur-none border border-white/20 hover:bg-black/30 transition-all duration-200 rounded-2xl"
        data-testid="button-back-dashboard"
      >
        <Home className="w-4 h-4" />
      </Button>

      <div className="max-w-5xl mx-auto pt-20">
        <div className="text-center mb-8">
          <div className="inline-block rounded-2xl px-6 py-5 bg-black/30 border border-white/20 backdrop-blur-sm shadow-xl">
            <h1 className="text-2xl sm:text-2xl font-extrabold text-white mb-1">
              Craving Creator Hub
            </h1>
            <p className="text-sm sm:text-base text-white/80">
              Pick your path: craft a custom craving or choose a healthy preset
              with serving scaling.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" /> Create Your Own
              </CardTitle>
              <CardDescription className="text-white/70 text-sm">
                Use the original AI Craving Creator you already know. No
                changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation("/craving-creator")}
                className="bg-white text-black w-full hover:bg-white/90 transition-colors"
                data-testid="button-craving-creator"
              >
                Open Craving Creator
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" /> Healthy Premade Cravings
              </CardTitle>
              <CardDescription className="text-white/70 text-sm">
                20 smarter recipes that satisfy the feeling you're chasing —
                with servings 1–10.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation("/craving-presets")}
                className="bg-white text-black w-full hover:bg-white/90 transition-colors"
                data-testid="button-craving-presets"
              >
                Browse Presets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
