export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  tags: string[];
  techStack: string[];
  category: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
  challenges: string[];
  metrics: {
    value: string;
    label: string;
    description?: string;
  }[];
  implementation: {
    approach: string;
    technologies: {
      name: string;
      reason: string;
    }[];
  };
  architecture?: string;
  documentation: {
    setup: string;
    usage: string;
    api?: string;
  };
}

export const projectsData: Project[] = [
  {
    id: "brain-tumor-detector",
    title: "Brain Tumor Detector",
    description: "A three-stage deep learning pipeline achieving 99.3% accuracy and 97.2% IoU in brain tumor detection and segmentation.",
    fullDescription: "An advanced medical AI system that combines YOLOv8 for tumor detection, SAM for precise segmentation, and custom PyTorch models for classification. The system processes MRI scans in real-time to assist healthcare professionals in early diagnosis and surgical planning. The three-stage pipeline ensures high accuracy while maintaining clinical workflow compatibility.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop"
    ],
    tags: ["Python", "PyTorch", "YOLO", "Segment Anything Model", "Streamlit"],
    techStack: ["Python", "PyTorch", "YOLOv8", "Segment Anything Model", "OpenCV", "Streamlit", "NumPy", "Matplotlib"],
    category: "ai-ml",
    featured: true,
    githubUrl: "https://github.com/prathamhanda/BrainTumor-Detector",
    liveUrl: "https://brain-tumor-detector-demo.streamlit.app",
    features: [
      "Real-time MRI scan analysis",
      "99.3% classification accuracy",
      "97.2% IoU segmentation precision",
      "Multi-format image support (DICOM, PNG, JPG)",
      "Quantitative tumor analysis",
      "Surgical planning assistance",
      "Interactive web interface",
      "Batch processing capabilities"
    ],
    challenges: [
      "Handling medical image variations across different MRI machines and protocols",
      "Achieving real-time performance while maintaining high accuracy",
      "Integrating multiple AI models into a cohesive pipeline",
      "Ensuring clinical-grade reliability and error handling"
    ],
    metrics: [
      {
        value: "99.3%",
        label: "Classification Accuracy",
        description: "Tumor vs non-tumor classification on test dataset"
      },
      {
        value: "97.2%",
        label: "IoU Score",
        description: "Intersection over Union for tumor segmentation"
      },
      {
        value: "<2s",
        label: "Processing Time",
        description: "Average time per MRI scan analysis"
      },
      {
        value: "5000+",
        label: "Images Processed",
        description: "Training and validation dataset size"
      }
    ],
    implementation: {
      approach: "The system uses a three-stage approach: YOLOv8 for initial tumor detection, SAM for precise segmentation, and a custom PyTorch classifier for tumor type identification. Each stage is optimized for clinical accuracy and speed.",
      technologies: [
        {
          name: "YOLOv8",
          reason: "State-of-the-art object detection with excellent balance of speed and accuracy for medical imaging"
        },
        {
          name: "Segment Anything Model",
          reason: "Provides precise segmentation boundaries crucial for surgical planning and tumor volume calculation"
        },
        {
          name: "PyTorch",
          reason: "Flexible deep learning framework enabling custom model architectures and easy deployment"
        },
        {
          name: "Streamlit",
          reason: "Rapid prototyping of interactive web interface for medical professionals"
        }
      ]
    },
    architecture: `Input Layer (MRI Scan)
        ↓
YOLOv8 Detection Model
        ↓
SAM Segmentation Model  
        ↓
PyTorch Classification
        ↓
Results Visualization`,
    documentation: {
      setup: `# Installation
pip install torch torchvision
pip install ultralytics
pip install segment-anything
pip install streamlit opencv-python

# Download models
wget https://github.com/.../yolov8n.pt
wget https://github.com/.../sam_vit_h.pth

# Run application
streamlit run app.py`,
      usage: `Upload your MRI scan in DICOM, PNG, or JPG format. The system will automatically process the image through our three-stage pipeline and provide detailed results including tumor location, size, and classification confidence scores.`,
      api: `POST /analyze
Content-Type: multipart/form-data

{
  "image": <file>,
  "format": "dicom|png|jpg"
}

Response:
{
  "detection": {...},
  "segmentation": {...},
  "classification": {...}
}`
    }
  },
  {
    id: "ai-road-intelligence",
    title: "AI-RoadIntelligence",
    description: "Real-time traffic optimization system using YOLOv8 for vehicle detection at 45 FPS with under 50ms latency.",
    fullDescription: "A comprehensive traffic management system that leverages computer vision and AI to optimize traffic flow in real-time. The system integrates YOLOv8 for vehicle detection, SUMO traffic simulation for scenario modeling, and custom algorithms for emergency vehicle routing. Designed for smart city implementations with scalable architecture.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&h=600&fit=crop"
    ],
    tags: ["Python", "YOLOv8", "OpenCV", "SUMO", "SightEngine"],
    techStack: ["Python", "YOLOv8", "OpenCV", "SUMO", "SightEngine API", "NumPy", "Flask", "Redis"],
    category: "ai-ml",
    featured: true,
    githubUrl: "https://github.com/prathamhanda/AI-RoadIntelligence",
    features: [
      "Real-time vehicle detection at 45 FPS",
      "Emergency vehicle priority routing",
      "Traffic density analysis",
      "Adaptive signal timing",
      "Multi-camera integration",
      "Alert system for incidents",
      "SUMO simulation integration",
      "Performance analytics dashboard"
    ],
    challenges: [
      "Processing multiple video streams simultaneously while maintaining real-time performance",
      "Handling diverse lighting conditions and weather scenarios",
      "Coordinating traffic signals across multiple intersections",
      "Ensuring system reliability for critical emergency vehicle routing"
    ],
    metrics: [
      {
        value: "45 FPS",
        label: "Detection Speed",
        description: "Real-time vehicle detection performance"
      },
      {
        value: "<50ms",
        label: "Response Latency",
        description: "System response time for signal changes"
      },
      {
        value: "35%",
        label: "Traffic Improvement",
        description: "Reduction in average wait times"
      },
      {
        value: "<3s",
        label: "Emergency Response",
        description: "Alert system response time"
      }
    ],
    implementation: {
      approach: "The system employs YOLOv8 for robust vehicle detection, integrated with SUMO traffic simulator for predictive modeling. Real-time data processing enables dynamic traffic signal optimization and emergency vehicle prioritization.",
      technologies: [
        {
          name: "YOLOv8",
          reason: "Superior real-time object detection performance with high accuracy for various vehicle types"
        },
        {
          name: "SUMO",
          reason: "Industry-standard traffic simulation for modeling and testing optimization algorithms"
        },
        {
          name: "OpenCV",
          reason: "Comprehensive computer vision library for image processing and camera integration"
        },
        {
          name: "SightEngine",
          reason: "Advanced content moderation and analysis for enhanced traffic monitoring"
        }
      ]
    },
    architecture: `Camera Feeds → YOLOv8 Detection → Traffic Analysis → SUMO Simulation → Signal Control`,
    documentation: {
      setup: `# Clone repository
git clone https://github.com/prathamhanda/AI-RoadIntelligence
cd AI-RoadIntelligence

# Install dependencies
pip install -r requirements.txt

# Setup SUMO
sudo apt-get install sumo sumo-tools sumo-doc

# Run system
python main.py --config config.yaml`,
      usage: `Configure camera endpoints in config.yaml, start the detection system, and monitor traffic through the web dashboard. The system automatically optimizes signal timing based on real-time traffic conditions.`
    }
  },
  {
    id: "roomsonrent",
    title: "RoomsOnRent",
    description: "A containerized dual-portal platform for student housing with separate interfaces for students and landlords.",
    fullDescription: "A full-stack web application designed specifically for student housing needs, featuring dual portals for students and landlords. The platform includes advanced search capabilities, real-time availability updates, virtual property tours, and integrated booking systems. Built with modern web technologies and deployed using containerization for scalability.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515263487990-61b07816b924?w=800&h=600&fit=crop"
    ],
    tags: ["React", "Node.js", "MongoDB", "Docker", "Cloudinary"],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Docker", "Cloudinary", "JWT", "Stripe API"],
    category: "web",
    featured: true,
    githubUrl: "https://github.com/prathamhanda/roomsonrent",
    liveUrl: "https://roomsonrent.prathamhanda.com",
    features: [
      "Dual portal system (Students & Landlords)",
      "Advanced property search and filtering",
      "Real-time availability updates",
      "Virtual property tours",
      "Integrated booking system",
      "Secure payment processing",
      "Review and rating system",
      "Mobile-responsive design"
    ],
    challenges: [
      "Designing intuitive UX for two different user types with distinct needs",
      "Implementing real-time updates for property availability across multiple users",
      "Ensuring secure payment processing and data protection",
      "Optimizing performance for large property datasets and image galleries"
    ],
    metrics: [
      {
        value: "75%",
        label: "Response Time Reduction",
        description: "Improvement in platform performance"
      },
      {
        value: "1000+",
        label: "Properties Listed",
        description: "Active property listings on platform"
      },
      {
        value: "500+",
        label: "Active Users",
        description: "Students and landlords using the platform"
      },
      {
        value: "99.9%",
        label: "Uptime",
        description: "Platform availability and reliability"
      }
    ],
    implementation: {
      approach: "Built using the MERN stack with a microservices architecture approach. Containerized deployment ensures scalability and easy maintenance. JWT-based authentication provides secure access control for both user types.",
      technologies: [
        {
          name: "React",
          reason: "Component-based architecture perfect for building distinct user interfaces for students and landlords"
        },
        {
          name: "Node.js + Express",
          reason: "Fast, scalable backend with excellent ecosystem for real-time features"
        },
        {
          name: "MongoDB",
          reason: "Flexible document-based database ideal for varied property data structures"
        },
        {
          name: "Docker",
          reason: "Containerization ensures consistent deployment and easy scaling"
        }
      ]
    },
    architecture: `React Frontend ↔ Express API ↔ MongoDB Database
                     ↓
              Cloudinary Media Storage
                     ↓  
              Docker Container Deployment`,
    documentation: {
      setup: `# Clone and setup
git clone https://github.com/prathamhanda/roomsonrent
cd roomsonrent

# Install dependencies
npm install
cd client && npm install

# Environment setup
cp .env.example .env
# Add your MongoDB, Cloudinary, and Stripe keys

# Run with Docker
docker-compose up -d

# Or run locally
npm run dev`,
      usage: `Students can search properties, book viewings, and make secure payments. Landlords can list properties, manage bookings, and track earnings through their dedicated dashboard.`
    }
  }
];
