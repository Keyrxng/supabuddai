"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function LoginCard() {
  const loginApi = "/api/auth/login";
  const logoutApi = "/api/auth/logout";
  const registerApi = "/api/auth/signup";

  const login = async (email, password) => {
    const response = await fetch(loginApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log(response);
    if (response.ok) {
    } else {
    }
  };

  const logout = async () => {
    const response = await fetch(logoutApi, {
      method: "POST",
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  };

  const register = async (email, password) => {
    const response = await fetch(registerApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  };

  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
    try {
      const user = await login(email, password);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const registerUser = async (email, password) => {
    try {
      const user = await register(email, password);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    console.log(email.value, password.value);
    registerUser(email.value, password.value);
  };

  return (
    <div className="max-w-xs lg:w-[350px] lg:max-w-5xl">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full gap-4">
            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" />
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
          </div>
          <Button>Connect</Button>
        </form>
      </CardContent>
    </div>
  );
}
