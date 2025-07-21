import { Card, CardContent } from "@/components/ui/card";

export function RecipeActions() {
  return (
    <div className="absolute top-4 right-4 z-20">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-3">
          <p className="text-xs text-white text-center">Actions here soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
