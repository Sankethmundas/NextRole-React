const AtsResult = require("../models/AtsResult");

const skillKeywords = [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "reactjs",
    "next.js",
    "nextjs",
    "vue",
    "vuejs",
    "angular",
    "bootstrap",
    "tailwind",
    "tailwindcss",
    "sql",
    "mysql",
    "postgresql",
    "postgres",
    "mongodb",
    "redis",
    "firebase",
    "python",
    "django",
    "flask",
    "fastapi",
    "java",
    "spring",
    "spring boot",
    "c++",
    "c#",
    ".net",
    "php",
    "laravel",
    "ruby",
    "rails",
    "node",
    "nodejs",
    "express",
    "expressjs",
    "graphql",
    "rest api",
    "restful api",
    "microservices",
    "frontend",
    "backend",
    "full stack",
    "fullstack",
    "system design",
    "data structures",
    "algorithms",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "nlp",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch"
];

const toolKeywords = [
    "git",
    "github",
    "gitlab",
    "bitbucket",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "google cloud",
    "vercel",
    "render",
    "netlify",
    "api",
    "apis",
    "api integration",
    "responsive design",
    "localstorage",
    "form handling",
    "state management",
    "redux",
    "zustand",
    "component-based architecture",
    "ui",
    "ux",
    "excel",
    "tableau",
    "power bi",
    "postman",
    "figma",
    "jira",
    "confluence",
    "ci/cd",
    "jenkins",
    "github actions",
    "linux",
    "bash",
    "webpack",
    "vite",
    "babel",
    "jest",
    "cypress",
    "selenium",
    "matlab"
];

const certificationKeywords = [
    "certification",
    "certifications",
    "aws certification",
    "aws certified",
    "azure certification",
    "azure certified",
    "google cloud certified",
    "oracle java",
    "cisco",
    "ccna",
    "comptia",
    "certified kubernetes administrator",
    "cka",
    "pmp",
    "scrum master",
    "nptel",
    "coursera",
    "udemy",
    "edx",
    "hackerrank",
    "leetcode"
];

const eligibilityKeywords = [
    "internship",
    "full-time",
    "remote",
    "btech",
    "mtech",
    "bsc",
    "msc",
    "computer science",
    "information technology",
    "software engineering",
    "problem solving",
    "problem-solving",
    "teamwork",
    "leadership",
    "communication",
    "data analysis"
];

const allKeywords = [
    ...skillKeywords,
    ...toolKeywords,
    ...certificationKeywords,
    ...eligibilityKeywords
];

const groupKeywords = (keywords) => ({
    Skills: keywords.filter((word) => skillKeywords.includes(word)),
    Tools: keywords.filter((word) => toolKeywords.includes(word)),
    Certifications: keywords.filter((word) => certificationKeywords.includes(word)),
    Eligibility: keywords.filter((word) => eligibilityKeywords.includes(word))
});

const getScoreStatus = (score) => {
    if (score >= 75) {
        return "Strong Match";
    }

    if (score >= 50) {
        return "Moderate Match";
    }

    return "Needs Improvement";
};

const calculateAtsResult = (resumeText, jobDescription) => {
    const resumeLower = (resumeText || "").toLowerCase();
    const jdLower = (jobDescription || "").toLowerCase();

    const relevantJDKeywords = allKeywords.filter((keyword) => jdLower.includes(keyword));
    const uniqueJDKeywords = [...new Set(relevantJDKeywords)];

    const matched = uniqueJDKeywords.filter((keyword) => resumeLower.includes(keyword));
    const missing = uniqueJDKeywords.filter((keyword) => !resumeLower.includes(keyword));
    const score = uniqueJDKeywords.length > 0
        ? Math.round((matched.length / uniqueJDKeywords.length) * 100)
        : 0;

    const matchedGroups = groupKeywords(matched);
    const missingGroups = groupKeywords(missing);

    const suggestions = [];

    if (uniqueJDKeywords.length === 0) {
        suggestions.push("No recognizable ATS keywords found in the job description.");
        return {
            score: 0,
            matchedKeywords: [],
            missingKeywords: [],
            suggestions,
            groupedMatched: {},
            groupedMissing: {},
            status: getScoreStatus(0)
        };
    }

    if (missing.length > 0) {
        suggestions.push(`Add these missing keywords to your resume where relevant: ${missing.slice(0, 8).join(", ")}.`);
    }

    if (score < 50) {
        suggestions.push("Your ATS score is low. Try aligning your skills, projects, and experience more closely with the job description.");
    } else if (score < 75) {
        suggestions.push("Your resume matches the job description partially. Add more relevant technical skills, tools, and role-specific keywords.");
    } else {
        suggestions.push("Your resume has a strong ATS match. You can further improve it by tailoring project descriptions and achievements to the role.");
    }

    suggestions.push("Use exact job-title keywords, technical skills, and important tools from the job description naturally inside your resume.");

    return {
        score,
        matchedKeywords: matched,
        missingKeywords: missing,
        suggestions,
        groupedMatched: matchedGroups,
        groupedMissing: missingGroups,
        status: getScoreStatus(score)
    };
};

const saveAtsResult = async (req, res) => {
    try {
        const user = req.user.userId;
        const { resumeText, jobDescription } = req.body;
        const result = calculateAtsResult(resumeText, jobDescription);

        const atsResult = await AtsResult.findOneAndUpdate(
            { user },
            {
                user,
                resumeText,
                jobDescription,
                result
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return res.status(201).json({
            success: true,
            message: "ATS analysis saved successfully",
            result,
            atsResult
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error analyzing ATS resume",
            error: error.message
        });
    }
};

const getAtsResults = async (req, res) => {
    try {
        const atsResults = await AtsResult.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            atsResults
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching ATS results",
            error: error.message
        });
    }
};

module.exports = {
    saveAtsResult,
    getAtsResults,
    calculateAtsResult
};
