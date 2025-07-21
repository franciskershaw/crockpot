import { Card, CardContent } from "@/components/ui/card";

interface NotesSectionProps {
  notes: string[];
  isMobile?: boolean;
}

export function NotesSection({ notes, isMobile = false }: NotesSectionProps) {
  if (notes.length === 0) return null;

  const titleText = isMobile ? "text-lg sm:text-xl" : "text-xl";
  const noteSpacing = isMobile ? "space-y-2 sm:space-y-3" : "space-y-3";
  const noteGap = isMobile ? "gap-2 sm:gap-3" : "gap-3";
  const noteText = isMobile ? "text-sm sm:text-base" : "";
  const bulletSize = isMobile ? "w-1 h-1" : "w-1.5 h-1.5";
  const padding = isMobile ? "p-4 sm:p-6" : "p-6";

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className={padding}>
        <h3 className={`${titleText} font-bold text-amber-900 mb-4`}>
          Chef&apos;s Notes
        </h3>
        <div className={noteSpacing}>
          {notes.map((note, index) => (
            <div key={index} className={`flex ${noteGap}`}>
              <div
                className={`flex-shrink-0 ${bulletSize} bg-amber-500 rounded-full mt-2`}
              />
              <p className={`text-amber-800 leading-relaxed ${noteText}`}>
                {note}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
