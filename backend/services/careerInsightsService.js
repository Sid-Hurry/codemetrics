const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class CareerInsightsService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = 'gemini-1.5-flash';
  }

  isConfigured() {
    return !!this.apiKey && this.apiKey !== 'placeholder_key_replace_me';
  }

  async generateCareerInsights(profile) {
    if (!this.isConfigured()) {
      console.warn('⚠️ GEMINI_API_KEY is not set. Generating fallback career insights...');
      return this.getFallbackCareerInsights(profile);
    }

    const prompt = `
      You are an expert technical career advisor, engineering mentor, and project recommendation engine.
      Analyze the following GitHub developer profile metrics and repository data:
      
      Developer Info:
      - Username: ${profile.username}
      - Name: ${profile.name || 'N/A'}
      - Bio: ${profile.bio || 'N/A'}
      - Location: ${profile.location || 'N/A'}
      
      Repository Statistics:
      - Total Stars: ${profile.total_stars}
      - Total Forks: ${profile.total_forks}
      - Public Repos: ${profile.public_repos}
      - Top Languages: ${profile.top_languages}
      - Language Distribution: ${JSON.stringify(profile.language_distribution)}
      - Developer Score: ${profile.developer_score}
      - Profile Completeness: ${profile.profile_completeness_score}%
      
      Based on this developer's profile, generate the following career report details. You are encouraged to include relevant emojis inside descriptions, explanations, roadmaps, and suggestions to make the advice engaging, as the UI will render them in a professional black and white style:
      1. Current Level: An assessment of their experience level (e.g. 'Junior Developer', 'Mid-level Developer', 'Senior Developer', 'Tech Lead').
      2. Career Path: A recommended career trajectory (e.g. 'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer', 'Mobile Developer', 'Data Engineer').
      3. Skill Gaps: An array of missing skills/concepts they should master based on their target career path. Each skill gap should specify the skill name, category (e.g. 'Frontend', 'Backend', 'DevOps', 'Architecture'), importance ('High' or 'Medium'), and a specific reason why they need it.
      4. Learning Roadmap: A structured timeline/roadmap consisting of 3 to 4 sequential milestones/steps to level up. Each milestone should specify the milestone title, estimated duration, list of key topics to cover, and recommended resources or study methods.
      5. Recommended Projects: Exactly 5 growth-oriented project recommendations that help bridge their skill gaps. Each project must contain:
         - name: A specific, creative project title.
         - description: A detailed description of the project and what it does.
         - difficulty: 'Intermediate' or 'Advanced'.
         - tech_stack: An array of technologies they should use (including new ones they need to learn).
         - learning_outcome: What architectural/coding concept they will learn.
         - relevance: Explaining how this specific project bridges their skill gaps or boosts their profile.
      6. Career Recommendations: A final summary object containing:
         - confidence: An integer between 1 and 100 representing your rating of their readiness for this path.
         - explanation: A concise, professional paragraph explaining why this career path is recommended for them.
         - suggestions: An array of 3 actionable career growth tips (e.g., networking, open source, system design preparation).

      Return the response in the following strict JSON schema:
      {
        "current_level": "String",
        "career_path": "String",
        "skill_gaps": [
          {
            "skill": "String",
            "category": "String",
            "importance": "String",
            "reason": "String"
          }
        ],
        "learning_roadmap": [
          {
            "milestone": "String",
            "estimated_time": "String",
            "topics": ["String", ...],
            "resources": ["String", ...]
          }
        ],
        "recommended_projects": [
          {
            "name": "String",
            "description": "String",
            "difficulty": "String",
            "tech_stack": ["String", ...],
            "learning_outcome": "String",
            "relevance": "String"
          }
        ],
        "career_recommendations": {
          "confidence": Integer,
          "explanation": "String",
          "suggestions": ["String", ...]
        }
      }

      Ensure that you return EXACTLY 5 recommended projects in the array. Ensure the response is valid JSON and strictly contains only the requested fields.
    `;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      };

      const response = await axios.post(url, payload, { timeout: 20000 });
      
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]
      ) {
        const jsonText = response.data.candidates[0].content.parts[0].text;
        const insights = JSON.parse(jsonText);
        
        // Basic schema verification
        if (
          insights.current_level &&
          insights.career_path &&
          Array.isArray(insights.skill_gaps) &&
          Array.isArray(insights.learning_roadmap) &&
          Array.isArray(insights.recommended_projects) &&
          insights.career_recommendations
        ) {
          // Ensure exactly 5 projects or pad it
          if (insights.recommended_projects.length !== 5) {
            console.warn(`Gemini returned ${insights.recommended_projects.length} projects. Adjusting to 5.`);
            insights.recommended_projects = insights.recommended_projects.slice(0, 5);
            while (insights.recommended_projects.length < 5) {
              insights.recommended_projects.push({
                name: 'Scalable Microservices Gateway',
                description: 'Build an API Gateway to route client requests to different underlying services with rate limiting, logging, and JWT authentication.',
                difficulty: 'Advanced',
                tech_stack: ['Go', 'Docker', 'Redis', 'gRPC'],
                learning_outcome: 'Understand service discovery, API orchestration, and rate limiting algorithms.',
                relevance: 'Helps master backend scalability and architecture.'
              });
            }
          }
          return insights;
        }
      }

      throw new Error('Gemini API returned an invalid response structure.');
    } catch (error) {
      console.error(`❌ Gemini Career Insights API request failed: ${error.message}`);
      console.log('Generating fallback career insights to ensure uninterrupted service...');
      return this.getFallbackCareerInsights(profile);
    }
  }

  getFallbackCareerInsights(profile) {
    const langs = (profile.top_languages || '').toLowerCase();
    const isFrontend = langs.includes('javascript') || langs.includes('typescript') || langs.includes('html') || langs.includes('css');
    const isBackend = langs.includes('python') || langs.includes('go') || langs.includes('rust') || langs.includes('java') || langs.includes('c#') || langs.includes('php') || langs.includes('ruby');
    const isMobile = langs.includes('swift') || langs.includes('kotlin') || langs.includes('dart');
    const isData = langs.includes('python') || langs.includes('r') || langs.includes('julia');

    let career_path = 'Full Stack Developer';
    let current_level = 'Junior Developer';
    
    if (profile.developer_score > 70) {
      current_level = 'Senior Developer';
    } else if (profile.developer_score > 40) {
      current_level = 'Mid-level Developer';
    }

    if (isFrontend && !isBackend) career_path = 'Frontend Developer';
    else if (isBackend && !isFrontend) career_path = 'Backend Developer';
    else if (isMobile) career_path = 'Mobile Developer';
    else if (isData) career_path = 'Data Engineer';

    // Tailored Skill Gaps, Roadmap, and Projects depending on career path
    let skill_gaps = [];
    let learning_roadmap = [];
    let recommended_projects = [];
    let career_explanation = '';

    if (career_path === 'Frontend Developer') {
      career_explanation = `Based on a strong foundation in JavaScript/TypeScript and Web Technologies, @${profile.username} shows great promise as a Frontend Developer. Focusing on state management, modern styling solutions, and build tooling will accelerate their path.`;
      
      skill_gaps = [
        { skill: 'State Management (Redux/Zustand)', category: 'Frontend', importance: 'High', reason: 'Critical for managing complex client-side application states consistently.' },
        { skill: 'Performance Optimization (Lighthouse/Web Vitals)', category: 'Frontend', importance: 'Medium', reason: 'Optimizing resource loading, code-splitting, and rendering metrics.' },
        { skill: 'End-to-End Testing (Cypress/Playwright)', category: 'Testing', importance: 'Medium', reason: 'Ensures UI interactions remain bug-free across browser engines.' },
        { skill: 'CI/CD for Frontend Assets', category: 'DevOps', importance: 'Medium', reason: 'Automates building, testing, and continuous deployment to CDNs.' }
      ];

      learning_roadmap = [
        { milestone: 'Master Advanced React Concepts & Custom Hooks', estimated_time: '2-3 weeks', topics: ['useMemo/useCallback usage', 'Custom state lifecycle hooks', 'Context API vs Redux Toolkit'], resources: ['React Documentation', 'Frontend Masters Advanced React course'] },
        { milestone: 'Performance Audits & Asset Optimization', estimated_time: '2 weeks', topics: ['Code splitting & lazy loading', 'Image optimization techniques', 'Resource pre-fetching & bundle analysis'], resources: ['web.dev guidelines', 'Webpack/Vite optimization guides'] },
        { milestone: 'Comprehensive Testing Integration', estimated_time: '2 weeks', topics: ['Unit testing components with Jest', 'E2E flows with Playwright', 'Visual regression testing'], resources: ['Testing Library Docs', 'Playwright Tutorial'] }
      ];

      recommended_projects = [
        { name: 'Collaborative Real-time Dashboard', description: 'Create an analytics dashboard using WebSockets that renders real-time data feeds with optimized rendering to prevent layouts thrashing.', difficulty: 'Intermediate', tech_stack: ['React', 'TypeScript', 'Chart.js', 'Socket.io-client'], learning_outcome: 'Real-time state synchronization, WebSocket communication, and responsive layouts.', relevance: 'Demonstrates ability to construct complex data-intensive UIs.' },
        { name: 'E-Commerce Component Library with Storybook', description: 'Design a reusable, accessible component library following W3C WAI-ARIA guidelines, complete with visual testing.', difficulty: 'Intermediate', tech_stack: ['React', 'TypeScript', 'TailwindCSS', 'Storybook', 'Axe Accessibility'], learning_outcome: 'A11y patterns, semantic markup, and component documentation.', relevance: 'Highlights frontend architecture, component reusability, and professional design systems.' },
        { name: 'Offline-First Progressive Web App (PWA)', description: 'Build a task manager that caches assets and requests locally via Service Workers, syncing with a remote backend once online.', difficulty: 'Advanced', tech_stack: ['Vite', 'React', 'Workbox', 'IndexedDB'], learning_outcome: 'Service workers, caching strategies, IndexedDB transactions, and sync events.', relevance: 'Bridges mobile-like frontend interactions and advanced browser storage.' },
        { name: 'Visual CSS/Tailwind Builder', description: 'Create a drag-and-drop landing page builder that emits clean React code containing optimized styles.', difficulty: 'Advanced', tech_stack: ['React', 'HTML5 Drag & Drop API', 'TailwindCSS', 'File System Access API'], learning_outcome: 'Complex state structures, custom tree diffing, and code generation.', relevance: 'Showcases advanced state management and custom tool development.' },
        { name: 'Tailwind Dashboard Template Engine', description: 'An interactive system that allows developers to dynamically generate dashboard layouts using responsive blocks with customizable light/dark themes.', difficulty: 'Intermediate', tech_stack: ['React', 'Vanilla CSS', 'Lucide React'], learning_outcome: 'Responsive flexbox/grid layout design, state persistence, and CSS custom properties.', relevance: 'Strengthens layout composition skills and UI/UX design capabilities.' }
      ];
    } else if (career_path === 'Backend Developer') {
      career_explanation = `With a backend-heavy language signature (e.g. Python, Go, Java), @${profile.username} is suited for server-side engineering. Upgrading database patterns, caching layers, and container configurations will solidify their skills.`;
      
      skill_gaps = [
        { skill: 'Containerization (Docker)', category: 'DevOps', importance: 'High', reason: 'Standardizes runtime environment and deployment targets.' },
        { skill: 'Caching Strategies (Redis)', category: 'Backend', importance: 'High', reason: 'Reduces database query load and response latency for common routes.' },
        { skill: 'System Design & Scalability', category: 'Architecture', importance: 'Medium', reason: 'Planning decoupled services, message queues, and load balancers.' },
        { skill: 'Relational Database Optimization', category: 'Database', importance: 'Medium', reason: 'Writing efficient queries, indexing schemas, and analyzing query plans.' }
      ];

      learning_roadmap = [
        { milestone: 'Database Management & Tuning', estimated_time: '2-3 weeks', topics: ['Index types & execution plans', 'Transaction isolation levels', 'SQL database migrations and pooling'], resources: ['High Performance MySQL', 'Use The Index, Luke'] },
        { milestone: 'Containerization & Docker Basics', estimated_time: '2 weeks', topics: ['Dockerfiles and multi-stage builds', 'Docker Compose multi-container runs', 'Environment configurations'], resources: ['Docker Get Started Guide', 'Docker Deep Dive'] },
        { milestone: 'Caching & Message Queues', estimated_time: '2 weeks', topics: ['Redis key patterns & TTLs', 'In-memory pub-sub', 'Asynchronous job queues (BullMQ/Celery)'], resources: ['Redis University', 'Asynchronous processing docs'] }
      ];

      recommended_projects = [
        { name: 'High-Performance API Gateway', description: 'Design a microservice router that intercepts, authenticates, and forwards requests while handling rate limiting and client logging.', difficulty: 'Advanced', tech_stack: ['Go or Node.js', 'Redis', 'Docker', 'JWT'], learning_outcome: 'Rate limiting algorithms (token bucket), middleware patterns, and gateway routing.', relevance: 'Directly addresses system scalability and high-throughput backend design.' },
        { name: 'Distributed Web Scraper with Message Queue', description: 'Build a scrapers network that queues jobs in Redis, processes them concurrently across nodes, and compiles normalized statistics in MySQL.', difficulty: 'Advanced', tech_stack: ['Python', 'Celery', 'Redis', 'MySQL', 'BeautifulSoup'], learning_outcome: 'Message queue processing, rate throttling, failure handling, and schema design.', relevance: 'Highlights mastery of asynchronous workers, concurrency, and heavy data ingestion.' },
        { name: 'RESTful API with Clean Architecture', description: 'Develop a fully-typed school management API utilizing Clean/Hexagonal Architecture boundaries, dependency injection, and integration tests.', difficulty: 'Intermediate', tech_stack: ['Node.js/TypeScript', 'Express', 'Prisma ORM', 'PostgreSQL', 'Jest'], learning_outcome: 'Clean architecture decoupling, data transfer objects (DTOs), and mock testing.', relevance: 'Demonstrates professional software structure, testing reliability, and database normalization.' },
        { name: 'Real-time Messaging Engine with WebSockets', description: 'Create a chat-based collaboration room server featuring persistence, read receipts, and user presence tracking.', difficulty: 'Intermediate', tech_stack: ['Node.js', 'Socket.io', 'Redis Adapter', 'PostgreSQL'], learning_outcome: 'Horizontal scaling of socket servers, connection pooling, and message structures.', relevance: 'Demonstrates real-time server-side communications and memory optimization.' },
        { name: 'Secure OAuth2 Authorization Server', description: 'Construct a custom identity provider that issues access tokens and refreshes them, implementing OAuth2 authorization code flows.', difficulty: 'Advanced', tech_stack: ['Node.js', 'Express', 'bcrypt', 'JWT', 'MySQL'], learning_outcome: 'Cryptographic hashing, session security, JWT verification, and standard security specifications.', relevance: 'Focuses heavily on backend security, encryption, and standard specifications.' }
      ];
    } else {
      // Default / Full Stack Developer
      career_explanation = `With a balanced profile spanning multiple languages, @${profile.username} is well-suited for a Full Stack Developer role. Enhancing cloud deployments, system integration testing, and clean database patterns is recommended.`;
      
      skill_gaps = [
        { skill: 'Docker Containerization', category: 'DevOps', importance: 'High', reason: 'Essential for running both frontend and backend configurations consistently in dev and prod.' },
        { skill: 'End-to-End Testing (Cypress/Playwright)', category: 'Testing', importance: 'Medium', reason: 'Ensures correct integration between frontend client and backend endpoints.' },
        { skill: 'Caching & Database Tuning', category: 'Database', importance: 'Medium', reason: 'Reduces server load and optimizes database transactions.' },
        { skill: 'System Security (OAuth/JWT)', category: 'Security', importance: 'High', reason: 'Ensures application logic is secure from API vulnerabilities.' }
      ];

      learning_roadmap = [
        { milestone: 'Dockerize the Entire Development Stack', estimated_time: '2 weeks', topics: ['Multi-stage Dockerfiles', 'Docker Compose with client, server, and DB', 'Volume persistence'], resources: ['Docker docs', 'Full Stack Docker tutorials'] },
        { milestone: 'Implement Integration & E2E Tests', estimated_time: '2 weeks', topics: ['Mocking external API dependencies', 'Writing Playwright tests', 'CI workflow setups'], resources: ['Playwright Documentation'] },
        { milestone: 'Advanced API Security & JWT Management', estimated_time: '2 weeks', topics: ['Refresh tokens and cookies', 'CORS configurations', 'CSRF prevention techniques'], resources: ['OWASP Top 10 Guides', 'JWT specifications'] }
      ];

      recommended_projects = [
        { name: 'Full-Stack Developer Portfolio Analytics', description: 'Create a SaaS app tracking profile metrics and displaying automated reports on clean dashboards.', difficulty: 'Advanced', tech_stack: ['React', 'Node.js', 'MySQL', 'Redis', 'Docker'], learning_outcome: 'State sync, data normalization, containerized coordination, and cache management.', relevance: 'Demonstrates full-stack coordination, dashboard rendering, and production-grade architectures.' },
        { name: 'Collaborative Kanban Board', description: 'Create a task management app with real-time drag-and-drop cards, comment sections, and workspace organization dashboards.', difficulty: 'Intermediate', tech_stack: ['React', 'Express', 'Socket.io', 'MongoDB'], learning_outcome: 'State synchronization, real-time channels, and database normalization.', relevance: 'Demonstrates interactive frontend composition and backend persistence.' },
        { name: 'E-Commerce Storefront with Payment Gateway', description: 'Develop a shop dashboard that handles catalogs, cart logic, user sessions, and mock stripe integrations.', difficulty: 'Advanced', tech_stack: ['Next.js', 'Express', 'MySQL', 'Stripe SDK'], learning_outcome: 'Payment flows, webhook validation, server-side rendering, and catalog architectures.', relevance: 'Showcases transaction security, session verification, and API webhooks.' },
        { name: 'Markdown Blogging Engine with CMS', description: 'Build an editor that outputs markdown, stores drafts, publishes with dynamic routing, and implements metadata tags.', difficulty: 'Intermediate', tech_stack: ['React', 'Vite', 'Node.js', 'PostgreSQL'], learning_outcome: 'Dynamic routing, markdown rendering, and relational table schemas.', relevance: 'Implements CMS architecture, rich editor integrations, and standard web hosting.' },
        { name: 'Enterprise Analytics Dashboard', description: 'Build a high-performance system rendering key company statistics with database pagination, sorting, search filters, and PDF export.', difficulty: 'Advanced', tech_stack: ['React', 'Express', 'PostgreSQL', 'Sequelize'], learning_outcome: 'Optimized SQL pagination, backend search querying, index structures, and file generation.', relevance: 'Demonstrates ability to handle enterprise-level data processing and dashboard filters.' }
      ];
    }

    return {
      current_level,
      career_path,
      skill_gaps,
      learning_roadmap,
      recommended_projects,
      career_recommendations: {
        confidence: Math.round(55 + (profile.developer_score * 0.4)),
        explanation: career_explanation,
        suggestions: [
          'Contribute to open source projects that align with your career path to practice collaboration and code review structures.',
          'Build one of the 5 recommended projects in your local workspace, focusing heavily on Clean Architecture and unit tests.',
          'Engage in developer networking by sharing your project builds and learning journey milestones on technical forums and LinkedIn.'
        ]
      }
    };
  }
}

module.exports = new CareerInsightsService();
