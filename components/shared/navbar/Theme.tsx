"use client";

import React from "react";

import Image from "next/image";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { themes } from "@/constants";
import { useTheme } from "@/context/ThemeProvider";

const Theme = () => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          {themeMode === "light" ? (
            <Image
              src="/assets/icons/sun.svg"
              alt="light-mode"
              width={20}
              height={20}
              className="active-theme"
            />
          ) : (
            <Image
              src="/assets/icons/moon.svg"
              alt="dark-mode"
              width={20}
              height={20}
              className="active-theme"
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300 bg-light-900">
          {themes.map((theme) => (
            <MenubarItem
              key={theme.value}
              className="flex items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400 cursor-pointer"
              onClick={() => {
                setThemeMode(theme.value);

                if (theme.value !== "system") {
                  localStorage.theme = theme.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
            >
              <Image
                src={theme.icon}
                alt={theme.value}
                width={16}
                height={16}
                className={`${themeMode === theme.value && "active-theme"}`}
              />
              <p
                className={`body-semibold text-light-500 ${themeMode === theme.value ? "text-primary-500" : "text-dark-100_light900"}`}
              >
                {theme.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
