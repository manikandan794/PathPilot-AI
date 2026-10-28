export const INITIAL_DOMAINS = [
  {
    id: "domain-web-dev",
    title: "Web Development",
    slug: "web-development",
    description: "Modern full-stack web engineering with React, TypeScript, Next.js, and scalable cloud architectures.",
    icon: "Globe",
    badge: "Most Popular",
    color: "#B7F36B",
    estimated_duration: "14 Weeks",
    is_active: true,
  },
  {
    id: "domain-ai-ml",
    title: "Artificial Intelligence & ML",
    slug: "ai-machine-learning",
    description: "Deep learning, LLMs, prompt engineering, agentic workflows, PyTorch, and generative AI systems.",
    icon: "Brain",
    badge: "Trending",
    color: "#A78BFA",
    estimated_duration: "16 Weeks",
    is_active: true,
  },
  {
    id: "domain-data-science",
    title: "Data Science & Analytics",
    slug: "data-science",
    description: "Statistical modeling, Python, BigQuery, data visualization, and predictive decision systems.",
    icon: "BarChart3",
    badge: "High Demand",
    color: "#FF914D",
    estimated_duration: "12 Weeks",
    is_active: true,
  },
  {
    id: "domain-cloud-devops",
    title: "Cloud Computing & DevOps",
    slug: "cloud-devops",
    description: "AWS, GCP, Docker, Kubernetes, CI/CD pipelines, and Infrastructure as Code with Terraform.",
    icon: "Cloud",
    badge: "Enterprise",
    color: "#FDE047",
    estimated_duration: "12 Weeks",
    is_active: true,
  },
  {
    id: "domain-cybersecurity",
    title: "Cybersecurity & Defenses",
    slug: "cybersecurity",
    description: "Network security, ethical hacking, SOC monitoring, zero-trust architectures, and penetration testing.",
    icon: "ShieldAlert",
    badge: "Critical",
    color: "#B7F36B",
    estimated_duration: "14 Weeks",
    is_active: true,
  },
  {
    id: "domain-ui-ux",
    title: "UI/UX & Product Design",
    slug: "ui-ux-design",
    description: "Design systems, Figma mastery, user research, wireframing, micro-interactions, and accessibility.",
    icon: "Palette",
    badge: "Creative",
    color: "#A78BFA",
    estimated_duration: "10 Weeks",
    is_active: true,
  },
  {
    id: "domain-python",
    title: "Python Programming",
    slug: "python-programming",
    description: "From syntax fundamentals to object-oriented programming, data structures, and automation scripting.",
    icon: "Code2",
    badge: "Foundational",
    color: "#FF914D",
    estimated_duration: "8 Weeks",
    is_active: true,
  },
  {
    id: "domain-sql-db",
    title: "SQL & Database Engineering",
    slug: "sql-databases",
    description: "Relational database design, query optimization, indexing, PostgreSQL, and distributed storage.",
    icon: "Database",
    badge: "Core Skill",
    color: "#FDE047",
    estimated_duration: "8 Weeks",
    is_active: true,
  }
];

export const INITIAL_MODULES = [
  // Web Dev Beginner Path
  {
    id: "mod-web-01",
    path_id: "path-web-beginner",
    domain_id: "domain-web-dev",
    order_index: 1,
    title: "Modern HTML5 & Semantic Web Architecture",
    description: "Master document structure, accessibility (WCAG), microdata, and SEO-compliant semantics.",
    estimated_hours: 12,
    skills_taught: ["HTML5", "Accessibility", "SEO", "Semantic Elements"],
    passing_score: 80,
    lessons: [
      {
        id: "les-web-01-01",
        title: "Semantic Elements & DOM Tree Structure",
        content: `### Semantic Elements in Modern Web Development
HTML5 semantic elements clearly describe their meaning to both the browser and the developer.
Tags such as \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, and \`<footer>\` create a structured document outline.

#### Why Semantics Matter:
1. **Accessibility (a11y)**: Screen readers use semantic landmarks to allow assistive tech users to jump directly between page sections.
2. **SEO Optimization**: Search engine crawlers parse your heading hierarchy (\`<h1>\` through \`<h6>\`) and landmark tags to deduce page topic relevance.
3. **Maintainability**: Clean semantic markup replaces confusing 'div soup' with readable, self-documenting code.`,
        code_example: `<!-- Accessible Header Landmark -->
<header role="banner" class="site-header">
  <div class="logo">PathPilot AI</div>
  <nav aria-label="Main Navigation">
    <ul>
      <li><a href="#dashboard">Dashboard</a></li>
      <li><a href="#curriculum">Curriculum</a></li>
    </ul>
  </nav>
</header>`,
        resources: [
          { title: "MDN Semantic HTML", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics" },
          { title: "W3C Accessibility Guidelines", url: "https://www.w3.org/WAI/standards-guidelines/wcag/" }
        ]
      },
      {
        id: "les-web-01-02",
        title: "Forms, Validation & User Input Security",
        content: `### Robust Forms & Client-Side Verification
Modern forms must be accessible, responsive, and provide immediate validation feedback without degrading user experience. Always pair \`<label for="id">\` explicitly with inputs.`,
        code_example: `<form id="authForm" novalidate>
  <label for="userEmail">Professional Email</label>
  <input type="email" id="userEmail" required autocomplete="email" aria-describedby="emailHelp" />
  <span id="emailHelp" class="hint">We'll never share your email with third parties.</span>
  <button type="submit">Continue Journey</button>
</form>`,
        resources: [
          { title: "MDN Form Validation", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation" }
        ]
      }
    ],
    quiz: {
      id: "quiz-web-01",
      title: "Semantic HTML & Accessibility Check",
      passing_percentage: 80,
      questions: [
        {
          id: "q-web-01-1",
          question: "Which HTML5 element represents the dominant content unit of a page and should only occur once per document?",
          options: ["<section>", "<article>", "<main>", "<content>"],
          correct_index: 2,
          explanation: "<main> specifies the main content of the document. The content inside <main> should be unique to the document and must not occur more than once."
        },
        {
          id: "q-web-01-2",
          question: "How should an accessible form input be linked to its corresponding label?",
          options: [
            "By nesting the label inside the input element",
            "By matching the label's 'for' attribute to the input's 'id'",
            "By setting the input's class name to 'labeled'",
            "Labels and inputs are matched automatically by line order"
          ],
          correct_index: 1,
          explanation: "The 'for' attribute on a <label> must match the exact 'id' value of the target <input> to establish an accessible programmatic association."
        },
        {
          id: "q-web-01-3",
          question: "Why should you avoid using <div> elements for clickable actions instead of <button>?",
          options: [
            "<div> tags do not receive native keyboard focus (Tab/Enter/Space) and lack button accessibility roles",
            "<div> tags load slower than <button> tags",
            "CSS cannot style <div> elements with hover states",
            "Browsers automatically reject JavaScript click handlers on <div> elements"
          ],
          correct_index: 0,
          explanation: "<button> comes with built-in keyboard navigation (Tab focus, Enter/Space activation) and correct ARIA roles without manual scripting."
        }
      ]
    }
  },
  {
    id: "mod-web-02",
    path_id: "path-web-beginner",
    domain_id: "domain-web-dev",
    order_index: 2,
    title: "CSS3 Mastery, Flexbox & Responsive Grid",
    description: "Build adaptive, pixel-perfect layouts using modern CSS Flexbox, Grid, container queries, and CSS custom properties.",
    estimated_hours: 14,
    skills_taught: ["CSS Grid", "Flexbox", "Responsive Design", "CSS Variables"],
    passing_score: 80,
    lessons: [
      {
        id: "les-web-02-01",
        title: "Two-Dimensional Layouts with CSS Grid",
        content: `### The Power of CSS Grid
CSS Grid gives you full two-dimensional control over rows and columns simultaneously. Combine \`repeat(auto-fit, minmax(280px, 1fr))\` for fluid responsive cards without media queries!`,
        code_example: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}`,
        resources: [{ title: "CSS Tricks Complete Guide to Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" }]
      }
    ],
    quiz: {
      id: "quiz-web-02",
      title: "Responsive Layouts & Grid Assessment",
      passing_percentage: 80,
      questions: [
        {
          id: "q-web-02-1",
          question: "What CSS property and value combination creates a grid column track that automatically wraps items when space is limited?",
          options: [
            "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
            "grid-auto-flow: wrap-reverse",
            "columns: auto-columns 100%",
            "grid-template-rows: auto-fit"
          ],
          correct_index: 0,
          explanation: "repeat(auto-fit, minmax(250px, 1fr)) creates dynamic columns that adapt to container width without hardcoded breakpoints."
        },
        {
          id: "q-web-02-2",
          question: "Which Flexbox property aligns items along the cross axis?",
          options: ["justify-content", "align-items", "flex-direction", "align-content"],
          correct_index: 1,
          explanation: "'align-items' aligns flex items along the cross axis, whereas 'justify-content' aligns items along the main axis."
        }
      ]
    }
  },
  {
    id: "mod-web-03",
    path_id: "path-web-beginner",
    domain_id: "domain-web-dev",
    order_index: 3,
    title: "JavaScript Core, Async/Await & Event Loop",
    description: "Deep dive into JS runtime, closures, promises, async microtask queues, and DOM interaction.",
    estimated_hours: 18,
    skills_taught: ["JavaScript ES6+", "Async/Await", "Event Loop", "Closures"],
    passing_score: 80,
    lessons: [
      {
        id: "les-web-03-01",
        title: "Promises and Concurrent API Orchestration",
        content: `### Non-Blocking Asynchronous JavaScript
Mastering \`Promise.allSettled()\`, \`async/await\`, and handling network errors gracefully ensures your web app remains responsive under unstable connections.`,
        code_example: `async function fetchPlatformData() {
  try {
    const response = await fetch('/api/analytics');
    if (!response.ok) throw new Error('Network response failed: ' + response.status);
    return await response.json();
  } catch (err) {
    console.error('Data sync failed:', err);
    return null;
  }
}`,
        resources: [{ title: "MDN Async Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" }]
      }
    ],
    quiz: {
      id: "quiz-web-03",
      title: "JavaScript Asynchronous Execution Quiz",
      passing_percentage: 80,
      questions: [
        {
          id: "q-web-03-1",
          question: "Where do resolved Promise callbacks get queued in the JavaScript Event Loop?",
          options: ["Macrotask queue", "Microtask queue", "Call stack immediately", "Render pipeline"],
          correct_index: 1,
          explanation: "Resolved Promises are placed in the Microtask queue, which is drained completely before the next Macrotask (e.g., setTimeout) is executed."
        }
      ]
    }
  },
  {
    id: "mod-web-04",
    path_id: "path-web-beginner",
    domain_id: "domain-web-dev",
    order_index: 4,
    title: "React & Component Architecture",
    description: "Component lifecycle, custom hooks, state management, memoization, and component composition.",
    estimated_hours: 20,
    skills_taught: ["React", "Custom Hooks", "State Management", "Performance"],
    passing_score: 80,
    lessons: [
      {
        id: "les-web-04-01",
        title: "Building Resilient Custom Hooks",
        content: `### Custom Hook Encapsulation
Extract reusable business and data fetching logic into self-contained React hooks to separate concerns cleanly between UI presentation and state management.`,
        code_example: `function useOnlinePresence(userId: string) {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/auth/heartbeat', { method: 'POST' });
    }, 45000);
    return () => clearInterval(interval);
  }, [userId]);
  return isOnline;
}`,
        resources: [{ title: "React Official Docs", url: "https://react.dev" }]
      }
    ],
    quiz: {
      id: "quiz-web-04",
      title: "React Hooks & State Architecture",
      passing_percentage: 80,
      questions: [
        {
          id: "q-web-04-1",
          question: "When does the cleanup function returned by useEffect execute?",
          options: [
            "Only when the browser window closes",
            "Before re-running the effect on dependency change and when unmounting",
            "Simultaneously with every component render",
            "Only on the first render"
          ],
          correct_index: 1,
          explanation: "Effect cleanup runs before re-invoking the effect when dependencies change, and during component unmount to prevent memory leaks."
        }
      ]
    }
  },

  // AI & ML Pathway
  {
    id: "mod-ai-01",
    path_id: "path-ai-beginner",
    domain_id: "domain-ai-ml",
    order_index: 1,
    title: "Foundations of Machine Learning & Python Numerical Stack",
    description: "NumPy, Pandas, Vectorized Computations, Linear Algebra for ML, and Supervised Learning pipelines.",
    estimated_hours: 15,
    skills_taught: ["Python", "NumPy", "Pandas", "Scikit-Learn"],
    passing_score: 80,
    lessons: [
      {
        id: "les-ai-01-01",
        title: "Matrix Operations & Feature Scaling",
        content: `### Vectorized Math with NumPy
Feature scaling ensures gradient descent converges rapidly. Standardize features to mean=0 and variance=1 before feeding into linear models.`,
        code_example: `import numpy as np

def standardize(X):
    mean = np.mean(X, axis=0)
    std = np.std(X, axis=0)
    return (X - mean) / (std + 1e-8)`,
        resources: [{ title: "NumPy Documentation", url: "https://numpy.org/doc/" }]
      }
    ],
    quiz: {
      id: "quiz-ai-01",
      title: "Machine Learning Math & Numerical Processing",
      passing_percentage: 80,
      questions: [
        {
          id: "q-ai-01-1",
          question: "Why is feature scaling crucial for gradient-based optimization algorithms?",
          options: [
            "It prevents gradient descent from oscillating wildly across asymmetric cost surfaces",
            "It turns continuous data into categorical integers",
            "It guarantees 100% accuracy on the test set",
            "It deletes missing values from the dataset"
          ],
          correct_index: 0,
          explanation: "When features have vastly different scales, the loss surface resembles an elongated ellipse, causing gradient descent to bounce inefficiently. Scaling creates symmetric contours."
        }
      ]
    }
  },
  {
    id: "mod-ai-02",
    path_id: "path-ai-beginner",
    domain_id: "domain-ai-ml",
    order_index: 2,
    title: "Large Language Models & Agentic Architecture",
    description: "Transformer attention mechanisms, RAG (Retrieval Augmented Generation), prompt engineering, and tool-augmented agents.",
    estimated_hours: 22,
    skills_taught: ["LLMs", "RAG", "Embeddings", "Agentic Systems"],
    passing_score: 80,
    lessons: [
      {
        id: "les-ai-02-01",
        title: "Retrieval Augmented Generation & Vector Embeddings",
        content: `### Grounding Generative Models
RAG augments LLMs with private, verified knowledge bases. We vectorize documents into dense semantic embeddings and perform cosine similarity search via vector indexes.`,
        code_example: `// Example Vector Distance Calculation
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
}`,
        resources: [{ title: "Attention Is All You Need Paper", url: "https://arxiv.org/abs/1706.03762" }]
      }
    ],
    quiz: {
      id: "quiz-ai-02",
      title: "LLM, Embeddings & RAG Architecture Quiz",
      passing_percentage: 80,
      questions: [
        {
          id: "q-ai-02-1",
          question: "What is the primary benefit of Retrieval-Augmented Generation (RAG) over fine-tuning for factual query answering?",
          options: [
            "RAG provides real-time verifiable document grounding without expensive retraining and reduces hallucinations",
            "RAG makes the model run without an internet connection",
            "RAG permanently rewrites the transformer weights",
            "RAG guarantees zero token consumption"
          ],
          correct_index: 0,
          explanation: "RAG retrieves factual chunks at query time, passing them in-context so the model can cite exact sources without model retraining."
        }
      ]
    }
  }
];

export const CAREER_ACCELERATOR_ROLES = [
  {
    id: "role-frontend-eng",
    title: "Frontend Engineer",
    domain_id: "domain-web-dev",
    salary_range: "$95,000 - $145,000",
    experience_level: "Mid-Level (1-3 yrs)",
    required_skills: [
      "React", "TypeScript", "Tailwind CSS", "Next.js", "State Management", 
      "Web Performance (CWV)", "REST & GraphQL", "Unit Testing (Jest/Vitest)"
    ],
    top_hiring_companies: ["Stripe", "Airbnb", "Vercel", "Shopify", "Linear"],
    key_projects: [
      "Collaborative Kanban Board with Optimistic UI & WebSockets",
      "High-Performance Analytics Dashboard with Virtualized Tables",
      "E-Commerce Checkout Engine with Sub-Second LCP & Accessibility"
    ]
  },
  {
    id: "role-fullstack-eng",
    title: "Full Stack Engineer",
    domain_id: "domain-web-dev",
    salary_range: "$110,000 - $165,000",
    experience_level: "Mid-Senior (2-5 yrs)",
    required_skills: [
      "Node.js", "React/TypeScript", "PostgreSQL", "REST/GraphQL APIs", 
      "Docker", "Redis Caching", "Authentication & Security", "CI/CD"
    ],
    top_hiring_companies: ["GitHub", "Datadog", "Coinbase", "Atlassian", "Figma"],
    key_projects: [
      "Multi-Tenant SaaS with RBAC Permissions and Billing System",
      "Real-time Collaboration Platform with Event-Driven Architecture",
      "Automated Workflow Engine with Queue Workers and Webhooks"
    ]
  },
  {
    id: "role-ai-engineer",
    title: "AI / LLM Application Engineer",
    domain_id: "domain-ai-ml",
    salary_range: "$130,000 - $190,000",
    experience_level: "Mid-Level (1-4 yrs)",
    required_skills: [
      "Python", "LangChain/LlamaIndex", "Vector Databases", "Prompt Engineering", 
      "FastAPI", "Evaluation Frameworks", "Fine-Tuning", "Agentic Workflows"
    ],
    top_hiring_companies: ["OpenAI", "Anthropic", "Scale AI", "Perplexity", "Google Cloud"],
    key_projects: [
      "Enterprise Multi-Agent Customer Support System with Tool Calling",
      "Multi-Modal Document Intelligence & RAG Pipeline with Hybrid Search",
      "Synthetic Data Generation & Automated Model Evaluation Harness"
    ]
  },
  {
    id: "role-cloud-devops",
    title: "Cloud & DevOps Engineer",
    domain_id: "domain-cloud-devops",
    salary_range: "$115,000 - $170,000",
    experience_level: "Mid-Senior (2-5 yrs)",
    required_skills: [
      "AWS / GCP", "Kubernetes (K8s)", "Terraform (IaC)", "Docker", 
      "GitHub Actions CI/CD", "Prometheus & Grafana", "Linux System Administration", "Networking"
    ],
    top_hiring_companies: ["Amazon AWS", "HashiCorp", "Cloudflare", "Netflix", "Snowflake"],
    key_projects: [
      "Zero-Downtime Blue/Green Kubernetes Deployment on AWS EKS with Terraform",
      "Observability Stack with Distributed Tracing and Automated Alerts",
      "Secure Multi-Stage Container Pipeline with Vulnerability Scanning"
    ]
  },
  {
    id: "role-data-scientist",
    title: "Data Scientist",
    domain_id: "domain-data-science",
    salary_range: "$105,000 - $160,000",
    experience_level: "Mid-Level (2-4 yrs)",
    required_skills: [
      "Python", "SQL (Advanced)", "Pandas & NumPy", "Statistical Testing", 
      "Machine Learning Algorithms", "Data Visualization", "BigQuery / Snowflake", "A/B Testing"
    ],
    top_hiring_companies: ["Uber", "Spotify", "Meta", "DoorDash", "Palantir"],
    key_projects: [
      "Customer Churn Prediction Engine with Feature Importance Explanations",
      "Dynamic Pricing & Demand Elasticity Forecasting Pipeline",
      "Automated A/B Testing Evaluation Platform with Bayesian Statistics"
    ]
  }
];

export const MOCK_INTERVIEW_QUESTIONS = [
  {
    role: "Full Stack Engineer",
    difficulty: "Mid-Level",
    question: "Explain how you would design a rate limiter for an authenticated REST API handling millions of daily requests. What data structures and caching mechanisms would you use?",
    rubric: {
      key_points: [
        "Mention of Token Bucket or Sliding Window algorithm",
        "Use of Redis with atomic operations (INCR, EXPIRE or Lua scripts)",
        "Handling edge cases like distributed clocks or race conditions",
        "Returning proper HTTP status code 429 Too Many Requests with Retry-After header"
      ],
      sample_answer: "A production rate limiter typically uses Redis with a Sliding Window Log or Token Bucket algorithm. Using Redis Lua scripts guarantees atomic incrementation of request timestamps or tokens, preventing race conditions. When the limit is exceeded, return HTTP 429 with standard headers: X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After."
    }
  },
  {
    role: "Frontend Engineer",
    difficulty: "Mid-Level",
    question: "How do you diagnose and optimize slow Largest Contentful Paint (LCP) and high Interaction to Next Paint (INP) in a React single-page application?",
    rubric: {
      key_points: [
        "Identifying LCP element using Chrome DevTools Performance panel",
        "Optimizing LCP: fetchpriority='high', preloading hero images, critical CSS inlining",
        "Diagnosing INP: identifying long tasks (>50ms) blocking the main thread",
        "Optimizing INP: code splitting, debouncing handlers, useTransition or requestIdleCallback"
      ],
      sample_answer: "To optimize LCP, identify the candidate element (usually a hero image or H1). Ensure images are served in modern formats (WebP/AVIF), add fetchpriority='high', and eliminate render-blocking scripts. For INP, use DevTools to find tasks exceeding 50ms on the main thread, break them down using useTransition or Web Workers, and defer non-critical DOM updates."
    }
  },
  {
    role: "AI / LLM Application Engineer",
    difficulty: "Advanced",
    question: "How do you evaluate and mitigate hallucinations in a production RAG (Retrieval Augmented Generation) system?",
    rubric: {
      key_points: [
        "Evaluation frameworks like Ragas, TruLens, or LLM-as-a-judge",
        "Metrics: Faithfulness (is the answer grounded in context) and Answer Relevance",
        "Mitigation: Re-ranking retrieved chunks with cross-encoders, strict prompt instructions, confidence thresholds",
        "Enforcing citations and fallback logic when no context matches"
      ],
      sample_answer: "Mitigating hallucinations requires a multi-tier approach: first, utilize a reranker (e.g. Cohere or BGE Cross-Encoder) to ensure only top relevant context is passed. Second, employ strict system prompts instructing the model to declare 'I do not have sufficient information' if the answer isn't in context. Third, measure Faithfulness and Context Relevance continuously via automated evaluation pipelines like Ragas."
    }
  }
];

export const CROSS_DOMAIN_TRANSITIONS = [
  {
    id: "trans-hardware-to-software",
    source_domain: "Hardware Engineering",
    source_roles: ["Hardware Engineer", "Electronics Engineer", "PCB Designer"],
    target_domain: "Software Engineering",
    target_roles: ["Embedded Software Engineer", "Full Stack Developer", "Systems Programmer"],
    transferable_skills: [
      "Boolean Logic & Digital Architecture",
      "Debugging & Signal Analysis (Mental model for root-cause analysis)",
      "Low-level memory awareness (Registers, Buses, C/Assembly basics)",
      "Hardware-software communication protocols (SPI, I2C, UART)",
      "Rigorous testing and specification verification"
    ],
    missing_skills: [
      "Modern Web Frameworks (React, TypeScript)",
      "Relational & NoSQL Database Design",
      "RESTful API & Microservices Architecture",
      "Git collaborative workflows & CI/CD",
      "Asynchronous programming & Cloud deployment"
    ],
    estimated_weeks: 16,
    career_ladder: [
      { stage: "Baseline", title: "Hardware Engineer", focus: "Circuit design, board testing, firmware flashing" },
      { stage: "Milestone 1", title: "Firmware / Embedded Developer", focus: "C++, RTOS, microcontroller interfacing, Git" },
      { stage: "Milestone 2", title: "IoT / Systems Engineer", focus: "Node.js, MQTT/WebSockets, backend APIs, edge computing" },
      { stage: "Target Role", title: "Full Stack / Systems Software Engineer", focus: "Cloud integration, React, distributed microservices" }
    ],
    portfolio_projects: [
      {
        title: "IoT Telemetry Dashboard",
        description: "Connect physical microcontrollers (ESP32/Raspberry Pi) via MQTT to a Node.js/PostgreSQL backend with a real-time React dashboard."
      },
      {
        title: "Firmware Flashing Web Serial Tool",
        description: "Browser-based tool utilizing Web Serial API to configure, flash, and monitor embedded devices directly over USB."
      }
    ],
    resume_strategy: "Highlight low-level understanding of performance, memory constraints, and end-to-end device integration. Frame hardware debugging as deep technical problem-solving."
  },
  {
    id: "trans-mech-to-software",
    source_domain: "Mechanical Engineering",
    source_roles: ["Mechanical Engineer", "CAD Designer", "HVAC Engineer", "Manufacturing Engineer"],
    target_domain: "Software Development & Data",
    target_roles: ["Data Analyst / Engineer", "Full Stack Developer", "Simulation Software Engineer"],
    transferable_skills: [
      "Mathematical modeling & calculus",
      "Parametric design & algorithmic logic (from CAD/FEA scripting)",
      "Quality assurance & tolerance analysis",
      "Root cause analysis and physical system troubleshooting",
      "Project management and cross-functional vendor coordination"
    ],
    missing_skills: [
      "Python / JavaScript object-oriented programming",
      "SQL data querying and ETL pipelining",
      "Web interfaces and API development",
      "Cloud services (AWS / BigQuery)",
      "Version control with Git & GitHub"
    ],
    estimated_weeks: 18,
    career_ladder: [
      { stage: "Baseline", title: "Mechanical Engineer", focus: "CAD, FEA, mechanical testing" },
      { stage: "Milestone 1", title: "Automation & Scripting Specialist", focus: "Python, automation scripts, SQL queries" },
      { stage: "Milestone 2", title: "Data Analyst / Junior Developer", focus: "Data pipelines, Tableau/Dash, REST APIs" },
      { stage: "Target Role", title: "Software Engineer / Data Engineer", focus: "Full stack engineering or scalable ETL platforms" }
    ],
    portfolio_projects: [
      {
        title: "Predictive Maintenance Pipeline",
        description: "Ingest sensor vibration data, process with Python/Pandas, detect anomaly spikes, and visualize machine health in a React web app."
      },
      {
        title: "Automated BOM & Inventory Tracker",
        description: "Web application linking engineering bills of materials to live parts inventory with search, cost optimization, and exports."
      }
    ],
    resume_strategy: "Translate CAD scripting and FEA data modeling into computational programming experience. Position domain knowledge as a unique advantage in industrial software/IoT."
  },
  {
    id: "trans-itsupport-to-cloudcyber",
    source_domain: "IT Support & System Administration",
    source_roles: ["IT Support Specialist", "Helpdesk Technician", "Desktop Support"],
    target_domain: "Cloud & Cybersecurity",
    target_roles: ["Cloud Engineer", "Cybersecurity Analyst", "DevOps Engineer"],
    transferable_skills: [
      "TCP/IP, DNS, DHCP, Subnetting network fundamentals",
      "Active Directory & Identity Management (IAM basics)",
      "Operating system internals (Windows Server, Linux bash)",
      "Hardware and network troubleshooting under SLA pressure",
      "Security compliance and user permission management"
    ],
    missing_skills: [
      "Infrastructure as Code (Terraform, CloudFormation)",
      "Containerization (Docker & Kubernetes)",
      "Cloud platform architecture (AWS/GCP/Azure deep dive)",
      "Scripting for automation (Python, Advanced Bash, PowerShell)",
      "SIEM tools (Splunk, Elastic) and Incident Response frameworks"
    ],
    estimated_weeks: 14,
    career_ladder: [
      { stage: "Baseline", title: "IT Support Specialist", focus: "Ticket resolution, user provisioning, endpoint hardware" },
      { stage: "Milestone 1", title: "Junior Systems / Cloud Admin", focus: "Linux CLI, AWS core services (EC2, S3, IAM), Python" },
      { stage: "Milestone 2", title: "Associate Cloud / Security Analyst", focus: "Docker, Terraform, security groups, log monitoring" },
      { stage: "Target Role", title: "Cloud DevOps Engineer / SOC Analyst", focus: "CI/CD automation, Kubernetes, automated threat defense" }
    ],
    portfolio_projects: [
      {
        title: "Automated Multi-Tier AWS Infrastructure",
        description: "Deploy a VPC with public/private subnets, Auto-Scaling Group, and Application Load Balancer entirely defined in Terraform code."
      },
      {
        title: "Cloud Threat Detection & Alerting Pipeline",
        description: "Stream AWS CloudTrail logs to CloudWatch, trigger Lambda alert functions on suspicious IAM modifications, and notify via Slack."
      }
    ],
    resume_strategy: "Reframe helpdesk troubleshooting into incident triage and system reliability. Highlight foundational networking and IAM access management expertise."
  },
  {
    id: "trans-nonit-to-data",
    source_domain: "Business / Finance / Non-IT",
    source_roles: ["Financial Analyst", "Operations Specialist", "Marketing Coordinator", "Educator"],
    target_domain: "Data & Tech",
    target_roles: ["Data Analyst", "Business Intelligence Engineer", "Product Operations Specialist"],
    transferable_skills: [
      "Domain business acumen & KPI interpretation",
      "Stakeholder communication & storytelling",
      "Excel mastery (pivot tables, complex formulas, financial modeling)",
      "Requirement gathering and workflow optimization",
      "Critical thinking and structured reasoning"
    ],
    missing_skills: [
      "Advanced SQL (Window functions, CTEs, indexing)",
      "Python for data analysis (Pandas, Matplotlib, Seaborn)",
      "Modern BI tools (PowerBI, Tableau, Looker)",
      "Database schema design and normalization",
      "Statistical hypothesis testing and A/B test analysis"
    ],
    estimated_weeks: 12,
    career_ladder: [
      { stage: "Baseline", title: "Business / Finance Analyst", focus: "Spreadsheets, reporting, departmental KPIs" },
      { stage: "Milestone 1", title: "Data Reporter & SQL Specialist", focus: "PostgreSQL queries, relational schema mapping" },
      { stage: "Milestone 2", title: "BI Dashboard Developer", focus: "Automated PowerBI/Tableau dashboards, Python ETL" },
      { stage: "Target Role", title: "Professional Data Analyst", focus: "Predictive modeling, cross-functional analytics, SQL optimization" }
    ],
    portfolio_projects: [
      {
        title: "Executive Revenue & Cohort Retention Engine",
        description: "Transform 500k rows of transaction data into clean SQL models, calculate monthly recurring revenue (MRR) and cohort churn, and build an interactive KPI dashboard."
      },
      {
        title: "Customer Sentiment & Social Impact Analyzer",
        description: "Scrape feedback reviews, run sentiment analysis using Python NLP, and deliver actionable product recommendations."
      }
    ],
    resume_strategy: "Position business context as your superpower. Engineers often lack business intuition; highlight how your data insights directly drive revenue and operational savings."
  }
];
