import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  Settings,
  UserCheck,
  User,
  BrainCircuit,
  Layers,
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
    title: "Career Intelligence",
    href: "/career-intelligence",
    icon: BrainCircuit,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Layers,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
