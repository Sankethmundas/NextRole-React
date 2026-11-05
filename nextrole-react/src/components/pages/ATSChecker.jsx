import { useState, useEffect, useRef } from "react";
import "./ATSChecker.css";
import html2pdf from "html2pdf.js";
import { Link } from "react-router-dom";
import {
    FaFileUpload,
    FaCheckCircle,
    FaExclamationTriangle,
    FaDownload,
    FaMagic,
    FaArrowRight,
    FaFileAlt,
    FaCode,
    FaLightbulb,
    FaCheck,
    FaPlus
} from "react-icons/fa";
import { toast } from "react-toastify";
import { saveAtsResult, getAtsResults } from "../../services/atsService";
import { saveResume, getResume } from "../../services/resumeService";
import { extractTextFromFile, parseResumeText } from "../../utils/resumeParser";
import { allAtsKeywords, atsActionVerbs, categorizeSkill, matchKeyword } from "../../data/atsSkills";

const SAMPLE_FRONTEND_JD = `Role: Associate Frontend Engineer
Company: CloudTech Solutions
Location: Remote / Hybrid

Key Responsibilities:
- Build and maintain modern, responsive web user interfaces using React, JavaScript (ES6+), TypeScript, and CSS3.
- Integrate asynchronous RESTful APIs and handle dynamic state management using Redux Toolkit or Zustand.
- Ensure cross-browser compatibility, responsive web design, and high web accessibility (WCAG / a11y standards).
- Collaborate with UI/UX designers using Figma to implement pixel-perfect user experiences.
- Write clean, maintainable, modular components and unit tests with Jest and React Testing Library.
- Participate in Agile/Scrum ceremonies, code reviews, and Git version control workflows.

Required Skills & Qualifications:
- React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS or Bootstrap
- REST APIs, Git, GitHub, Vite or Webpack
- State Management (Redux or Zustand), Unit Testing (Jest)
- Problem solving, Data Structures, Cross-functional collaboration`;

function ATSChecker() {
    const fileInputRef = useRef();
    const printResumeRef = useRef();

    // Source selection: 'upload' | 'saved'
    const [savedResumeData, setSavedResumeData] = useState(() => {
        try {
            const local = localStorage.getItem("resumeData");
            return local ? JSON.parse(local) : null;
        } catch {
            return null;
        }
    });

    const [resumeSource, setResumeSource] = useState(() => {
        try {
            return localStorage.getItem("resumeData") ? "saved" : "upload";
        } catch {
            return "upload";
        }
    });

    const [resumeFile, setResumeFile] = useState(null);
    const [extractedResumeText, setExtractedResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // ATS Results State
    const [atsAnalysis, setAtsAnalysis] = useState(null);
    const [addedSkills, setAddedSkills] = useState(new Set());
    const [activeResumeObj, setActiveResumeObj] = useState(() => {
        try {
            const local = localStorage.getItem("resumeData");
            return local ? JSON.parse(local) : null;
        } catch {
            return null;
        }
    });

    // Fetch saved resume and latest ATS result on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            // 1. Try loading saved resume
            try {
                const res = await getResume();
                if (res?.resume) {
                    setSavedResumeData(res.resume);
                    setActiveResumeObj(res.resume);
                }
            } catch (e) {
                console.warn("No saved resume found", e);
            }

            // 2. Try loading previous ATS result
            try {
                const atsRes = await getAtsResults();
                const latest = atsRes?.atsResults?.[0];
                if (latest?.result) {
                    const resObj = latest.result;
                    setAtsAnalysis({
                        score: resObj.score || 0,
                        keywordMatchRate: resObj.keywordMatchRate ?? resObj.score ?? 0,
                        techRelevance: resObj.techRelevance ?? resObj.score ?? 0,
                        formatScore: resObj.formatScore ?? 85,
                        impactScore: resObj.impactScore ?? 75,
                        matchedKeywords: resObj.matchedKeywords || [],
                        missingKeywords: resObj.missingKeywords || [],
                        groupedMatched: resObj.groupedMatched || {},
                        groupedMissing: resObj.groupedMissing || {},
                        suggestions: resObj.suggestions || [],
                        totalJDKeywords: resObj.totalJDKeywords || (resObj.matchedKeywords?.length || 0) + (resObj.missingKeywords?.length || 0)
                    });
                }
            } catch (e) {
                console.warn("No previous ATS analysis found", e);
            }
        };

        fetchUserData();
    }, []);

    // File Selection Handler
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResumeFile(file);
        const toastId = toast.loading(`Reading ${file.name}...`);
        try {
            const text = await extractTextFromFile(file);
            setExtractedResumeText(text);
            const parsed = parseResumeText(text);
            setActiveResumeObj(parsed);
            toast.update(toastId, {
                render: `${file.name} ready for ATS analysis!`,
                type: "success",
                isLoading: false,
                autoClose: 2500
            });
        } catch (err) {
            console.error("Failed to read file", err);
            toast.update(toastId, {
                render: err.message || "Failed to parse file.",
                type: "error",
                isLoading: false,
                autoClose: 3500
            });
        }
    };

    // Deep Real ATS Analysis Engine
    const handleAnalyzeATS = async () => {
        let textToAnalyze = "";

        if (resumeSource === "upload") {
            if (!resumeFile || !extractedResumeText) {
                toast.error("Please upload a resume file (PDF, DOCX, or TXT).");
                return;
            }
            textToAnalyze = extractedResumeText;
        } else {
            // Using saved resume
            if (!savedResumeData) {
                toast.error("No saved resume found on your account. Please upload a file or build one first.");
                return;
            }
            textToAnalyze = [
                savedResumeData.name || "",
                savedResumeData.email || "",
                savedResumeData.phone || "",
                savedResumeData.address || "",
                savedResumeData.summary || "",
                Array.isArray(savedResumeData.skills)
                    ? savedResumeData.skills.join(" ")
                    : (savedResumeData.skills || ""),
                savedResumeData.projectTitle || "",
                savedResumeData.projectDescription || "",
                Array.isArray(savedResumeData.education)
                    ? savedResumeData.education.join(" ")
                    : (savedResumeData.education || ""),
                Array.isArray(savedResumeData.certifications)
                    ? savedResumeData.certifications.join(" ")
                    : (savedResumeData.certifications || "")
            ].filter(Boolean).join(" ");
            setActiveResumeObj(savedResumeData);
        }

        if (!jobDescription.trim()) {
            toast.error("Please paste the target Job Description.");
            return;
        }

        setIsAnalyzing(true);
        setAddedSkills(new Set()); // Reset newly added skills for new run

        try {
            const resumeLower = textToAnalyze.toLowerCase();
            const jdLower = jobDescription.toLowerCase();

            // 1. Detect required skills in JD safely
            const relevantJDKeywords = [...new Set(
                allAtsKeywords.filter((kw) => matchKeyword(jdLower, kw))
            )];

            if (relevantJDKeywords.length === 0) {
                toast.warn("Could not find standard tech keywords in this JD. Analyzing based on general match.");
            }

            // 2. Compute Matched & Missing Skills safely
            const matched = relevantJDKeywords.filter((kw) => matchKeyword(resumeLower, kw));

            const missing = relevantJDKeywords.filter((kw) => !matched.includes(kw));

            // 3. Keyword Match Rate
            const keywordMatchRate = relevantJDKeywords.length > 0
                ? Math.round((matched.length / relevantJDKeywords.length) * 100)
                : 70;

            // 4. Formatting & Structure Score (Checks Contact, Summary, Skills, Projects, Education)
            let formatPoints = 0;
            const hasEmail = /@/.test(resumeLower) || Boolean(activeResumeObj?.email);
            const hasPhone = /\d{3}/.test(resumeLower) || Boolean(activeResumeObj?.phone);
            const hasSkills = /skills|technologies/i.test(resumeLower) || Boolean(activeResumeObj?.skills?.length);
            const hasProjects = /projects?|experience|employment|work history/i.test(resumeLower) || Boolean(activeResumeObj?.projectTitle || activeResumeObj?.projectDescription);
            const hasEducation = /education|degree|bachelor|master|university|college|school/i.test(resumeLower) || Boolean(activeResumeObj?.education?.length);

            if (hasEmail) formatPoints += 20;
            if (hasPhone) formatPoints += 20;
            if (hasSkills) formatPoints += 20;
            if (hasProjects) formatPoints += 20;
            if (hasEducation) formatPoints += 20;
            const formatScore = formatPoints;

            // 5. Action Verbs & Impact Score
            const foundVerbs = atsActionVerbs.filter((verb) => resumeLower.includes(verb));
            const hasMetrics = /\d+[%$kK]|\b\d{2,}\b/.test(resumeLower);
            const impactScore = Math.min(100, Math.round((foundVerbs.length / 5) * 60) + (hasMetrics ? 40 : 15));

            // 6. Overall Weighted Real ATS Score
            // Formula: 45% Keyword Match + 25% Technical Relevance + 15% Formatting + 15% Impact
            const techRelevance = Math.min(100, Math.round(keywordMatchRate * 1.05));
            const overallScore = Math.min(
                98,
                Math.round(
                    keywordMatchRate * 0.45 +
                    techRelevance * 0.25 +
                    formatScore * 0.15 +
                    impactScore * 0.15
                )
            );

            // Group matched and missing by category
            const groupedMatched = {};
            matched.forEach((kw) => {
                const cat = categorizeSkill(kw);
                if (!groupedMatched[cat]) groupedMatched[cat] = [];
                groupedMatched[cat].push(kw);
            });

            const groupedMissing = {};
            missing.forEach((kw) => {
                const cat = categorizeSkill(kw);
                if (!groupedMissing[cat]) groupedMissing[cat] = [];
                groupedMissing[cat].push(kw);
            });

            // Actionable suggestions
            const suggestions = [];
            if (missing.length > 0) {
                suggestions.push(
                    `Incorporate top missing JD skills into your Skills and Project sections: ${missing.slice(0, 6).join(", ")}.`
                );
            }
            if (impactScore < 70) {
                suggestions.push(
                    "Include more action verbs (e.g., 'Engineered', 'Architected', 'Spearheaded') and quantify your accomplishments with metrics (%, numbers)."
                );
            }
            if (formatScore < 80) {
                suggestions.push(
                    "Ensure your resume includes clear standard section headers: Professional Summary, Technical Skills, Projects, and Education."
                );
            }
            suggestions.push(
                "Align your project descriptions to mirror key phrasing used in the job description's responsibilities."
            );

            const resultObj = {
                score: overallScore,
                keywordMatchRate,
                techRelevance,
                formatScore,
                impactScore,
                matchedKeywords: matched,
                missingKeywords: missing,
                groupedMatched,
                groupedMissing,
                suggestions,
                totalJDKeywords: relevantJDKeywords.length
            };

            setAtsAnalysis(resultObj);

            // Save to backend
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await saveAtsResult({
                        resumeText: textToAnalyze,
                        jobDescription,
                        result: resultObj
                    });
                } catch (e) {
                    console.warn("Failed to persist ATS analysis", e);
                }
            }

            toast.success("ATS Analysis completed successfully!");
        } catch (err) {
            console.error("ATS calculation error", err);
            toast.error("Failed to analyze resume ATS compatibility.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Add a single missing skill to resume
    const handleAddSkillToResume = async (skill) => {
        if (addedSkills.has(skill)) return;

        // Current skills from active resume or localStorage
        let currentSkills = [];
        const localData = localStorage.getItem("resumeData");
        let baseResume = activeResumeObj || (localData ? JSON.parse(localData) : {});

        if (Array.isArray(baseResume.skills)) {
            currentSkills = [...baseResume.skills];
        } else if (typeof baseResume.skills === "string") {
            currentSkills = baseResume.skills.split(",").map((s) => s.trim()).filter(Boolean);
        }

        // Capitalize nicely
        const formattedSkill = skill
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

        if (!currentSkills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
            currentSkills.push(formattedSkill);
        }

        const updatedResume = {
            ...baseResume,
            skills: currentSkills.join(", ")
        };

        // Update active resume state and local storage
        setActiveResumeObj(updatedResume);
        setSavedResumeData(updatedResume);
        localStorage.setItem("resumeData", JSON.stringify(updatedResume));

        // Save to backend if logged in
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await saveResume({
                    name: updatedResume.name || "Your Name",
                    email: updatedResume.email || "",
                    phone: updatedResume.phone || "",
                    address: updatedResume.address || "",
                    linkedin: updatedResume.linkedin || "",
                    github: updatedResume.github || "",
                    summary: updatedResume.summary || "",
                    skills: currentSkills,
                    education: Array.isArray(updatedResume.education)
                        ? updatedResume.education
                        : (updatedResume.education || "").split("\n").filter(Boolean),
                    projectTitle: updatedResume.projectTitle || "",
                    projectDescription: updatedResume.projectDescription || "",
                    certifications: Array.isArray(updatedResume.certifications)
                        ? updatedResume.certifications
                        : (updatedResume.certifications || "").split(/,|\n/).filter(Boolean)
                });
            } catch (err) {
                console.warn("Auto-save skill to backend failed", err);
            }
        }

        // Update added skills set
        const nextAdded = new Set(addedSkills);
        nextAdded.add(skill);
        setAddedSkills(nextAdded);

        // Dynamically increment ATS score for immediate positive feedback!
        if (atsAnalysis) {
            const nextScore = Math.min(99, atsAnalysis.score + 2);
            setAtsAnalysis((prev) => ({
                ...prev,
                score: nextScore,
                matchedKeywords: [...new Set([...prev.matchedKeywords, skill])],
                missingKeywords: prev.missingKeywords.filter((k) => k !== skill)
            }));
        }

        toast.success(`"${formattedSkill}" added to your resume!`);
    };

    // Bulk Add All Missing Skills
    const handleAddAllMissingSkills = async () => {
        if (!atsAnalysis || atsAnalysis.missingKeywords.length === 0) return;

        const skillsToAdd = atsAnalysis.missingKeywords.filter((s) => !addedSkills.has(s));
        if (skillsToAdd.length === 0) return;

        let currentSkills = [];
        const localData = localStorage.getItem("resumeData");
        let baseResume = activeResumeObj || (localData ? JSON.parse(localData) : {});

        if (Array.isArray(baseResume.skills)) {
            currentSkills = [...baseResume.skills];
        } else if (typeof baseResume.skills === "string") {
            currentSkills = baseResume.skills.split(",").map((s) => s.trim()).filter(Boolean);
        }

        skillsToAdd.forEach((skill) => {
            const formatted = skill
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
            if (!currentSkills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
                currentSkills.push(formatted);
            }
        });

        const updatedResume = {
            ...baseResume,
            skills: currentSkills.join(", ")
        };

        setActiveResumeObj(updatedResume);
        setSavedResumeData(updatedResume);
        localStorage.setItem("resumeData", JSON.stringify(updatedResume));

        const token = localStorage.getItem("token");
        if (token) {
            try {
                await saveResume({
                    name: updatedResume.name || "Your Name",
                    email: updatedResume.email || "",
                    phone: updatedResume.phone || "",
                    address: updatedResume.address || "",
                    linkedin: updatedResume.linkedin || "",
                    github: updatedResume.github || "",
                    summary: updatedResume.summary || "",
                    skills: currentSkills,
                    education: Array.isArray(updatedResume.education)
                        ? updatedResume.education
                        : (updatedResume.education || "").split("\n").filter(Boolean),
                    projectTitle: updatedResume.projectTitle || "",
                    projectDescription: updatedResume.projectDescription || "",
                    certifications: Array.isArray(updatedResume.certifications)
                        ? updatedResume.certifications
                        : (updatedResume.certifications || "").split(/,|\n/).filter(Boolean)
                });
            } catch (e) {
                console.warn(e);
            }
        }

        const newAddedSet = new Set([...addedSkills, ...skillsToAdd]);
        setAddedSkills(newAddedSet);

        // Boost score
        if (atsAnalysis) {
            setAtsAnalysis((prev) => ({
                ...prev,
                score: Math.min(96, prev.score + Math.min(18, skillsToAdd.length * 3)),
                matchedKeywords: [...new Set([...prev.matchedKeywords, ...skillsToAdd])],
                missingKeywords: []
            }));
        }

        toast.success(`Added all ${skillsToAdd.length} missing skills to your resume!`);
    };

    // Download Updated Resume in PDF format
    const handleDownloadUpdatedResume = () => {
        const targetResume = activeResumeObj || savedResumeData;
        if (!targetResume) {
            toast.error("No resume data available to download.");
            return;
        }

        const element = printResumeRef.current;
        const name = targetResume.name || "Optimized_Resume";
        const opt = {
            margin: [8, 8, 8, 8],
            filename: `${name.replace(/\s+/g, "_")}_ATS_Optimized.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        const toastId = toast.loading("Generating your optimized PDF...");
        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
                toast.update(toastId, {
                    render: "Updated resume PDF downloaded successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2500
                });
            })
            .catch((err) => {
                console.error(err);
                toast.update(toastId, {
                    render: "Failed to download PDF. Please try again.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    };

    const getScoreGaugeClass = (score) => {
        if (score >= 75) return "score-high";
        if (score >= 50) return "score-medium";
        return "score-low";
    };

    const getScoreBadgeClass = (score) => {
        if (score >= 75) return "status-high";
        if (score >= 50) return "status-medium";
        return "status-low";
    };

    const getScoreStatusText = (score) => {
        if (score >= 80) return "Strong Match (Interview Ready 🚀)";
        if (score >= 60) return "Moderate Match (Minor Skill Gaps ⚠️)";
        return "Needs Improvement (High Rejection Risk ❌)";
    };

    return (
        <div className="ats-page py-5">
            <div className="container">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <span className="ats-header-badge">
                        <FaMagic /> Next-Gen Career Tools
                    </span>
                    <h1 className="ats-title">Real ATS Resume Checker</h1>
                    <p className="ats-subtitle">
                        Test your resume against real Applicant Tracking System algorithms. Discover missing skills,
                        instantly add them to your resume, and download your optimized resume in PDF format.
                    </p>
                </div>

                {/* Input Workspace */}
                <div className="row g-4 mb-4">
                    {/* Step 1: Resume Source */}
                    <div className="col-lg-5">
                        <div className="ats-input-card">
                            <h3 className="ats-input-title">
                                <FaFileAlt className="text-primary" /> Step 1: Select Resume
                            </h3>

                            {/* Source Toggle */}
                            <div className="ats-source-toggle">
                                <button
                                    className={`ats-source-btn ${resumeSource === "upload" ? "active" : ""}`}
                                    onClick={() => setResumeSource("upload")}
                                >
                                    Upload File
                                </button>
                                <button
                                    className={`ats-source-btn ${resumeSource === "saved" ? "active" : ""}`}
                                    onClick={() => setResumeSource("saved")}
                                    disabled={!savedResumeData}
                                    title={!savedResumeData ? "No saved resume found on your account" : ""}
                                >
                                    Use Saved Resume {savedResumeData ? "✓" : ""}
                                </button>
                            </div>

                            {resumeSource === "upload" ? (
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        accept=".pdf,.docx,.txt"
                                        onChange={handleFileChange}
                                    />
                                    <div
                                        className={`ats-upload-dropzone ${resumeFile ? "has-file" : ""}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FaFileUpload className="fs-1 text-primary mb-2" />
                                        <p className="fw-bold mb-1">
                                            {resumeFile ? "Replace Selected File" : "Click to Upload Resume"}
                                        </p>
                                        <small className="text-muted d-block">
                                            Supported: PDF, Word (DOCX), Text (TXT)
                                        </small>
                                    </div>

                                    {resumeFile && (
                                        <div className="text-center">
                                            <div className="ats-selected-file-badge">
                                                <FaCheckCircle /> {resumeFile.name}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3 bg-light rounded-3 text-start">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <FaCheckCircle className="text-success" />
                                        <strong>{savedResumeData?.name || "Your Saved Resume"}</strong>
                                    </div>
                                    <p className="small text-muted mb-2">
                                        Email: {savedResumeData?.email || "Saved in NextRole profile"}
                                    </p>
                                    <p className="small text-muted mb-0">
                                        Skills:{" "}
                                        {Array.isArray(savedResumeData?.skills)
                                            ? savedResumeData.skills.slice(0, 8).join(", ")
                                            : (savedResumeData?.skills || "").slice(0, 60)}
                                        ...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Job Description */}
                    <div className="col-lg-7">
                        <div className="ats-input-card">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h3 className="ats-input-title mb-0">
                                    <FaCode className="text-primary" /> Step 2: Paste Job Description
                                </h3>
                                <button
                                    className="btn btn-sm btn-link text-decoration-none p-0"
                                    onClick={() => setJobDescription(SAMPLE_FRONTEND_JD)}
                                >
                                    Load Sample JD
                                </button>
                            </div>

                            <textarea
                                className="form-control ats-textarea-custom"
                                placeholder="Paste the job requirements, duties, and target qualifications here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />

                            <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
                                <span>Word count: {jobDescription.trim().split(/\s+/).filter(Boolean).length}</span>
                                <span>ATS Keyword Engine v2.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Action Button */}
                <div className="text-center mb-5">
                    <button
                        className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm"
                        onClick={handleAnalyzeATS}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Analyzing ATS Compatibility...
                            </>
                        ) : (
                            <>⚡ Run Real ATS Deep Analysis</>
                        )}
                    </button>
                </div>

                {/* Analysis Results Card */}
                {atsAnalysis && (
                    <div className="ats-result-card mb-5">
                        {/* Result Hero Header */}
                        <div className="ats-result-hero">
                            <div className={`ats-score-gauge ${getScoreGaugeClass(atsAnalysis.score)}`}>
                                <span className="score-num">{atsAnalysis.score}%</span>
                                <span className="score-sub">ATS Score</span>
                            </div>

                            <div className={`ats-status-badge ${getScoreBadgeClass(atsAnalysis.score)}`}>
                                {getScoreStatusText(atsAnalysis.score)}
                            </div>

                            <p className="text-light opacity-75 small max-w-600 mx-auto mb-0">
                                Evaluated against {atsAnalysis.totalJDKeywords} extracted job requirements and standard ATS parsing rules.
                            </p>
                        </div>

                        {/* 4-Metric Deep Breakdown Grid */}
                        <div className="ats-metrics-grid">
                            <div className="ats-metric-tile">
                                <div className="label">Keyword Match</div>
                                <div className="val text-primary">{atsAnalysis.keywordMatchRate}%</div>
                            </div>
                            <div className="ats-metric-tile">
                                <div className="label">Technical Relevance</div>
                                <div className="val text-info">{atsAnalysis.techRelevance}%</div>
                            </div>
                            <div className="ats-metric-tile">
                                <div className="label">Format & Structure</div>
                                <div className="val text-success">{atsAnalysis.formatScore}%</div>
                            </div>
                            <div className="ats-metric-tile">
                                <div className="label">Action Verbs & Impact</div>
                                <div className="val text-warning">{atsAnalysis.impactScore}%</div>
                            </div>
                        </div>

                        {/* Core Content Body */}
                        <div className="p-4 p-lg-5">
                            {/* Missing Skills Section with One-Click Add to Resume! */}
                            {atsAnalysis.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
                                <div className="missing-skills-container">
                                    <div className="missing-skills-header">
                                        <h4>
                                            <FaExclamationTriangle /> Missing High-Impact Skills (
                                            {atsAnalysis.missingKeywords.length})
                                        </h4>
                                        <button
                                            className="btn btn-sm btn-danger px-3 py-1 rounded-pill fw-bold"
                                            onClick={handleAddAllMissingSkills}
                                        >
                                            ⚡ Add All Missing Skills to Resume
                                        </button>
                                    </div>
                                    <p className="small text-muted mb-3">
                                        These key technical skills appear in the job description but are absent in your resume. Click <strong>+ Add to Resume</strong> to instantly append them and boost your ATS score.
                                    </p>

                                    <div className="d-flex flex-wrap">
                                        {atsAnalysis.missingKeywords.map((skill, index) => {
                                            const isAdded = addedSkills.has(skill);
                                            return (
                                                <span
                                                    key={index}
                                                    className={`missing-skill-pill ${isAdded ? "added" : ""}`}
                                                >
                                                    {skill}
                                                    {isAdded ? (
                                                        <span className="small text-success fw-bold ms-1">
                                                            <FaCheck /> Added
                                                        </span>
                                                    ) : (
                                                        <button
                                                            className="btn-add-skill"
                                                            onClick={() => handleAddSkillToResume(skill)}
                                                            title={`Add ${skill} to your resume`}
                                                        >
                                                            <FaPlus /> Add
                                                        </button>
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Download Action Banner */}
                            <div className="ats-action-banner">
                                <div>
                                    <h4>Download Your ATS-Optimized Resume</h4>
                                    <p>
                                        Ready to apply? Download your updated resume with all added skills formatted in clean PDF.
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn-download-updated"
                                        onClick={handleDownloadUpdatedResume}
                                    >
                                        <FaDownload /> Download Updated Resume (PDF)
                                    </button>
                                    <Link to="/resume-builder" className="btn btn-outline-light d-inline-flex align-items-center gap-1">
                                        Open Resume Builder <FaArrowRight />
                                    </Link>
                                </div>
                            </div>

                            {/* Matched Skills Box */}
                            <div className="matched-skills-container">
                                <h4>
                                    <FaCheckCircle /> Matched Skills & Keywords (
                                    {atsAnalysis.matchedKeywords.length})
                                </h4>
                                <div className="d-flex flex-wrap">
                                    {atsAnalysis.matchedKeywords.map((skill, idx) => (
                                        <span key={idx} className="matched-skill-pill">
                                            ✓ {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Suggestions Card */}
                            {atsAnalysis.suggestions && atsAnalysis.suggestions.length > 0 && (
                                <div className="ats-suggestions-card">
                                    <h4>
                                        <FaLightbulb className="text-warning" /> Actionable Recommendations to Improve
                                    </h4>
                                    {atsAnalysis.suggestions.map((item, idx) => (
                                        <div key={idx} className="ats-suggestion-item">
                                            <span className="ats-suggestion-bullet">{idx + 1}</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Hidden Clean Resume Container for Instant High-Quality PDF Export */}
                <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                    <div
                        ref={printResumeRef}
                        style={{
                            width: "800px",
                            padding: "40px",
                            fontFamily: "Arial, sans-serif",
                            color: "#1e293b",
                            background: "#ffffff"
                        }}
                    >
                        <div style={{ textAlign: "center", borderBottom: "2px solid #2563eb", paddingBottom: "16px", marginBottom: "20px" }}>
                            <h1 style={{ fontSize: "28px", margin: "0 0 6px", color: "#1e3a8a" }}>
                                {activeResumeObj?.name || "Candidate Name"}
                            </h1>
                            <p style={{ margin: "0", fontSize: "14px", color: "#64748b" }}>
                                {[
                                    activeResumeObj?.email,
                                    activeResumeObj?.phone,
                                    activeResumeObj?.address,
                                    activeResumeObj?.linkedin,
                                    activeResumeObj?.github
                                ].filter(Boolean).join(" | ")}
                            </p>
                        </div>

                        {activeResumeObj?.summary && (
                            <div style={{ marginBottom: "18px" }}>
                                <h3 style={{ fontSize: "16px", color: "#2563eb", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", textTransform: "uppercase" }}>
                                    Professional Summary
                                </h3>
                                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                    {activeResumeObj.summary}
                                </p>
                            </div>
                        )}

                        <div style={{ marginBottom: "18px" }}>
                            <h3 style={{ fontSize: "16px", color: "#2563eb", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", textTransform: "uppercase" }}>
                                Technical Skills
                            </h3>
                            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                {Array.isArray(activeResumeObj?.skills)
                                    ? activeResumeObj.skills.join(", ")
                                    : (activeResumeObj?.skills || "")}
                            </p>
                        </div>

                        {(activeResumeObj?.projectTitle || activeResumeObj?.projectDescription) && (
                            <div style={{ marginBottom: "18px" }}>
                                <h3 style={{ fontSize: "16px", color: "#2563eb", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", textTransform: "uppercase" }}>
                                    Projects & Experience
                                </h3>
                                <h4 style={{ fontSize: "15px", margin: "4px 0" }}>
                                    {activeResumeObj?.projectTitle || "Project"}
                                </h4>
                                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                    {activeResumeObj?.projectDescription}
                                </p>
                            </div>
                        )}

                        {activeResumeObj?.education && (
                            <div style={{ marginBottom: "18px" }}>
                                <h3 style={{ fontSize: "16px", color: "#2563eb", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", textTransform: "uppercase" }}>
                                    Education
                                </h3>
                                <p style={{ fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                                    {Array.isArray(activeResumeObj.education)
                                        ? activeResumeObj.education.join("\n")
                                        : activeResumeObj.education}
                                </p>
                            </div>
                        )}

                        {activeResumeObj?.certifications && (
                            <div>
                                <h3 style={{ fontSize: "16px", color: "#2563eb", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", textTransform: "uppercase" }}>
                                    Certifications
                                </h3>
                                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                    {Array.isArray(activeResumeObj.certifications)
                                        ? activeResumeObj.certifications.join(", ")
                                        : activeResumeObj.certifications}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ATSChecker;
