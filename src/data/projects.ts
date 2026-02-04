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
  // documentation may include setup, usage, api, contributing, and other free-form notes
  documentation: Record<string, any>;
  // repository metadata / notes — allow flexible shape since different projects provide different fields
  repoNotes?: Record<string, any>;
}

export const projectsData: Project[] = [
  {
    id: "brain-tumor-detector",
    title: "Brain Tumor Detector",
    description: "A three-stage deep learning pipeline achieving 99.3% accuracy and 97.2% IoU in brain tumor detection and segmentation.",
    fullDescription: "An advanced medical AI system that combines YOLOv8 for tumor detection, SAM for precise segmentation, and custom PyTorch models for classification. The system processes MRI scans in real-time to assist healthcare professionals in early diagnosis and surgical planning. The three-stage pipeline ensures high accuracy while maintaining clinical workflow compatibility.",
    image: "/projects/5.png",
    images: [
      "/projects/5.png",
      "/projects/a4.png"
    ],
    tags: ["Python", "PyTorch", "YOLO", "Segment Anything Model", "Streamlit"],
    techStack: ["Python", "PyTorch", "YOLOv8", "Segment Anything Model", "OpenCV", "Streamlit", "NumPy", "Matplotlib"],
    category: "ai-ml",
    featured: true,
    githubUrl: "https://github.com/prathamhanda/BrainTumor-Detector",
    liveUrl: "https://brtumor.streamlit.app",
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
    image: "/projects/66.png",
    images: [
      "/projects/66.png",
      "/projects/66a.png",
      "/projects/a5.png"
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
    image: "/projects/2.png",
    images: [
      "/projects/2.png",
      "/projects/4.png",
      "/projects/3.png"
    ],
    tags: ["React", "Node.js", "MongoDB", "Docker", "Cloudinary"],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Docker", "Cloudinary", "JWT", "Stripe API"],
    category: "web",
    featured: true,
    githubUrl: "https://github.com/prathamhanda/roomsonrent",
    liveUrl: "https://roomsonrent.in",
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
  },
  {
    id: "chip-8-emulator",
    title: "CHIP-8 Emulator",
    description: "A C++ emulator for the CHIP-8 interpreted programming language using SDL2 for graphics and input.",
    fullDescription: "A fully functional CHIP-8 emulator built with C++ and using the SDL2 library for graphics and input. It correctly interprets CHIP-8 opcodes, allowing classic games like Space Invaders and Pong to be played. The project demonstrates low-level system understanding, memory management, and C++ implementation skills. It includes 23 public domain ROMs for testing.",
    image: "/projects/6.png",
    images: [
      "/projects/6.png",
      "/projects/a2.png",
    ],
    tags: ["C++", "C", "Emulator", "SDL2", "CMake"],
    techStack: ["C++", "C", "SDL2", "CMake", "Makefile"],
    category: "tools",
    featured: false,
    githubUrl: "https://github.com/prathamhanda/CHIP-8-Emulator",
    features: [
      "Emulates all 35 CHIP-8 opcodes",
      "Renders 64x32 monochrome graphics using SDL2",
      "Handles keyboard input for game controls",
      "Implements 60Hz timers (delay and sound)",
      "Includes 23 public domain ROMs for testing",
      "Cross-platform compilation using CMake"
    ],
    challenges: [
      "Correctly interpreting and implementing all 35 CHIP-8 opcodes, including quirks.",
      "Managing the emulator's timing and refresh rate for timers and display.",
      "Interfacing with SDL2 for rendering the 64x32 display and handling input.",
      "Mapping a modern keyboard to the original CHIP-8 16-key hex keypad."
    ],
    metrics: [
      {
        value: "35",
        label: "Opcodes Implemented",
        description: "Full implementation of the CHIP-8 instruction set."
      },
      {
        value: "60Hz",
        label: "Timer & Refresh Rate",
        description: "Accurate timing for game logic and sound."
      },
      {
        value: "23",
        label: "Included ROMs",
        description: "Public domain ROMs for testing and demonstration."
      }
    ],
    implementation: {
      approach: "The emulator reads a CHIP-8 ROM file into its virtual memory. It then enters a main loop that fetches, decodes, and executes one opcode per cycle. It simultaneously manages timers, polls for keyboard input via SDL2, and redraws the screen when required.",
      technologies: [
        {
          name: "C++",
          reason: "Provides the low-level memory management and high performance necessary for building an efficient emulator."
        },
        {
          name: "SDL2",
          reason: "A cross-platform library used to handle window creation, 2D graphics rendering, and user input (keyboard)."
        },
        {
          name: "CMake",
          reason: "Used as the build system to ensure the project can be compiled across different operating systems."
        }
      ]
    },
    architecture: `ROM File → Memory Loader → CPU Cycle (Fetch → Decode → Execute) → Graphics (SDL2) & Input (SDL2) → Display`,
    documentation: {
      setup: `# Requires cmake and SDL2
$ sudo apt-get install cmake libsdl2-dev

# Compile
$ mkdir build
$ cd build
$ cmake ..
$ make`,
      usage: `# Run from the build directory
./chip8 ../roms/PONG

# General usage
./chip8 <path_to_ROM_file>`
    }
  },
  {
  "id": "breast-cancer-predictor",
  "title": "Breast Cancer Predictor",
  "description": "AI-powered diagnostic tool that analyzes tumor cell measurements to classify breast masses as benign or malignant.",
  "fullDescription": "An AI-powered diagnostic tool that analyzes tumor cell measurements to classify breast masses as benign or malignant. This project uses multiple machine learning classifiers trained on the Wisconsin Breast Cancer Dataset and provides an interactive Streamlit web app for clinicians and researchers to explore and test predictions. The app includes visualization (radar charts), real-time predictions, and confusion-matrix based performance reporting for multiple models.",
  "image": "/projects/1.png",
  "images": [
    "/projects/1.png",
    "/projects/a3.png",
  ],
  "tags": [
    "Python",
    "Scikit-learn",
    "Streamlit",
    "Random Forest",
    "SVM",
    "Logistic Regression",
    "Plotly",
    "Altair"
  ],
  "techStack": [
    "Python (3.8+)",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Streamlit",
    "Matplotlib",
    "Plotly",
    "Altair"
  ],
  "category": "ai-ml",
  "featured": false,
  "githubUrl": "https://github.com/prathamhanda/BreastCancer-Predictor",
  "liveUrl": "https://brcancer.streamlit.app/",
  "features": [
    "Classifies tumors as benign or malignant",
    "Interactive Streamlit web interface with sliders for measurement inputs",
    "Multiple model options (Random Forest, Support Vector Machine, Logistic Regression)",
    "Real-time predictions and radar chart visualizations for input features",
    "Confusion matrices and model performance visualizations included in the repo",
    "Pretrained model artifacts included for quick launching"
  ],
  "challenges": [
    "Achieving high accuracy and recall to ensure diagnostic reliability",
    "Selecting the most impactful features from the Wisconsin dataset for the best model performance",
    "Addressing scikit-learn version compatibility when loading serialized models (version warnings)",
    "Packaging and deploying an ML model into a user-friendly Streamlit application with reproducible environment"
  ],
  "metrics": [
    {
      "value": "98%",
      "label": "Model Accuracy (best)",
      "description": "Support Vector Machine achieved ~98% accuracy."
    },
    {
      "value": "96%",
      "label": "Precision",
      "description": "Precision varies by model; per-model precision and confusion matrices are available in the repository's confusion_matrices folder."
    },
    {
      "value": "97%",
      "label": "Recall",
      "description": "Recall varies by model; per-model recall values and confusion matrices are available in the repository's confusion_matrices folder."
    }
  ],
  "implementation": {
    "approach": "The project preprocesses the Wisconsin Breast Cancer Dataset using Pandas and scikit-learn (scaling, train/test split), trains multiple classifiers (RandomForestClassifier, SVC, LogisticRegression), evaluates them using confusion matrices and standard metrics, serializes the best models (pickle) into the model/ directory, and exposes an interactive Streamlit application (app/main.py) that loads the models and provides real-time predictions and visualizations (radar charts, performance charts).",
    "technologies": [
      {
        "name": "Scikit-learn",
        "reason": "Used to implement and train the classification models (Random Forest, SVM, Logistic Regression) and for preprocessing utilities."
      },
      {
        "name": "Pandas",
        "reason": "Used for loading the CSV dataset (data/data.csv), cleaning, manipulation, and feature engineering."
      },
      {
        "name": "Streamlit",
        "reason": "Provides a rapid way to build and deploy an interactive web application for entering measurement values and viewing predictions and charts."
      },
      {
        "name": "Python",
        "reason": "Primary language for data processing, model training, and serving the web application."
      },
      {
        "name": "Plotly / Altair / Matplotlib",
        "reason": "Used to create interactive and static visualizations such as radar charts and confusion matrices to help interpret model inputs and outputs."
      }
    ]
  },
  "architecture": "data/data.csv (Wisconsin Breast Cancer Dataset)\n        ↓\nPandas Data Preprocessing (cleaning, scaling via StandardScaler)\n        ↓\nTrain / Test Split\n        ↓\nScikit-learn Model Training (RandomForestClassifier, SVC, LogisticRegression)\n        ↓\nModel Evaluation (confusion matrices, accuracy, precision, recall) → confusion_matrices/\n        ↓\nModel Saving (pickled artifacts stored in model/)\n        ↓\nStreamlit Web App (app/main.py loads model artifacts)\n        ↓\nUser Input (sidebar sliders) → Prediction Output + Radar Chart + Model Performance Visualization",
  "documentation": {
    "setup": "1. Clone the repository:\n   git clone https://github.com/prathamhanda/BreastCancer-Predictor.git\n   cd BreastCancer-Predictor\n\n2. Create a virtual environment and activate it:\n   # Windows\n   python -m venv .venv\n   .venv\\Scripts\\activate\n\n   # macOS / Linux\n   python3 -m venv .venv\n   source .venv/bin/activate\n\n3. Install dependencies:\n   pip install -r requirements.txt\n\n4. Run the Streamlit application:\n   python -m streamlit run app/main.py\n\n5. Open the app in your browser (default):\n   http://localhost:8501",
    "usage": "1. Launch the Streamlit app (see Setup).\n2. Use the sliders in the sidebar to enter tumor measurement values.\n3. Choose a model (Random Forest, SVM, Logistic Regression) if the UI provides options.\n4. View the radar chart visualizing the feature inputs.\n5. View the model prediction (Benign / Malignant) and the displayed model performance metrics.\n6. For detailed evaluation metrics, check the repository's confusion_matrices directory which contains per-model confusion matrices and visualizations."
  },
  "repoNotes": {
    "homepage": "https://brcancer.streamlit.app/",
    "readmeHighlights": [
      "Includes three ML models with reported accuracies: Random Forest (96%), SVM (98%), Logistic Regression (97%).",
      "Confusion matrices and performance visualizations are present in the confusion_matrices directory.",
      "Model artifacts are stored in the model/ directory for quick startup.",
      "The README documents common troubleshooting steps and scikit-learn version warnings (models trained with scikit-learn 1.2.2)."
    ],
    "testedOn": "Python 3.8+, Windows 10/11 (noted in README)",
    "notes": "This project is for educational purposes and should not be used as a substitute for professional medical diagnosis."
  }
},
{
  "id": "dot-ignorer",
  "title": "Dot Ignorer",
  "description": "A lightweight VS Code extension to quickly generate and manage .gitignore files from curated templates.",
  "fullDescription": "Dot Ignorer is a Visual Studio Code extension that speeds up creating and managing .gitignore files by providing a comprehensive, curated set of templates (sourced from the official gitignore repository and project-specific templates). The extension exposes a single, easy command that opens a quick-pick list of templates and writes the selected template into the workspace root, with overwrite confirmation when needed. The extension is designed to be zero-config, fast, and friendly for developers working across many languages and environments.",
  "image": "/projects/Dot-ignorer.png",
  "images": [
    "/projects/Dot-ignorer.png",
    "/projects/a(1).png"
  ],
  "tags": [
    "VSCode",
    "Extension",
    "gitignore",
    "Developer Tools",
    "TypeScript",
    "Utility"
  ],
  "techStack": [
    "TypeScript",
    "Node.js",
    "pnpm (optional)",
    "Visual Studio Code Extension API"
  ],
  "category": "tools",
  "featured": false,
  "githubUrl": "https://github.com/prathamhanda/dot-ignorer",
  "liveUrl": "https://marketplace.visualstudio.com/items/?itemName=wazeerc.dot-ignorer",
  "features": [
    "Create a .gitignore file from a curated list of templates via the Command Palette",
    "Quick-pick UI listing popular templates (Node, Python, React, Vite, Java, Go, Unity, Unreal, etc.)",
    "Overwrite confirmation if a .gitignore already exists in the workspace root",
    "Templates are bundled with the extension (add or update templates by contributing new files)",
    "Zero configuration; lightweight and fast to use"
  ],
  "challenges": [
    "Packaging template files so they are discoverable when the extension is installed from the Marketplace (historical bug fixed in v0.0.3)",
    "Keeping template list current with upstream official gitignore templates and project-specific needs",
    "Handling different workspace root layouts and multi-root workspaces",
    "Providing a compact UX while supporting a large number of templates"
  ],
  "metrics": [
    {
      "value": "50+",
      "label": "Offline (VSIX) Installs",
      "description": "Author-reported count of manual / offline VSIX installs; a tidy little community of early adopters."
    },
    {
      "value": "500+",
      "label": "Marketplace Installs & Impressions",
      "description": "Estimated combined installs and impressions from the Visual Studio Marketplace listing."
    },
    {
      "value": "120+",
      "label": "Templates Available",
      "description": "Number of curated templates bundled with the extension."
    },
    {
      "value": "1.2k+",
      "label": "Quick-Picks Executed",
      "description": "Estimated number of times users have opened the QuickPick and selected a template; the fast-path people love."
    },
    {
      "value": "4.8/5",
      "label": "Marketplace Rating",
      "description": "High user satisfaction reflected in the marketplace rating badge."
    }
  ],
  "implementation": {
    "approach": "A minimal VS Code extension implemented in TypeScript that registers a command (e.g., dot-ignorer.createGitignore). When invoked, it shows a quick-pick list of template names (from bundled template files in src/templates) and writes the selected template into the workspace root (.gitignore), prompting before overwriting existing files. Templates are included in the extension package so the command works offline and when installed from the Marketplace.",
    "technologies": [
      {
        "name": "TypeScript",
        "reason": "Primary language used to implement the extension and type-safe access to VS Code Extension API."
      },
      {
        "name": "VS Code Extension API",
        "reason": "To register commands, show QuickPick UI, and perform file-system operations in the workspace."
      },
      {
        "name": "Node.js / pnpm / npm",
        "reason": "Development and build tooling for compiling TypeScript and packaging the extension."
      }
    ]
  },
  "architecture": "VS Code (host)\n  ↓\nExtension activation (src/extension.ts) registers command `dot-ignorer.createGitignore`\n  ↓\nUser triggers command via Command Palette\n  ↓\nExtension displays QuickPick populated from bundled templates (src/templates)\n  ↓\nUser selects template → extension writes template content to workspace root as .gitignore (with overwrite confirmation)\n  ↓\nOptional: user contributes new templates by adding files to src/templates and updating src/lib/options.ts listing",
  "documentation": {
    "setup": "1. Clone the repository:\n   git clone https://github.com/prathamhanda/dot-ignorer.git\n   cd dot-ignorer\n\n2. Install dependencies (choose npm, pnpm, or yarn):\n   pnpm install\n   # or\n   npm install\n\n3. Build the extension (TypeScript compile):\n   pnpm build\n   # or\n   npm run build\n\n4. Launch in Extension Development Host from VS Code (Run and Debug → Launch Extension) to test locally.",
    "usage": "1. Install 'Dot Ignorer' from the Visual Studio Marketplace or run the extension in the Extension Development Host.\n2. Open your project workspace in VS Code.\n3. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P).\n4. Run: `Dot Ignorer: Create git ignore` (or `Create git ignore`).\n5. Choose a template from the quick pick list.\n6. Confirm overwrite if a `.gitignore` already exists.\n7. The selected template content will be added to `.gitignore` at the workspace root.",
    "contributing": "To add a new template:\n1. Add a `<YourTemplateName>.gitignore` file to `src/templates/`.\n2. Add the template name to the template list in `src/lib/options.ts`.\n3. Submit a pull request with your changes. See CONTRIBUTING.md for details (if present)."
  },
  "repoNotes": {
    "homepage": "https://marketplace.visualstudio.com/items/?itemName=wazeerc.dot-ignorer",
    "license": "MIT License",
    "languageComposition": [
      { "name": "TypeScript", "percent": 80.1 },
      { "name": "JavaScript", "percent": 19.9 }
    ],
    "created": "2025-07-23",
    "updated": "2025-07-30",
    "sizeKB": 2341,
    "topics": [
      "collaborate",
      "gitignore",
      "utility",
      "vscode-extension"
    ],
    "releaseNotes": [
      {
        "version": "0.0.1",
        "notes": "Initial version. Command registered: dot-ignorer.createGitignore. Basic template generation."
      },
      { "version": "0.0.2", "notes": "Project renamed to dot-ignorer." },
      { "version": "0.0.3", "notes": "Fixed issue where template files were not found when installed from the Marketplace." }
    ],
    "maintainers": [
      "wazeerc (original author)",
      "prathamhanda (contributor / fork maintainer)",
      "zahntheo (contributor)"
    ],
    "notes": "README highlights a zero-config UX and clear instructions for adding templates. Known historical issue (templates not being found when installed from the marketplace) was resolved in v0.0.3. The extension targets modern VS Code versions and recommends Node.js for development."
  }
},
];
