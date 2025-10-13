import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Home, Briefcase, User, Mail, FileText, Github, Linkedin, Download, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigation = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a project or anything..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => handleNavigation("#projects")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Change Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation("#contact")}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact Me</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Other Options">
          <CommandItem onSelect={() => handleNavigation("#about")}>
            <User className="mr-2 h-4 w-4" />
            <span>About</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation("#projects")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Browse Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation("/")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Read Blogs</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Download Resume</span>
          </CommandItem>
          <CommandItem onSelect={() => window.open("https://github.com", "_blank")}>
            <Github className="mr-2 h-4 w-4" />
            <span>View GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => window.open("https://linkedin.com", "_blank")}>
            <Linkedin className="mr-2 h-4 w-4" />
            <span>View LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
