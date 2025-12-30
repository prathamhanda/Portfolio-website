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
import MobileCommandDialog from "@/components/MobileCommandDialog";
import { Briefcase, User, Mail, FileText, Github, Linkedin, Download, Moon, Sun, Sparkles, Loader } from "lucide-react";
import { useTheme } from "next-themes";
import { isHardcodedQuery } from "@/lib/aiSearch";

// lazy wrapper for queryAI to avoid loading AI-related code on page load
let _queryAILib: typeof import("@/lib/aiSearch") | null = null;
const loadQueryAI = async () => {
  if (!_queryAILib) {
    _queryAILib = await import("@/lib/aiSearch");
  }
  return _queryAILib.queryAI;
};

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: "project" | "section" | "action" | "ai";
  icon: React.ReactNode;
  action?: () => void;
  content?: string;
}

const aiSuggestions = [
  "What are your top skills",
  "Tell me about your experience",
  "What projects have you worked on",
  "What technologies do you use",
  "What is your education background",
  "What is your work style",
  "Tell me about your achievements"
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

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
      const queryAI = await loadQueryAI();
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
    
    // Secret command to check Gemini API status
    if (lowerQuery === "!status gemini" || lowerQuery === "!gemini") {
      const checkAPI = async () => {
        try {
          const queryAI = await loadQueryAI();
          await queryAI("test");
          setAiResponse("✅ Gemini API is working correctly!");
        } catch (error) {
          setAiResponse("❌ Gemini API is not responding. Please check your configuration.");
        }
      };
      checkAPI();
      return [];
    }

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
    // Rotate AI suggestions every 3 seconds
    const rotationInterval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % aiSuggestions.length);
    }, 3000);

    return () => clearInterval(rotationInterval);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-command-palette", openHandler as EventListener);
    return () => window.removeEventListener("open-command-palette", openHandler as EventListener);
  }, []);

  // return focus to FAB on mobile when dialog closes
  useEffect(() => {
    if (!open && isMobile) {
      const fab = document.getElementById('mobile-fab') as HTMLButtonElement | null;
      fab?.focus();
    }
  }, [open, isMobile]);

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
    const delay = isMobile ? 2000 : 1500;
    const timer = setTimeout(() => {
      handleAISearch(searchQuery);
    }, delay);

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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    onChange(mq);
    if (mq.addEventListener) mq.addEventListener("change", onChange as any);
    else mq.addListener(onChange as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange as any);
      else mq.removeListener(onChange as any);
    };
  }, []);

  const commandContent = (
    <>
      <CommandInput 
        placeholder={isMobile ? "Search portfolio or commands" : "Search portfolio, ask questions, or use commands... (AI-powered)"} 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList className={isMobile ? "max-h-none flex-1 overflow-y-auto" : undefined}>
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
                        <p className="text-sm text-foreground leading-relaxed flex-1 whitespace-pre-wrap break-words">{aiResponse}</p>
                        {/* aria-live region for screen readers on mobile */}
                        {isMobile && (
                          <div className="sr-only" aria-live="polite">AI response: {aiResponse}</div>
                        )}
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
          <CommandItem 
            onSelect={() => setSearchQuery(aiSuggestions[currentSuggestion])}
            className="group"
          >
            <Sparkles className="mr-2 h-4 w-4 text-foreground transition-colors" />
            <div className="suggestion-flip-container overflow-hidden">
              <span 
                key={currentSuggestion}
                className="text-foreground transition-colors inline-block animate-flip-text"
              >
                {aiSuggestions[currentSuggestion]}...
              </span>
            </div>
          </CommandItem>

          <style>{`
            @keyframes flipIn {
              0% {
                transform: rotateX(90deg);
                opacity: 0;
              }
              100% {
                transform: rotateX(0deg);
                opacity: 1;
              }
            }

            .animate-flip-text {
              animation: flipIn 0.6s ease-out;
              transform-origin: top;
            }

            .suggestion-flip-container {
              line-height: 1.2;
              min-height: 1.2em;
            }
          `}</style>

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

          <CommandItem onSelect={() => handleNavigation("#projects")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>View Projects</span>
          </CommandItem>
          
          <CommandItem onSelect={() => handleNavigation("#contact")}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact Me</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => {
            window.open('https://drive.google.com/file/d/1w7tvBBgr6TmbTeEXSwQiIs-8VHi9mBEf/view?usp=drive_link', '_blank');
            setOpen(false);
          }}>
            <Download className="mr-2 h-4 w-4" />
            <span>View Resume</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            window.open("https://github.com/prathamhanda", "_blank");
            setOpen(false);
          }}>
            <Github className="mr-2 h-4 w-4" />
            <span>View GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            window.open("https://linkedin.com/in/prathamh", "_blank");
            setOpen(false);
          }}>
            <Linkedin className="mr-2 h-4 w-4" />
            <span>View LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );

  return (
    <>
      {isMobile ? (
        <MobileCommandDialog open={open} onOpenChange={setOpen} searchValue={searchQuery} onClear={() => setSearchQuery("")}>
          {commandContent}
        </MobileCommandDialog>
      ) : (
        <CommandDialog open={open} onOpenChange={setOpen} searchValue={searchQuery} onClear={() => setSearchQuery("")}>
          {commandContent}
        </CommandDialog>
      )}
    </>
  );
};

export default CommandPalette;
