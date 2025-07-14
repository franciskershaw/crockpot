import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoogleIcon from "./GoogleIcon";
import { signInWithGoogle } from "@/actions";

export default function Auth() {
  return (
    <div className="lg:justify-self-end w-full max-w-md">
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Join Crockpot
          </CardTitle>
          <CardDescription className="text-gray-600">
            Start your cooking adventure today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={signInWithGoogle}>
            <Button
              // onClick={() => signIn("google")}
              type="submit"
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </form>
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">or</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
