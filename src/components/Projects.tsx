import { useState } from "react";
import { ExternalLink } from "lucide-react";

const Projects = () => {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "RestOS",
      description:
        "A modern Restaurant POS (Point Of Sale) system designed to streamline restaurant operations...",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      tags: ["React", "Tailwind CSS", "Vanilla JavaScript", "Node.js"],
      category: "web",
      featured: true,
    },
    {
      id: 2,
      title: "Food Data Browser",
      description:
        "A modern web application for browsing and searching food product data, built...",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
      tags: ["React", "React Query", "Tailwind CSS", "Open Food Facts API"],
      category: "web",
      featured: true,
    },
    {
      id: 3,
      title: "Carbon Credits Dash",
      description:
        "This is a frontend application built with React, TypeScript, Vite, and shadcn/ui to...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      tags: ["React", "Node.js", "Tailwind CSS", "shadcn/ui"],
      category: "web",
      featured: true,
    },
    {
      id: 4,
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform with payment integration and inventory management...",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
      tags: ["Next.js", "Stripe", "PostgreSQL", "Prisma"],
      category: "web",
      featured: false,
    },
    {
      id: 5,
      title: "AI Dashboard",
      description:
        "An analytics dashboard powered by AI for real-time data insights and predictions...",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      tags: ["React", "TypeScript", "D3.js", "Python"],
      category: "web",
      featured: false,
    },
    {
      id: 6,
      title: "Social Network App",
      description:
        "A modern social networking platform with real-time messaging and content sharing...",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      tags: ["React Native", "Firebase", "Node.js", "Socket.io"],
      category: "web",
      featured: false,
    },
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 gradient-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
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
                  ? "bg-black text-white"
                  : "bg-white/60 text-foreground hover:bg-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("web")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "web"
                  ? "bg-black text-white"
                  : "bg-white/60 text-foreground hover:bg-white"
              }`}
            >
              Web
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-full text-xs font-medium">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="absolute top-4 right-4 z-10 bg-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
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

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
