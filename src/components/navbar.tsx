import { useLocation } from "react-router-dom";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, LinkedInIcon } from "@/components/icons";

export const Navbar = () => {
  const location = useLocation();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* LEFT: Logo */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <img
              alt="GreenPulse logo"
              className="h-8 w-auto"
              src="/logo/Logo.png"
            />
            <p className="font-bold text-inherit text-xl">
              Green <span className="text-green-600 font-bold">Pulse</span>
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* CENTER: Nav links */}
      <NavbarContent className="hidden lg:flex gap-6" justify="center">
        {siteConfig.navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "px-3 py-1 rounded-md transition-colors",
                  isActive && " text-green-600 font-semibold",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* RIGHT: Icons */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.linkedin} title="LinkedIn">
            <LinkedInIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile: Icons + Menu */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.linkedin}>
          <LinkedInIcon className="text-default-500" />
        </Link>
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="backdrop-blur-md bg-white/20 dark:bg-black/20">
        {siteConfig.navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <NavbarMenuItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "w-full block py-2 text-lg px-3 rounded-md transition-colors",
                  isActive && "text-green-600 font-semibold",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
