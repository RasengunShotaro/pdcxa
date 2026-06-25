"use client";

import { Landmark, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ColorModeSwitcher = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const isLegacy = theme === "legacy";
  const isDark =
    theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {isLegacy ? (
            <Landmark className="h-[1.2rem] w-[1.2rem] transition-all" />
          ) : isDark ? (
            <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
