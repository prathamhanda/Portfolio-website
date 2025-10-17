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
import { Briefcase, User, Mail, FileText, Github, Linkedin, Download, Moon, Sun, Sparkles, Loader } from "lucide-react";
import { useTheme } from "next-themes";
import { queryAI, isHardcodedQuery } from "@/lib/aiSearch";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: "project" | "section" | "action" | "ai";
  icon: React.ReactNode;
  action?: () => void;
  content?: string;
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { setTheme, theme } = useTheme();

  const projectsData = [
    {
      id: "brain-tumor",
      title: "Brain Tumor Detector",
      description: "Deep learning pipeline with 99.3% accuracy using PyTorch and YOLO",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/prathamhanda/BrainTumor-Detector", "_blank")
    },
    {
      id: "road-intelligence",
      title: "AI-RoadIntelligence",
      description: "Real-time traffic optimization with YOLOv8 vehicle detection",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/prathamhanda/AI-RoadIntelligence", "_blank")
    },
    {
      id: "roomsonrent",
      title: "RoomsOnRent",
      description: "Containerized dual-portal platform for student housing",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/prathamhanda/roomsonrent", "_blank")
    },
    {
      id: "lead-society",
      title: "LEAD Society Website",
      description: "Official website for LEAD Society with event management",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://leadtiet.netlify.app/", "_blank")
    },
  ];

  const handleAISearch = async (query: string) => {
    if (!query.trim() || isHardcodedQuery(query)) {
      setAiResponse(null);
      return;
    }

    setAiLoading(true);
    try {
      const response = await queryAI(query);
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Unable to process query.");
    } finally {
      setAiLoading(false);
    }
  };

  const fuzzySearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results = projectsData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description?.toLowerCase().includes(lowerQuery);
      return titleMatch || descMatch;
    }).sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(lowerQuery);
      const bTitle = b.title.toLowerCase().includes(lowerQuery);
      return aTitle === bTitle ? 0 : aTitle ? -1 : 1;
    });

    return results;
  };

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

  useEffect(() => {
    // Immediate fuzzy search (no debounce - instant results)
    if (searchQuery.trim()) {
      const results = fuzzySearch(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setAiResponse(null);
      return;
    }

    // Debounced AI search (300ms delay - reduces API calls)
    const timer = setTimeout(() => {
      handleAISearch(searchQuery);
    }, 1500); // 🔧 ADJUST THIS VALUE TO CHANGE DEBOUNCE TIMING

    // Cleanup: cancel previous timer if user types again
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

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
      <CommandInput 
        placeholder="Search projects, ask questions, or use commands... (AI-powered)" 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {!aiResponse && !aiLoading && <CommandEmpty>
          {searchQuery ? "Searching..." : "Start typing to search or ask anything..."}
        </CommandEmpty>}

        {/* AI Response Section - Shown Immediately */}
        {searchQuery && !isHardcodedQuery(searchQuery) && (
          <>
            {aiLoading && (
              <>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
                <CommandSeparator />
              </>
            )}
            {aiResponse && aiResponse.trim() && (
              <>
                <div className="px-4 py-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">🤖 AI ASSISTANT</div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <p className="text-sm text-foreground leading-relaxed">{aiResponse}</p>
                  </div>
                </div>
                <CommandSeparator />
              </>
            )}
          </>
        )}

        {/* Fuzzy Search Results */}
        {searchResults.length > 0 && (
          <>
            <CommandGroup heading="Projects">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    result.action?.();
                    setOpen(false);
                  }}
                >
                  {result.icon}
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => handleNavigation("#projects")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>View Projects</span>
          </CommandItem>
          
          <CommandItem onSelect={() => {
            setTheme(theme === "dark" ? "light" : "dark");
            setOpen(false);
          }}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation("#about")}>
            <User className="mr-2 h-4 w-4" />
            <span>About Me</span>
          </CommandItem>  
          <CommandItem onSelect={() => handleNavigation("#contact")}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact Me</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => {
            window.location.href = "/resume.pdf";
            setOpen(false);
          }}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download Resume</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            window.open("https://github.com/prathamhanda", "_blank");
            setOpen(false);
          }}>
            <Github className="mr-2 h-4 w-4" />
            <span>View GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            window.open("https://linkedin.com/in/prathamhanda", "_blank");
            setOpen(false);
          }}>
            <Linkedin className="mr-2 h-4 w-4" />
            <span>View LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
