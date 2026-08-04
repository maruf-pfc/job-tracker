import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  Settings,
  Tags,
  UserCheck,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Applications",
    href: "/applications",
    icon: BriefcaseBusiness,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Roles",
    href: "/roles",
    icon: UserCheck,
  },
  {
    title: "Lookups",
    href: "/lookups",
    icon: Tags,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
