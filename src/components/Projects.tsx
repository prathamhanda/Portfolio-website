import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { projectsData } from "@/data/projects";

const Projects = () => {
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation();
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = projectsData;

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  // Display featured projects first, then newest entries (preserve array order otherwise)
  const displayedProjects = filteredProjects.slice().sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    // fallback: keep original order but show newer items (later in array) first
    return projects.indexOf(b) - projects.indexOf(a);
  });

  const openProject = (project: any) => {
    setSelectedProject(project);
  };

  const closeProject = () => setSelectedProject(null);

  return (
    <section id="projects" ref={projectsRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`mb-12 ${projectsVisible ? 'scroll-animate' : ''}`}>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Projects
          </p>
          <h2 className="text-5xl font-bold mb-8">Selected work</h2>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-foreground text-background"
                  : "glass-card hover:bg-muted/50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("web")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "web"
                  ? "bg-foreground text-background"
                  : "glass-card hover:bg-muted/50"
              }`}
            >
              Web
            </button>
            <button
              onClick={() => setFilter("tools-extensions")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "tools-extensions"
                  ? "bg-foreground text-background"
                  : "glass-card hover:bg-muted/50"
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => setFilter("ai-ml")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "ai-ml"
                  ? "bg-foreground text-background"
                  : "glass-card hover:bg-muted/50"
              }`}
            >
              AI/ML
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => openProject(project)}
              className={`group glass-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                projectsVisible ? `scroll-animate scroll-animate-delay-${Math.min(index % 3 + 1, 3)}` : ''
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openProject(project);
                }
              }}
            >
              <div className="relative overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="absolute top-4 right-4 z-10 bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-secondary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProject(project);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectDetailModal project={selectedProject} isOpen={Boolean(selectedProject)} onClose={closeProject} />
      )}
    </section>
  );
};

export default Projects;
