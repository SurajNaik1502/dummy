import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Theme = "light" | "dark";
type OnboardingMode = "open" | "guided";

type Career = {
  id: string;
  name: string;
  category: string;
  summary: string;
  fit: string[];
  salary: string;
  education: string;
  demand: string;
};

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
};

type JournalEntry = {
  id: number;
  title: string;
  text: string;
};

type SavedComparison = {
  id: number;
  names: string[];
};

const STORAGE_KEY = "project-horizon-state";

const getInitialStoredState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const careers: Career[] = [
  {
    id: "product-design",
    name: "Product Designer",
    category: "Design",
    summary:
      "Designs user experiences, interfaces, and digital products for real people.",
    fit: ["creativity", "problem-solving", "visual thinking"],
    salary: "₹6.5L–₹18L",
    education: "Portfolio + design fundamentals",
    demand: "High",
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    category: "Technology",
    summary:
      "Builds applications, tools, and digital systems that solve everyday problems.",
    fit: ["logic", "building", "patience"],
    salary: "₹7L–₹22L",
    education: "CS/IT or self-taught + projects",
    demand: "Very high",
  },
  {
    id: "ux-researcher",
    name: "UX Researcher",
    category: "Research",
    summary:
      "Learns how people think and uses evidence to shape better products and services.",
    fit: ["curiosity", "empathy", "analysis"],
    salary: "₹5L–₹15L",
    education: "Psychology, HCI, design research",
    demand: "Growing",
  },
  {
    id: "social-media-strategist",
    name: "Social Media Strategist",
    category: "Media",
    summary:
      "Connects ideas with audiences through content, community, and growth strategy.",
    fit: ["communication", "creativity", "trend-spotting"],
    salary: "₹4L–₹12L",
    education: "Digital marketing + portfolio",
    demand: "Steady",
  },
  {
    id: "civil-engineer",
    name: "Civil Engineer",
    category: "Engineering",
    summary:
      "Designs and improves the infrastructure that shapes cities and communities.",
    fit: ["practical thinking", "planning", "problem-solving"],
    salary: "₹5L–₹15L",
    education: "B.E. / B.Tech in civil engineering",
    demand: "Stable",
  },
  {
    id: "healthcare-analyst",
    name: "Healthcare Analyst",
    category: "Healthcare",
    summary:
      "Connects patient care, data, and systems to improve healthcare access and quality.",
    fit: ["care", "analysis", "communication"],
    salary: "₹6L–₹14L",
    education: "Biology + data/health systems",
    demand: "Rising",
  },
];

const roadmapItems = [
  { id: "current", label: "Current situation", status: "done" },
  { id: "explore", label: "Explore interests", status: "done" },
  { id: "skills", label: "Skill building", status: "active" },
  { id: "projects", label: "Build portfolio", status: "pending" },
  { id: "experience", label: "First experience", status: "pending" },
  { id: "roadmap", label: "Career roadmap", status: "pending" },
];

const skillQuests = [
  {
    title: "Design a poster for a community event",
    level: "Beginner",
    time: "20 min",
  },
  {
    title: "Create a simple landing page",
    level: "Intermediate",
    time: "60 min",
  },
  {
    title: "Interview a local professional",
    level: "Explorer",
    time: "45 min",
  },
];

const hustleIdeas = [
  "Social media starter packs",
  "Design commissions for local businesses",
  "Tutoring for younger students",
  "Handmade accessories or custom gifts",
];

const navItems = [
  "Home",
  "AI Guide",
  "Career Universe",
  "Comparison",
  "Roadmap",
  "Simulations",
  "Skill Quest",
  "Hustle Hub",
  "Journal",
  "Profile",
];

const opportunityOptions = [
  "Low budget",
  "Online-first",
  "No degree required",
  "Flexible schedule",
  "Scholarship-friendly",
];

const sourceCards = [
  {
    title: "National Career Service",
    body: "Career guidance and role-related pathways, with updates from Indian public institutions.",
    tag: "Verified",
  },
  {
    title: "UGC / University portals",
    body: "Academic eligibility, course entry routes, and degree requirements from official institutions.",
    tag: "Official",
  },
  {
    title: "Ministry of Skill Development",
    body: "Industry-linked training pathways, scholarships, and alternative skill routes.",
    tag: "Government",
  },
];

const whatIfScenarios = [
  "Study abroad",
  "Choose a lower-cost college",
  "Pursue a skill-first path",
  "Combine two interests",
  "Start a business early",
];

const futurePathways = [
  {
    title: "Creatively balanced",
    description:
      "Design, storytelling, and business without locking into a single rigid path.",
  },
  {
    title: "Practical growth",
    description:
      "Technology, systems, and structured career building with long-term stability.",
  },
  {
    title: "Entrepreneur-first",
    description:
      "Early business experiments, small products, and flexible income exploration.",
  },
];

const reflectionPrompts = [
  "Last time, creative independence felt important. Has that changed?",
  "What kinds of work make you feel energized instead of drained?",
  "Which priorities matter most to you right now: security, freedom, or impact?",
];

function App() {
  const storedState = useMemo(() => getInitialStoredState(), []);

  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme =
      storedState.theme ?? localStorage.getItem("project-horizon-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>(
    storedState.onboardingMode ?? "open",
  );
  const [selectedCareerFilter, setSelectedCareerFilter] = useState(
    storedState.selectedCareerFilter ?? "All",
  );
  const [searchTerm, setSearchTerm] = useState(storedState.searchTerm ?? "");
  const [selectedCompare, setSelectedCompare] = useState<string[]>(
    storedState.selectedCompare ?? ["product-design", "software-engineer"],
  );
  const [guideInput, setGuideInput] = useState(storedState.guideInput ?? "");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(
    storedState.journalEntries ?? [
      {
        id: 1,
        title: "What I noticed today",
        text: "I feel calmer when I think about creative work and independent projects. Maybe I can explore design and communication more before I lock into any one path.",
      },
    ],
  );
  const [roadmapStatus, setRoadmapStatus] = useState<Record<string, boolean>>(
    storedState.roadmapStatus ?? {
      current: true,
      explore: true,
      skills: true,
      projects: false,
      experience: false,
      roadmap: false,
    },
  );
  const [guideMessages, setGuideMessages] = useState<Message[]>(
    storedState.guideMessages ?? [
      {
        id: 1,
        role: "ai",
        text: "I’m here to help you explore without pressure. Tell me what excites you, what drains you, or what feels confusing right now.",
      },
    ],
  );
  const [memoryEnabled, setMemoryEnabled] = useState(
    storedState.memoryEnabled ?? true,
  );
  const [shareProgress, setShareProgress] = useState(
    storedState.shareProgress ?? false,
  );
  const [profileSummary, setProfileSummary] = useState(
    storedState.profileSummary ?? {
      age: "16",
      location: "Bengaluru, India",
      focus: "Creative + practical future paths",
    },
  );
  const [activeView, setActiveView] = useState(
    storedState.activeView ?? "Home",
  );
  const [selectedCareerFocus, setSelectedCareerFocus] = useState(
    storedState.selectedCareerFocus ?? "product-design",
  );
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>(
    storedState.selectedOpportunities ?? ["Low budget", "Flexible schedule"],
  );
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>(
    storedState.savedComparisons ?? [
      { id: 1, names: ["product-design", "software-engineer"] },
    ],
  );

  useEffect(() => {
    const nextState = {
      theme,
      onboardingMode,
      selectedCareerFilter,
      searchTerm,
      selectedCompare,
      guideInput,
      journalEntries,
      roadmapStatus,
      guideMessages,
      memoryEnabled,
      shareProgress,
      profileSummary,
      activeView,
      selectedCareerFocus,
      savedComparisons,
      selectedOpportunities,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("project-horizon-theme", theme);
  }, [
    activeView,
    guideInput,
    guideMessages,
    journalEntries,
    memoryEnabled,
    onboardingMode,
    profileSummary,
    roadmapStatus,
    savedComparisons,
    searchTerm,
    selectedCareerFilter,
    selectedCareerFocus,
    selectedCompare,
    selectedOpportunities,
    shareProgress,
    theme,
  ]);

  const filteredCareers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return careers.filter((career) => {
      const matchesCategory =
        selectedCareerFilter === "All" ||
        career.category === selectedCareerFilter;
      const matchesSearch =
        normalized.length === 0 ||
        career.name.toLowerCase().includes(normalized) ||
        career.summary.toLowerCase().includes(normalized) ||
        career.fit.some((item) => item.toLowerCase().includes(normalized));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCareerFilter]);

  const compareCards = careers.filter((career) =>
    selectedCompare.includes(career.id),
  );

  const focusedCareer =
    careers.find((career) => career.id === selectedCareerFocus) ?? careers[0];

  const handleNavClick = (item: string) => {
    setActiveView(item);
    const sectionId = item.toLowerCase().replace(/\s+/g, "-");
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const saveComparison = () => {
    if (selectedCompare.length === 0) {
      return;
    }

    const newComparison = {
      id: Date.now(),
      names: [...selectedCompare],
    };

    setSavedComparisons((current) => [newComparison, ...current].slice(0, 5));
  };

  const exportProfile = () => {
    const payload = {
      profileSummary,
      memoryEnabled,
      shareProgress,
      selectedCompare,
      savedComparisons,
      journalEntries,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "project-horizon-profile.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetUserData = () => {
    const confirmed = window.confirm(
      "This will clear your saved journey information from this browser. Continue?",
    );

    if (!confirmed) {
      return;
    }

    setSelectedCompare(["product-design", "software-engineer"]);
    setSavedComparisons([]);
    setGuideMessages([
      {
        id: 1,
        role: "ai",
        text: "I’m here to help you explore without pressure. Tell me what excites you, what drains you, or what feels confusing right now.",
      },
    ]);
    setJournalEntries([
      {
        id: 1,
        title: "What I noticed today",
        text: "I feel calmer when I think about creative work and independent projects. Maybe I can explore design and communication more before I lock into any one path.",
      },
    ]);
    setRoadmapStatus({
      current: true,
      explore: true,
      skills: true,
      projects: false,
      experience: false,
      roadmap: false,
    });
    setMemoryEnabled(true);
    setShareProgress(false);
    setSelectedCareerFilter("All");
    setSearchTerm("");
    setSelectedCareerFocus("product-design");
    setActiveView("Home");
    setGuideInput("");
    setProfileSummary({
      age: "16",
      location: "Bengaluru, India",
      focus: "Creative + practical future paths",
    });
  };

  const addGuideMessage = () => {
    if (!guideInput.trim()) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user" as const,
      text: guideInput.trim(),
    };

    const lower = guideInput.toLowerCase();
    let aiReply =
      "That makes sense. Let’s keep this broad and useful: what feels most exciting, and what feels like a real constraint in your current situation?";

    if (
      lower.includes("design") ||
      lower.includes("creative") ||
      lower.includes("art")
    ) {
      aiReply =
        "Creative work seems important to you. A few directions worth exploring could include design, media, brand-building, communication-heavy roles, or combinations of design with business or technology.";
    }

    if (
      lower.includes("money") ||
      lower.includes("income") ||
      lower.includes("finance")
    ) {
      aiReply =
        "Financial stability is a meaningful factor, and it can absolutely shape your decisions. We can look at careers that balance earning potential, flexibility, and long-term growth without assuming there is only one “right” answer.";
    }

    if (
      lower.includes("confused") ||
      lower.includes("unsure") ||
      lower.includes("indecisive")
    ) {
      aiReply =
        "Feeling unsure is not a flaw; it is often a sign that you are still gathering information. We can slow this down and explore your interests, your practical constraints, and your possible futures one layer at a time.";
    }

    setGuideMessages((current) => [
      ...current,
      userMessage,
      { id: Date.now() + 1, role: "ai", text: aiReply },
    ]);
    setGuideInput("");
  };

  const toggleCareerCompare = (careerId: string) => {
    setSelectedCompare((current) => {
      if (current.includes(careerId)) {
        return current.filter((id) => id !== careerId);
      }

      if (current.length >= 4) {
        return [...current.slice(1), careerId];
      }

      return [...current, careerId];
    });
  };

  const addJournalEntry = () => {
    const title = window.prompt("Give your journal entry a title:")?.trim();
    const text = window.prompt("What do you want to reflect on?")?.trim();

    if (!title || !text) {
      return;
    }

    setJournalEntries((current) => [
      { id: Date.now(), title, text },
      ...current,
    ]);
  };

  const toggleRoadmapStage = (stageId: string) => {
    setRoadmapStatus((current) => ({
      ...current,
      [stageId]: !current[stageId],
    }));
  };

  const themeLabel = theme === "dark" ? "Light mode" : "Dark mode";

  const recommendedPath = useMemo(() => {
    const hasBudgetFocus = selectedOpportunities.includes("Low budget");
    const hasFlexibleFocus =
      selectedOpportunities.includes("Flexible schedule");
    const hasSkillFocus = selectedOpportunities.includes("No degree required");

    if (hasBudgetFocus && hasFlexibleFocus) {
      return "Freelance-first creative systems + digital marketing and design work";
    }

    if (hasSkillFocus && hasFlexibleFocus) {
      return "Skill-based tech and digital projects with portfolio-first growth";
    }

    if (hasBudgetFocus) {
      return "Lower-cost pathways in design, media, and practical digital work";
    }

    return "Balanced pathways that combine creative work with long-term skill-building";
  }, [selectedOpportunities]);

  const toggleOpportunity = (option: string) => {
    setSelectedOpportunities((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const updateProfileSummary = (
    field: "age" | "location" | "focus",
    value: string,
  ) => {
    setProfileSummary((current: typeof profileSummary) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="page-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name">Project Horizon</div>
            <div className="brand-tag">Future explorer</div>
          </div>
        </div>

        <nav className="topnav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className={activeView === item ? "nav-link active" : "nav-link"}
              onClick={() => handleNavClick(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="secondary-btn"
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {themeLabel}
          </button>
          <button className="primary-btn" type="button">
            Launch AI guide
          </button>
        </div>
      </aside>

      <main className="content-wrap">
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <div className="eyebrow">Your future is bigger than you think.</div>
            <h1>
              Explore possibilities, understand yourself, and build your own
              path.
            </h1>
            <p>
              Discover careers, compare futures, learn what actually fits your
              life, and grow with a guide that adapts as you do.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  document
                    .getElementById("ai-guide")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Talk to your AI guide
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  document
                    .getElementById("career-universe")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore careers and possibilities
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <strong>200+</strong>
                <span>career paths mapped</span>
              </div>
              <div>
                <strong>18</strong>
                <span>life priorities explored</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>AI guidance</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Career universe visual">
            <div className="orb orb-large" />
            <div className="orb orb-medium" />
            <div className="orb orb-small" />
            <div className="star-grid">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="floating-card card-one">Design + business</div>
            <div className="floating-card card-two">AI + healthcare</div>
            <div className="floating-card card-three">Hobby → venture</div>
          </div>
        </section>

        <section className="info-strip">
          <div>
            <span className="mini-label">Personalized AI</span>
            <strong>
              Built to understand your interests, concerns, and trade-offs.
            </strong>
          </div>
          <div>
            <span className="mini-label">Career Universe</span>
            <strong>
              Explore clusters, hidden intersections, and future pathways.
            </strong>
          </div>
          <div>
            <span className="mini-label">Real-world clarity</span>
            <strong>
              Career, finance, and education decisions without pressure.
            </strong>
          </div>
        </section>

        <section className="section" id="ai-guide">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">AI guide</span>
              <h2>Support that listens before it recommends.</h2>
            </div>
            <div className="tag-row">
              <span className="small-pill">Adaptive listening</span>
              <span className="small-pill">Career-safe</span>
            </div>
          </div>

          <div className="onboarding-panel">
            <div className="mode-selector">
              <button
                type="button"
                className={
                  onboardingMode === "open"
                    ? "mode-button active"
                    : "mode-button"
                }
                onClick={() => setOnboardingMode("open")}
              >
                I know what I’m thinking
              </button>
              <button
                type="button"
                className={
                  onboardingMode === "guided"
                    ? "mode-button active"
                    : "mode-button"
                }
                onClick={() => setOnboardingMode("guided")}
              >
                I don’t know how to explain it
              </button>
            </div>

            {onboardingMode === "open" ? (
              <div className="conversation-box">
                <div className="chat-thread">
                  {guideMessages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.role === "user" ? "message user" : "message ai"
                      }
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
                <div className="chat-input-row">
                  <input
                    type="text"
                    value={guideInput}
                    onChange={(event) => setGuideInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addGuideMessage();
                      }
                    }}
                    placeholder="Tell me what feels exciting, confusing, or important right now..."
                    aria-label="Type your message to the AI guide"
                  />
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={addGuideMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="guided-questions">
                <div className="question-card">
                  <span className="mini-label">Question 1</span>
                  <h3>What feels interesting to you right now?</h3>
                  <div className="chip-list">
                    <button type="button" className="chip">
                      Design
                    </button>
                    <button type="button" className="chip">
                      Business
                    </button>
                    <button type="button" className="chip">
                      Technology
                    </button>
                    <button type="button" className="chip">
                      People & helping
                    </button>
                  </div>
                </div>
                <div className="question-card">
                  <span className="mini-label">Question 2</span>
                  <h3>What makes your decision harder?</h3>
                  <div className="chip-list">
                    <button type="button" className="chip">
                      Money
                    </button>
                    <button type="button" className="chip">
                      Family expectations
                    </button>
                    <button type="button" className="chip">
                      Unsure about school
                    </button>
                    <button type="button" className="chip">
                      Fear of choosing wrong
                    </button>
                  </div>
                </div>
                <div className="summary-card">
                  <span className="mini-label">Summary</span>
                  <h3>What I think you’re trying to tell me</h3>
                  <p>
                    You may be curious about creative work and practical
                    opportunities, while also worried about pressure,
                    expectations, and whether you are choosing the “right” path
                    too early.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="section" id="career-universe">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Career universe</span>
              <h2>Explore a living map of possibilities.</h2>
            </div>
            <button type="button" className="secondary-btn">
              Discover hidden careers
            </button>
          </div>

          <div className="career-filter-bar">
            {[
              "All",
              "Technology",
              "Design",
              "Engineering",
              "Healthcare",
              "Media",
              "Research",
            ].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  selectedCareerFilter === option
                    ? "filter-pill active"
                    : "filter-pill"
                }
                onClick={() => setSelectedCareerFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="universe-grid">
            <div className="search-panel">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search careers, skills, or interests"
                aria-label="Search careers"
              />

              <div className="focused-career-panel">
                <span className="mini-label">Career spotlight</span>
                <h3>{focusedCareer.name}</h3>
                <p>{focusedCareer.summary}</p>
                <div className="meta-row">
                  <span>{focusedCareer.salary}</span>
                  <span>{focusedCareer.demand}</span>
                </div>
                <div className="fit-row">
                  {focusedCareer.fit.map((fit) => (
                    <span key={fit}>{fit}</span>
                  ))}
                </div>
              </div>

              <div className="mini-chart">
                <div className="chart-node node-a" />
                <div className="chart-node node-b" />
                <div className="chart-node node-c" />
                <div className="chart-node node-d" />
                <div className="chart-node node-e" />
                <div className="chart-node node-f" />
              </div>
            </div>

            <div className="career-cards">
              {filteredCareers.map((career) => (
                <article
                  key={career.id}
                  className={
                    selectedCareerFocus === career.id
                      ? "career-card selected"
                      : "career-card"
                  }
                  onClick={() => setSelectedCareerFocus(career.id)}
                >
                  <div className="career-header">
                    <div>
                      <span className="mini-label">{career.category}</span>
                      <h3>{career.name}</h3>
                    </div>
                    <button
                      type="button"
                      className={
                        selectedCompare.includes(career.id)
                          ? "compare-toggle active"
                          : "compare-toggle"
                      }
                      onClick={() => toggleCareerCompare(career.id)}
                    >
                      {selectedCompare.includes(career.id)
                        ? "Compared"
                        : "Compare"}
                    </button>
                  </div>
                  <p>{career.summary}</p>
                  <div className="meta-row">
                    <span>{career.salary}</span>
                    <span>{career.demand}</span>
                  </div>
                  <div className="fit-row">
                    {career.fit.map((fit) => (
                      <span key={fit}>{fit}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="comparison">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Career Comparison</span>
              <h2>
                Compare futures without pretending there is one perfect answer.
              </h2>
            </div>
            <button
              type="button"
              className="secondary-btn"
              onClick={saveComparison}
            >
              Save this comparison
            </button>
          </div>

          {savedComparisons.length > 0 && (
            <div className="saved-comparison-list">
              {savedComparisons.map((comparison) => (
                <button
                  key={comparison.id}
                  type="button"
                  className="saved-comparison-pill"
                  onClick={() => setSelectedCompare(comparison.names)}
                >
                  {comparison.names
                    .map((id) => careers.find((item) => item.id === id)?.name)
                    .filter(Boolean)
                    .join(" vs ")}
                </button>
              ))}
            </div>
          )}

          <div className="comparison-grid">
            {compareCards.map((career) => (
              <div key={career.id} className="comparison-card">
                <h3>{career.name}</h3>
                <ul>
                  <li>
                    <span>Salary</span>
                    <strong>{career.salary}</strong>
                  </li>
                  <li>
                    <span>Education</span>
                    <strong>{career.education}</strong>
                  </li>
                  <li>
                    <span>Demand</span>
                    <strong>{career.demand}</strong>
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <div className="matrix-panel">
            <div className="matrix-header">
              <span>Compatibility</span>
              <span>Life fit</span>
            </div>
            <div className="bars">
              {compareCards.map((career) => (
                <div key={career.id} className="bar-row">
                  <label>{career.name}</label>
                  <div className="progress-track">
                    <div
                      className="progress"
                      style={{
                        width: `${career.id === "product-design" ? 82 : career.id === "software-engineer" ? 74 : 66}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="roadmap">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">My Roadmap</span>
              <h2>Your future plan should be flexible, not fixed.</h2>
            </div>
            <button type="button" className="secondary-btn">
              Regenerate roadmap
            </button>
          </div>

          <div className="roadmap-list">
            {roadmapItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  roadmapStatus[item.id] ? "roadmap-item done" : "roadmap-item"
                }
                onClick={() => toggleRoadmapStage(item.id)}
              >
                <span className="roadmap-dot" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section" id="simulations">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Career reality simulator</span>
              <h2>Step inside a day in the life.</h2>
            </div>
          </div>

          <div className="simulation-grid">
            <div className="simulation-card">
              <span className="mini-label">Scenario</span>
              <h3>Design a campaign pitch</h3>
              <p>
                Imagine you’re a creative strategist with a student budget and a
                limited timeline. What would you prioritize first?
              </p>
            </div>
            <div className="simulation-card">
              <span className="mini-label">Scenario</span>
              <h3>Build a simple app prototype</h3>
              <p>
                Use a clear problem statement, simple features, and user
                feedback to design a useful product.
              </p>
            </div>
            <div className="simulation-card">
              <span className="mini-label">Scenario</span>
              <h3>Review an ethical case study</h3>
              <p>
                Explore what choices make an outcome more fair, more
                responsible, and more realistic.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="skill-quest">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Skill Quest</span>
              <h2>Small challenges. Real growth.</h2>
            </div>
          </div>

          <div className="quest-grid">
            {skillQuests.map((quest) => (
              <div key={quest.title} className="quest-card">
                <span className="mini-label">{quest.level}</span>
                <h3>{quest.title}</h3>
                <div className="meta-row">
                  <span>{quest.time}</span>
                  <span>Badge unlocked</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="hustle-hub">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Teen Hustle Hub</span>
              <h2>Turn interests into realistic first opportunities.</h2>
            </div>
          </div>

          <div className="hustle-panel">
            <div className="hustle-list">
              {hustleIdeas.map((idea) => (
                <div key={idea} className="hustle-item">
                  {idea}
                </div>
              ))}
            </div>
            <div className="hustle-summary">
              <span className="mini-label">Microbusiness idea</span>
              <h3>Custom sticker packs + digital templates</h3>
              <p>
                Low setup cost, easy to test, and a strong first product for
                creative students with a niche audience.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="journal">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Career Journal</span>
              <h2>Write down your thoughts as they evolve.</h2>
            </div>
            <button
              type="button"
              className="primary-btn"
              onClick={addJournalEntry}
            >
              New entry
            </button>
          </div>

          <div className="journal-list">
            {journalEntries.map((entry) => (
              <article key={entry.id} className="journal-card">
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="profile">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">My Possibilities</span>
              <h2>Explore multiple futures, not one fixed destination.</h2>
            </div>
          </div>

          <div className="possibility-grid">
            <div className="possibility-card">
              <span className="mini-label">Balanced path</span>
              <h3>{recommendedPath}</h3>
            </div>
            <div className="possibility-card">
              <span className="mini-label">Creative path</span>
              <h3>Content + digital systems</h3>
            </div>
            <div className="possibility-card">
              <span className="mini-label">Practical path</span>
              <h3>Engineering + problem solving</h3>
            </div>
          </div>
        </section>

        <section className="section" id="dashboard">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Dashboard</span>
              <h2>Welcome back. Your future is still open.</h2>
            </div>
            <button type="button" className="secondary-btn">
              Customize dashboard
            </button>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-panel broad-panel">
              <span className="mini-label">Suggested next steps</span>
              <h3>{recommendedPath}</h3>
              <p>
                Based on your priorities, the strongest next move is to test a
                few small projects, talk to people in the field, and compare the
                real trade-offs before locking into a single route.
              </p>
            </div>
            <div className="dashboard-panel mini-panel">
              <span className="mini-label">Saved careers</span>
              <h3>{savedComparisons.length + selectedCompare.length}</h3>
            </div>
            <div className="dashboard-panel mini-panel">
              <span className="mini-label">Roadmap progress</span>
              <h3>
                {Math.round(
                  (Object.values(roadmapStatus).filter(Boolean).length /
                    Object.keys(roadmapStatus).length) *
                    100,
                )}
                %
              </h3>
            </div>
          </div>
        </section>

        <section className="section" id="what-if-simulator">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">What-if simulator</span>
              <h2>Test different futures before you commit to one.</h2>
            </div>
          </div>

          <div className="scenario-grid">
            {whatIfScenarios.map((scenario) => (
              <div key={scenario} className="scenario-card">
                <span className="mini-label">Scenario</span>
                <h3>{scenario}</h3>
                <p>
                  Explore trade-offs in education cost, lifestyle, learning
                  time, and long-term opportunity.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="accessibility-filter">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Opportunity accessibility</span>
              <h2>Find realistic paths that fit your reality.</h2>
            </div>
          </div>

          <div className="chip-list">
            {opportunityOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={
                  selectedOpportunities.includes(option)
                    ? "chip active"
                    : "chip"
                }
                onClick={() => toggleOpportunity(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="section" id="financial-planning">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Financial reality calculator</span>
              <h2>Estimate costs, trade-offs, and long-term clarity.</h2>
            </div>
          </div>

          <div className="finance-panel">
            <div className="finance-card">
              <span className="mini-label">Education cost</span>
              <h3>₹3.5L</h3>
              <p>
                Estimated course and living costs for a practical skill-first
                route.
              </p>
            </div>
            <div className="finance-card">
              <span className="mini-label">Salary runway</span>
              <h3>₹8L–₹14L</h3>
              <p>
                Range of realistic earnings after gaining initial experience.
              </p>
            </div>
            <div className="finance-card">
              <span className="mini-label">Break-even projection</span>
              <h3>2–4 years</h3>
              <p>
                Assumes steady learning, project building, and consistent
                effort.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="source-trust">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Trusted information</span>
              <h2>Source-aware guidance, not vague AI certainty.</h2>
            </div>
          </div>

          <div className="source-grid">
            {sourceCards.map((source) => (
              <div key={source.title} className="source-card">
                <span className="mini-label">{source.tag}</span>
                <h3>{source.title}</h3>
                <p>{source.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="settings">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Profile & settings</span>
              <h2>Your profile should stay yours.</h2>
            </div>
          </div>

          <div className="settings-grid">
            <div className="settings-card profile-card">
              <span className="mini-label">Profile snapshot</span>
              <div className="profile-form">
                <label className="profile-field">
                  <span>Age</span>
                  <input
                    type="text"
                    value={profileSummary.age}
                    onChange={(event) =>
                      updateProfileSummary("age", event.target.value)
                    }
                  />
                </label>
                <label className="profile-field">
                  <span>Location</span>
                  <input
                    type="text"
                    value={profileSummary.location}
                    onChange={(event) =>
                      updateProfileSummary("location", event.target.value)
                    }
                  />
                </label>
                <label className="profile-field">
                  <span>Focus</span>
                  <input
                    type="text"
                    value={profileSummary.focus}
                    onChange={(event) =>
                      updateProfileSummary("focus", event.target.value)
                    }
                  />
                </label>
              </div>
              <ul>
                <li>Preferences: Flexible, creative, realistic</li>
                <li>Priority path: {recommendedPath}</li>
              </ul>
            </div>

            <div className="settings-card toggle-card">
              <span className="mini-label">Privacy controls</span>
              <label className="toggle-row">
                <span>AI memory</span>
                <input
                  type="checkbox"
                  checked={memoryEnabled}
                  onChange={() => setMemoryEnabled((value: boolean) => !value)}
                />
              </label>
              <label className="toggle-row">
                <span>Share journey progress with trusted adults</span>
                <input
                  type="checkbox"
                  checked={shareProgress}
                  onChange={() => setShareProgress((value: boolean) => !value)}
                />
              </label>
              <button
                type="button"
                className="secondary-btn"
                onClick={exportProfile}
              >
                Export profile
              </button>
              <button
                type="button"
                className="secondary-btn reset-btn"
                onClick={resetUserData}
              >
                Reset journey
              </button>
            </div>
          </div>
        </section>

        <section className="section" id="future-pathways">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Multiple futures</span>
              <h2>You do not need to pick just one version of your life.</h2>
            </div>
          </div>

          <div className="pathway-grid">
            {futurePathways.map((pathway) => (
              <div key={pathway.title} className="pathway-card">
                <span className="mini-label">Future path</span>
                <h3>{pathway.title}</h3>
                <p>{pathway.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="reflection-prompts">
          <div className="section-header">
            <div>
              <span className="eyebrow alt">Reflection prompts</span>
              <h2>Check in with yourself without pressure.</h2>
            </div>
          </div>

          <div className="prompt-list">
            {reflectionPrompts.map((prompt) => (
              <div key={prompt} className="prompt-card">
                {prompt}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
