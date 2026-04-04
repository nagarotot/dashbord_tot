import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/20">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl mt-2">כניסת מנהל</CardTitle>
          <CardDescription>מערכת לניהול סיכומים אקדמיים</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">כתובת אימייל</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                className="text-left font-sans"
                dir="ltr"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                required
                className="text-left font-sans"
                dir="ltr"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">פרטי ההתחברות שגויים, או שאין חיבור למסד נתונים.</p>
            )}
            <Button formAction={login} className="w-full mt-2">
              התחברות למערכת
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
