import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SupabaseAccessCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Supabase Project Access</CardTitle>
        <CardDescription>
          Configure your Supabase database access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full gap-4">
            {/* Database URL */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="db-url">Database URL</Label>
              <Input id="db-url" placeholder="Enter your Supabase URL" />
            </div>

            {/* Supabase Key */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="supabase-key">Supabase Key</Label>
              <Input id="supabase-key" placeholder="Enter your Supabase Key" />
            </div>

            {/* Password (if required) */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password (Optional)</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Connect</Button>
      </CardFooter>
    </Card>
  );
}
