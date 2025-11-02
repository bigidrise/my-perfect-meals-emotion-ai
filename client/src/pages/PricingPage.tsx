import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import AffiliateOnPricing from "@/components/AffiliateOnPricing";
import { PLAN_SKUS, getPlansByGroup } from "@/data/planSkus";
import { startCheckout } from "@/lib/checkout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function PricingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [headerOpen, setHeaderOpen] = useState(true);

  const consumerPlans = getPlansByGroup("consumer");
  const familyPlans = getPlansByGroup("family");

  const handleBackNavigation = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      setLocation("/welcome");
    }
  };

  const handleSelectPlan = async (sku: string) => {
    try {
      await startCheckout(sku as any, { context: "pricing_page" });
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getButtonText = (sku: string): string => {
    const currentPlan = user?.planLookupKey;
    
    if (currentPlan === sku) {
      return "Current Plan";
    }
    
    if (!currentPlan) {
      return "Select Plan";
    }
    
    // Define tier hierarchy for consumer plans
    const consumerTiers: Record<string, number> = {
      "mpm_basic_monthly": 1,
      "mpm_upgrade_monthly": 2,
      "mpm_upgrade_beta_monthly": 2, // Same tier as upgrade
      "mpm_ultimate_monthly": 3,
      "mpm_procare_monthly": 4,
    };
    
    // Define tier hierarchy for family plans
    const familyTiers: Record<string, number> = {
      "mpm_family_base_monthly": 1,
      "mpm_family_all_upgrade_monthly": 2,
      "mpm_family_all_ultimate_monthly": 3,
    };
    
    const currentTier = consumerTiers[currentPlan] || familyTiers[currentPlan];
    const targetTier = consumerTiers[sku] || familyTiers[sku];
    
    // Different plan types (consumer vs family) can't be compared
    const isConsumerPlan = (plan: string) => plan in consumerTiers;
    const isFamilyPlan = (plan: string) => plan in familyTiers;
    
    if (isConsumerPlan(currentPlan) && isFamilyPlan(sku)) {
      return "Switch to Family";
    }
    
    if (isFamilyPlan(currentPlan) && isConsumerPlan(sku)) {
      return "Switch to Individual";
    }
    
    // Same plan type comparison
    if (currentTier !== undefined && targetTier !== undefined) {
      if (targetTier > currentTier) {
        return "Upgrade";
      } else if (targetTier < currentTier) {
        return "Downgrade";
      }
    }
    
    return "Select Plan";
  };

  const legacyFeatures = {
    basic: [
      "Weekly Meal Board",
      "Daily Macro Calculator",
      "Smart Menu Builder",
      "Adult Beverage Hub",
      "Supplement Hub",
      "Biometrics",
      "Daily Health Journal",
      "Game Hub",
    ],
    upgrade: [
      "Everything in Basic",
      "GLP-1 Hub",
      "Diabetic Hub",
      "Craving Creator",
      "Restaurant Guide",
      "Fridge Rescue",
      "Potluck Planner",
      "Holiday Feast",
      "Kids Meals Hub",
      "Cultural Cuisine Hub",
      "Learn to Cook",
      "Clinical Lifestyle Hub",
      "Clinical Recovery & Protocols Hub",
      "Fast Food Hub",
    ],
    ultimate: [
      "Everything in Premium",
      "Camping Hub",
      "Tailgating Hub",
      "Lab Values",
      "Medical Diet Hub",
      "Food Delivery (coming soon)",
      "Elite Athlete Mode (coming soon)",
      "Care Team / Pro Access",
    ],
  };

  return (
    <div className="relative min-h-screen py-6 md:py-12 bg-gradient-to-br from-neutral-900 via-black to-black text-white">
      {/* Back Arrow - Top Left */}
      <button
        onClick={handleBackNavigation}
        className="fixed top-4 left-4 z-50 flex items-center justify-center 
                   bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 
                   shadow-lg hover:bg-black/70 transition-all duration-200"
        data-testid="button-back-navigation"
      >
        <ArrowLeft className="h-4 w-4 text-white" /> Dashboard
      </button>
      
      <div className="container max-w-6xl mx-auto px-4">
        {/* Collapsible Header (Black Glass) */}
        <div className="text-center mb-12 mt-12">
          <div 
            onClick={() => setHeaderOpen(!headerOpen)}
            className="inline-block rounded-2xl px-6 py-4 bg-black/30 backdrop-blur-lg border border-white/15 shadow-xl cursor-pointer hover:bg-black/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Simple plans. Powerful results.</h1>
                <p className="text-base md:text-lg text-white/90">Pick the plan that fits today. Upgrade anytime.</p>
              </div>
              <div className="flex-shrink-0">
                {headerOpen ? (
                  <ChevronUp className="h-6 w-6 text-white" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {headerOpen && (
            <motion.div
              key="pricing-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div>

        {/* Consumer Plans Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Individual Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consumerPlans.map((plan) => {
              const features = plan.sku === "mpm_basic_monthly" 
                ? legacyFeatures.basic 
                : plan.sku === "mpm_upgrade_monthly"
                ? legacyFeatures.upgrade
                : legacyFeatures.ultimate;

              return (
                <Card
                  key={plan.sku}
                  className={`relative h-full bg-black/30 backdrop-blur-lg border border-white/15 text-white shadow-xl ${
                    plan.badge ? "ring-1 ring-purple-400/30" : ""
                  }`}
                  data-testid={`plan-card-${plan.sku}`}
                >
                  {plan.badge && (
                    <Badge className="absolute top-3 right-3 bg-purple-600/80 text-white backdrop-blur-sm border border-white/10">
                      {plan.badge}
                    </Badge>
                  )}

                  <CardHeader className="pb-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{plan.label}</h3>
                      <p className="text-sm text-white/80">{plan.blurb}</p>
                      <p className="text-xl font-semibold">${plan.price.toFixed(2)} / month</p>
                    </div>
                  </CardHeader>

                  <Separator className="bg-white/10" />

                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {features.map((label, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white">{label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <Separator className="bg-white/10" />

                  <div className="p-6">
                    <Button
                      className={`w-full ${
                        plan.badge
                          ? "bg-white/10 hover:bg-white/15 border border-white/20 text-white"
                          : "bg-white/5 hover:bg-white/10 border border-white/20 text-white"
                      }`}
                      size="lg"
                      onClick={() => handleSelectPlan(plan.sku)}
                      disabled={true}
                      data-testid={`button-select-${plan.sku}`}
                    >
                      {getButtonText(plan.sku)}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Family Plans Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Family Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {familyPlans.map((plan) => (
              <Card
                key={plan.sku}
                className="relative h-full bg-black/30 backdrop-blur-lg border border-white/15 text-white shadow-xl"
                data-testid={`plan-card-${plan.sku}`}
              >
                {plan.badge && (
                  <Badge className="absolute top-3 right-3 bg-blue-600/80 text-white backdrop-blur-sm border border-white/10">
                    {plan.badge}
                  </Badge>
                )}

                <CardHeader className="pb-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{plan.label}</h3>
                    <p className="text-sm text-white/80">{plan.blurb}</p>
                    <p className="text-xl font-semibold">${plan.price.toFixed(2)} / month</p>
                    {plan.seats && (
                      <p className="text-xs text-white/60">Includes up to {plan.seats} profiles</p>
                    )}
                  </div>
                </CardHeader>

                <Separator className="bg-white/10" />

                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {plan.features?.map((label, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white">{label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <Separator className="bg-white/10" />

                <div className="p-6">
                  <Button
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white"
                    size="lg"
                    onClick={() => handleSelectPlan(plan.sku)}
                    disabled={true}
                    data-testid={`button-select-${plan.sku}`}
                  >
                    {getButtonText(plan.sku)}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Affiliate Panel */}
        <div className="mb-12">
          <AffiliateOnPricing />
        </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
