// Comprehensive ATS Skills & Keywords Dictionary
export const skillCategories = {
    frontend: [
        "react", "react.js", "reactjs", "javascript", "typescript", "html", "html5", "css", "css3",
        "next.js", "nextjs", "vue", "vue.js", "vuejs", "angular", "redux", "redux toolkit",
        "zustand", "tailwind", "tailwind css", "tailwindcss", "bootstrap", "sass", "scss",
        "vite", "webpack", "responsive design", "web performance", "accessibility", "a11y",
        "dom manipulation", "single page applications", "gsap", "axios", "styled-components"
    ],
    backend: [
        "node", "nodejs", "node.js", "express", "expressjs", "express.js", "nest.js", "nestjs",
        "python", "django", "flask", "fastapi", "java", "spring", "spring boot", "c++", "c#",
        ".net", "asp.net", "php", "laravel", "ruby", "rails", "go", "golang", "rest api",
        "restful api", "restful apis", "graphql", "microservices", "jwt", "oauth", "api integration"
    ],
    database: [
        "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "firebase", "supabase",
        "dynamodb", "sqlite", "prisma", "mongoose", "nosql", "database design", "indexing"
    ],
    devopsCloud: [
        "git", "github", "gitlab", "bitbucket", "docker", "kubernetes", "aws", "amazon web services",
        "azure", "gcp", "google cloud", "google cloud platform", "vercel", "netlify", "render",
        "ci/cd", "jenkins", "github actions", "linux", "bash", "shell scripting", "nginx", "postman"
    ],
    testingTools: [
        "jest", "react testing library", "cypress", "playwright", "mocha", "chai", "selenium",
        "unit testing", "integration testing", "end-to-end testing", "e2e testing", "figma",
        "jira", "confluence", "scrum", "agile", "kanban", "babel", "npm", "yarn"
    ],
    coreCompetencies: [
        "data structures", "algorithms", "system design", "object oriented programming", "oop",
        "problem solving", "critical thinking", "code review", "software engineering",
        "performance optimization", "clean code", "cross-functional collaboration", "teamwork",
        "communication", "time management", "ci/cd pipeline", "version control"
    ],
    certifications: [
        "aws certified", "azure certified", "google cloud certified", "oracle java certified",
        "certified kubernetes administrator", "cka", "pmp", "scrum master", "cisco certified",
        "ccna", "comptia", "coursera", "udemy", "nptel", "hackerrank", "leetcode", "meta frontend"
    ]
};

// Flattened, unique list of all keywords for fast lookup
export const allAtsKeywords = [...new Set(Object.values(skillCategories).flat())];

// Action verbs that strong ATS systems look for in bullet points
export const atsActionVerbs = [
    "engineered", "developed", "spearheaded", "architected", "optimized", "implemented",
    "designed", "delivered", "built", "accelerated", "automated", "streamlined",
    "refactored", "integrated", "deployed", "scaled", "collaborated", "managed",
    "resolved", "enhanced", "reduced", "increased", "launched", "standardized"
];

/**
 * Safely creates a RegExp for an ATS keyword that may contain special regex characters
 * like 'c++', 'c#', '.net', 'react.js', etc.
 */
export const createKeywordRegex = (keyword) => {
    if (!keyword) return /(?!)/;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const leadingBoundary = /^\w/.test(keyword) ? "\\b" : "(?:^|[\\s/.,;:(])";
    const trailingBoundary = /\w$/.test(keyword) ? "\\b" : "(?=$|[\\s/.,;:!?)])";
    return new RegExp(`${leadingBoundary}${escaped}${trailingBoundary}`, "i");
};

/**
 * Checks whether a given keyword exists inside text using safe word boundary matching
 */
export const matchKeyword = (text, keyword) => {
    if (!text || !keyword) return false;
    return createKeywordRegex(keyword).test(text);
};

// Helper to categorize keywords
export const categorizeSkill = (skill) => {
    const s = skill.toLowerCase().trim();
    if (skillCategories.frontend.some(k => s === k || s.includes(k))) return "Frontend";
    if (skillCategories.backend.some(k => s === k || s.includes(k))) return "Backend";
    if (skillCategories.database.some(k => s === k || s.includes(k))) return "Database";
    if (skillCategories.devopsCloud.some(k => s === k || s.includes(k))) return "Cloud & DevOps";
    if (skillCategories.testingTools.some(k => s === k || s.includes(k))) return "Testing & Tools";
    if (skillCategories.certifications.some(k => s === k || s.includes(k))) return "Certifications";
    return "Core Skills";
};
