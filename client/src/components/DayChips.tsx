import { getDayName, formatDateShort } from "@/utils/week";
import { Button } from "@/components/ui/button";

interface DayChipsProps {
  weekDates: string[];
  activeDayISO: string;
  onDayChange: (dateISO: string) => void;
}

export function DayChips({ weekDates, activeDayISO, onDayChange }: DayChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {weekDates.map((dateISO) => {
        const isActive = dateISO === activeDayISO;
        const dayName = getDayName(dateISO);
        const dateShort = formatDateShort(dateISO);
        
        return (
          <Button
            key={dateISO}
            variant="ghost"
            size="sm"
            onClick={() => onDayChange(dateISO)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-lg transition-all min-w-[100px] sm:min-w-[110px] ${
              isActive
                ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg border border-blue-400/50'
                : 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60 border border-white/10'
            }`}
          >
            <span className="text-xs font-medium leading-tight">{dayName}</span>
            <span className="text-sm font-medium text-white mt-1 leading-tight">{dateShort}</span>
          </Button>
        );
      })}
    </div>
  );
}