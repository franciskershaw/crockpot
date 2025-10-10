"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Users } from "lucide-react";

interface ServesControlProps {
  serves: number;
  onAdjustServes: (delta: number) => void;
  canAdjust: boolean;
}

export function ServesControl({
  serves,
  onAdjustServes,
  canAdjust,
}: ServesControlProps) {
  if (!canAdjust) return null;

  return (
    <div className="flex items-center justify-between mt-2 md:mt-4 lg:justify-start lg:gap-3 py-3 px-4 lg:py-0 lg:px-0 lg:mb-4 bg-gray-50 lg:bg-transparent rounded-lg lg:rounded-none border lg:border-none border-gray-200">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-gray-700 lg:text-gray-600">
          Serves
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustServes(-1)}
          disabled={serves <= 1}
          className="h-7 w-7 p-0"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="font-semibold text-base min-w-[1.5rem] text-center">
          {serves}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustServes(1)}
          disabled={serves >= 20}
          className="h-7 w-7 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
