import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Projects = () => {
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollAnimation();
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Brain Tumor Detector",
      description:
        "A three-stage deep learning pipeline achieving 99.3% accuracy and 97.2% IoU in brain tumor detection and segmentation. Built with PyTorch, YOLO, and SAM to provide real-time diagnostic assistance and quantitative tumor analysis for surgical planning. Deployed on Streamlit.",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
      tags: ["Python", "PyTorch", "YOLO", "SAM", "Streamlit"],
      category: "web",
      featured: true,
      link: "https://github.com/prathamhanda/BrainTumor-Detector"
    },
    {
      id: 2,
      title: "AI-RoadIntelligence",
      description:
        "Real-time traffic optimization system using YOLOv8 for vehicle detection at 45 FPS with under 50ms latency. Integrated SUMO traffic simulator for emergency vehicle routing and alert systems with response times under 3 seconds.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      tags: ["Python", "YOLOv8", "OpenCV", "SUMO", "SightEngine"],
      category: "web",
      featured: true,
      link: "https://github.com/prathamhanda/AI-RoadIntelligence"
    },
    {
      id: 3,
      title: "RoomsOnRent",
      description:
        "A containerized dual-portal platform for student housing with separate interfaces for students and landlords. Features Cloudinary media management and JWT authentication. Successfully deployed serving real users with 75% reduction in response times.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      tags: ["React", "Node.js", "MongoDB", "Docker", "Cloudinary"],
      category: "web",
      featured: true,
      link: "https://github.com/prathamhanda/roomsonrent"
    },
    {
      id: 4,
      title: "LEAD Society Website",
      description:
        "Official website for LEAD Society at TIET featuring smooth UI/UX design, event management system, and member portal. Built as Joint Secretary to showcase society activities and facilitate student engagement with responsive design.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
      tags: ["React", "Tailwind", "Netlify"],
      category: "web",
      featured: false,
      link: "https://leadtiet.netlify.app/"
    },
    {
      id: 5,
      title: "INSDAG Steel Seminar Landing",
      description:
        "High converting landing page for technical seminar achieving 102.7% CTR with 500+ users. Designed for the Civil Department's INSDAG Steel Seminar event. Successfully hosted presentations for 6 industry speakers.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      tags: ["HTML", "CSS", "JavaScript"],
      category: "web",
      featured: false,
      link: "https://github.com/prathamhanda"
    },
    {
      id: 6,
      title: "DBuck Student Housing Platform",
      description:
        "Full stack web application for student housing startup enabling interactive property listings, location-based search, and comprehensive landlord portal. Built to serve 10K+ students at TIET with real-time updates and secure data management.",
      image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=600&fit=crop",
      tags: ["React", "Express.js", "MongoDB", "REST APIs"],
      category: "web",
      featured: false,
      link: "https://github.com/prathamhanda"
    },
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

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
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group glass-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                projectsVisible ? `scroll-animate scroll-animate-delay-${Math.min(index % 3 + 1, 3)}` : ''
              }`}
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
