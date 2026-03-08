import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FileText,
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Plus,
  Settings,
  Search,
  Star,
  Clock,
} from "lucide-react";

const navigationItems = [
  { label: "Home", icon: Home, path: "/", group: "Navigation" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", group: "Navigation" },
  { label: "Log in", icon: LogIn, path: "/login", group: "Navigation" },
  { label: "Sign up", icon: UserPlus, path: "/signup", group: "Navigation" },
];

const documentItems = [
  { label: "Q4 Strategy Brief", icon: FileText, path: "/editor/1", group: "Documents" },
  { label: "Product Roadmap 2026", icon: FileText, path: "/editor/2", group: "Documents" },
  { label: "Design System v3", icon: FileText, path: "/editor/3", group: "Documents" },
  { label: "Engineering Standup Notes", icon: FileText, path: "/editor/4", group: "Documents" },
  { label: "Marketing Campaign Draft", icon: FileText, path: "/editor/5", group: "Documents" },
  { label: "Investor Update Q3", icon: FileText, path: "/editor/6", group: "Documents" },
];

const actionItems = [
  { label: "Create new document", icon: Plus, path: "/dashboard", group: "Actions" },
  { label: "Open demo editor", icon: FileText, path: "/editor/demo", group: "Actions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (path: string) => {
      setOpen(false);
      navigate(path);
    },
    [navigate]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, documents, or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem key={item.path} onSelect={() => handleSelect(item.path)}>
              <item.icon className="mr-2.5 h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Documents">
          {documentItems.map((item) => (
            <CommandItem key={item.path} onSelect={() => handleSelect(item.path)}>
              <item.icon className="mr-2.5 h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {actionItems.map((item) => (
            <CommandItem key={item.label} onSelect={() => handleSelect(item.path)}>
              <item.icon className="mr-2.5 h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
