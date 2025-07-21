import { Card, CardContent } from "@/components/ui/card";

interface InstructionsSectionProps {
  instructions: string[];
  isMobile?: boolean;
}

export function InstructionsSection({
  instructions,
  isMobile = false,
}: InstructionsSectionProps) {
  const stepNumberSize = isMobile ? "w-7 h-7 sm:w-8 sm:h-8" : "w-10 h-10";
  const stepNumberText = isMobile ? "text-sm" : "text-lg";
  const instructionGap = isMobile ? "gap-3 sm:gap-4" : "gap-4";
  const instructionSpacing = isMobile ? "space-y-4 sm:space-y-6" : "space-y-6";
  const instructionText = isMobile ? "text-sm sm:text-base" : "text-lg";
  const instructionPadding = isMobile ? "pt-0.5" : "pt-1";

  return (
    <Card>
      <CardContent className={isMobile ? "p-4 sm:p-6" : "p-6"}>
        <h2
          className={`font-bold text-gray-900 mb-6 ${
            isMobile ? "text-xl sm:text-2xl" : "text-2xl"
          }`}
        >
          Instructions
        </h2>

        <div className={instructionSpacing}>
          {instructions.map((instruction, index) => (
            <div key={index} className={`flex ${instructionGap}`}>
              <div className="flex-shrink-0">
                <div
                  className={`${stepNumberSize} bg-blue-500 text-white rounded-full flex items-center justify-center font-bold ${stepNumberText} shadow-lg`}
                >
                  {index + 1}
                </div>
              </div>
              <div className={`flex-1 ${instructionPadding}`}>
                <p
                  className={`text-gray-700 leading-relaxed ${instructionText}`}
                >
                  {instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
