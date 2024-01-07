import * as React from "react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ywaeexoevxxjquwlhfjx
 https://ywaeexoevxxjquwlhfjx.supabase.co
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM
*/

export function NewProjectCard() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const api = "/api/projects/create-project";
    const {
      "db-name": name,
      "db-ref": ref,
      "db-url": url,
      "db-key": key,
      "db-pass": pass,
    } = e.target.elements;

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        ref: ref.value,
        url: url.value,
        key: key.value,
        pass: pass.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <div className="max-w-xs lg:max-w-7xl w-full ">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full gap-4">
            <div className="flex flex-row justify-between space-x-1.5">
              <div className="flex flex-col space-y-1.5 w-full mt-4">
                <Label htmlFor="db-name">Project Name</Label>
                <Input
                  id="db-name"
                  placeholder="Enter a name for your project"
                  className="w-full text-sm focus:text-white text-gray-500"
                />
              </div>
              <div className="flex flex-col space-y-1.5 w-full mt-4">
                <Label htmlFor="db-ref">Project ID</Label>
                <Input
                  id="db-ref"
                  placeholder="Enter your Supabase Reference ID"
                  className="w-full text-sm focus:text-white text-gray-500"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5 mt-4">
              <Label htmlFor="db-url">Database URL</Label>
              <Input
                id="db-url"
                placeholder="Enter your Supabase URL"
                className="w-full text-sm focus:text-white text-gray-500"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="db-key">Supabase Key</Label>
              <Input
                id="db-key"
                placeholder="Enter your Supabase Key"
                className="w-full text-sm focus:text-white text-gray-500"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="db-pass">Password (Optional)</Label>
              <Input
                id="db-pass"
                type="password"
                placeholder="Password"
                className="w-full text-sm focus:text-white text-gray-500"
              />
            </div>
          </div>
          <Button
            onSubmit={(e) => handleSubmit(e)}
            type="submit"
            className="hover:bg-slate-600 mt-2"
          >
            Connect
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
