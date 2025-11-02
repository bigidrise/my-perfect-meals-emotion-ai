import { useState, useRef, useEffect } from 'react';
import { HeartPulse, X } from 'lucide-react';

interface MedicalBadge {
  id: string;
  label: string;
  description: string;
}

interface MedicalInfoBubbleProps {
  badges: MedicalBadge[];
  description?: string;
}

export default function MedicalInfoBubble({ badges, description }: MedicalInfoBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // If no badges, don't render anything
  if (!badges || badges.length === 0) return null;

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Auto-generate description if not provided
  const autoDescription = description || 
    "This recipe supports your health goals and dietary needs.";

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Info Icon Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="group flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 hover:border-purple-400/50 transition-all duration-200"
        aria-label="View health and medical tags"
        data-testid="button-medical-info"
      >
        <HeartPulse className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
      </button>

      {/* Popover */}
      {isOpen && (
        <div 
          className="absolute z-50 right-0 top-9 w-72 bg-black/70 text-white rounded-2xl shadow-2xl backdrop-blur-lg border border-white/15 p-4 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
          data-testid="popover-medical-info"
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" />
              Health & Medical Tags
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white/90 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-white/70 mb-3 leading-relaxed">
            {autoDescription}
          </p>

          {/* Badge List */}
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge.id}
                className="px-3 py-1.5 text-xs rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                title={badge.description || badge.label}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
