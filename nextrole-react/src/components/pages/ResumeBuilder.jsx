import { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import {
    FaDownload,
    FaFileUpload,
    FaMagic,
    FaSave,
    FaUser,
    FaFileAlt,
    FaCode,
    FaGraduationCap,
    FaBriefcase,
    FaAward,
    FaPalette,
    FaUndo,
    FaCheckCircle,
    FaTimes,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaLinkedin,
    FaGithub
} from "react-icons/fa";
import "./Resume.css";
import { toast } from "react-toastify";
import { saveResume, getResume } from "../../services/resumeService";
import {
    extractTextFromFile,
    parseResumeText,
    tailorResumeToJobDescription
} from "../../utils/resumeParser";

const SAMPLE_RESUME = {
    name: "Alex Morgan",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 342-9102",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan-dev",
    github: "github.com/alexmorgan-code",
    summary:
        "Results-oriented Associate Frontend Engineer with 2+ years of experience building modern, responsive, and accessible web applications using React, JavaScript (ES6+), TypeScript, and CSS3. Proven experience integrating RESTful APIs, optimizing component render cycles, and implementing clean state management workflows. Passionate about user-centric UI design and cross-functional Agile collaboration.",
    skills:
        "React, JavaScript (ES6+), TypeScript, HTML5, CSS3, Redux Toolkit, Tailwind CSS, Bootstrap, REST APIs, Git, GitHub, Vite, Jest, Responsive Design, Web Performance, Agile/Scrum",
    education:
        "Bachelor of Science in Computer Science\nState University | 2020 - 2024\nRelevant Coursework: Data Structures, Web Development, Software Engineering",
    projectTitle: "NextRole - Interactive Career Platform",
    projectDescription:
        "Architected an end-to-end career management dashboard featuring an interactive real-time resume builder, ATS job analyzer, and application tracker. Implemented asynchronous REST APIs, dynamic client-side PDF rendering with html2pdf, and modular state architecture. Achieved 95+ Google Lighthouse performance score.",
    certifications:
        "Meta Front-End Developer Professional Certificate, AWS Certified Cloud Practitioner"
};

const SAMPLE_JOB_DESCRIPTION = `Associate Frontend Engineer
Requirements:
- Strong proficiency in JavaScript, TypeScript, React, and modern CSS (Tailwind/Bootstrap).
- Experience building responsive Single Page Applications (SPAs) and integrating RESTful APIs.
- Familiarity with state management libraries (Redux or Zustand) and Git version control.
- Good understanding of web performance optimization, accessibility standards (a11y), and unit testing with Jest or React Testing Library.
- Passion for crafting clean, reusable UI components in an Agile team environment.`;

function ResumeBuilder() {
    const resumeRef = useRef();
    const fileInputRef = useRef();
    const isLoaded = useRef(false);

    // Active Editor Tab: 'personal' | 'summary' | 'skills' | 'experience' | 'education' | 'certifications'
    const [activeTab, setActiveTab] = useState("personal");

    // Template Theme: 'theme-modern' | 'theme-executive' | 'theme-tech'
    const [template, setTemplate] = useState("theme-modern");

    // Tailoring Modal State
    const [showTailorModal, setShowTailorModal] = useState(false);
    const [jobDescriptionInput, setJobDescriptionInput] = useState("");
    const [tailoringResult, setTailoringResult] = useState(null);
    const [isTailoring, setIsTailoring] = useState(false);
    const [isParsingFile, setIsParsingFile] = useState(false);
    const [previousResumeData, setPreviousResumeData] = useState(null);

    // Main Resume State
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem("resumeData");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved resumeData", e);
            }
        }
        return SAMPLE_RESUME;
    });

    // Load saved resume from backend on mount
    useEffect(() => {
        const loadSavedResume = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                isLoaded.current = true;
                return;
            }

            try {
                const response = await getResume();
                if (response?.resume) {
                    const saved = response.resume;
                    // Only load from backend if it has actual content (name or email)
                    if (saved.name || saved.email) {
                        setResumeData({
                            name: saved.name || "",
                            email: saved.email || "",
                            phone: saved.phone || "",
                            address: saved.address || "",
                            linkedin: saved.linkedin || "",
                            github: saved.github || "",
                            summary: saved.summary || "",
                            skills: Array.isArray(saved.skills)
                                ? saved.skills.join(", ")
                                : saved.skills || "",
                            education: Array.isArray(saved.education)
                                ? saved.education.join("\n")
                                : saved.education || "",
                            projectTitle: saved.projectTitle || "",
                            projectDescription: saved.projectDescription || "",
                            certifications: Array.isArray(saved.certifications)
                                ? saved.certifications.join(", ")
                                : saved.certifications || ""
                        });
                    }
                }
            } catch (error) {
                console.warn("Failed to load saved resume from backend — using localStorage data", error);
            } finally {
                isLoaded.current = true;
            }
        };

        loadSavedResume();
    }, []);

    // Debounced Auto-Save to LocalStorage and Backend
    useEffect(() => {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));

        if (!isLoaded.current) return;

        const timer = setTimeout(async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                await saveResume({
                    name: resumeData.name,
                    email: resumeData.email,
                    phone: resumeData.phone,
                    address: resumeData.address,
                    linkedin: resumeData.linkedin,
                    github: resumeData.github,
                    summary: resumeData.summary,
                    skills: (resumeData.skills || "")
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    education: (resumeData.education || "")
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    projectTitle: resumeData.projectTitle,
                    projectDescription: resumeData.projectDescription,
                    certifications: (resumeData.certifications || "")
                        .split(/,|\n/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                });
            } catch (err) {
                console.error("Auto-save resume error:", err);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [resumeData]);

    const handleChange = (e) => {
        setResumeData({
            ...resumeData,
            [e.target.name]: e.target.value
        });
    };

    // Manual Save
    const handleSaveResume = async () => {
        // Always persist to localStorage first (works offline)
        localStorage.setItem("resumeData", JSON.stringify(resumeData));

        const token = localStorage.getItem("token");
        if (!token) {
            toast.success("Resume saved locally! Log in to sync it to your account.");
            return;
        }

        const payload = {
            name: resumeData.name,
            email: resumeData.email,
            phone: resumeData.phone,
            address: resumeData.address,
            linkedin: resumeData.linkedin,
            github: resumeData.github,
            summary: resumeData.summary,
            skills: (resumeData.skills || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            education: (resumeData.education || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            projectTitle: resumeData.projectTitle,
            projectDescription: resumeData.projectDescription,
            certifications: (resumeData.certifications || "")
                .split(/,|\n/)
                .map((s) => s.trim())
                .filter(Boolean)
        };

        try {
            await saveResume(payload);
            toast.success("Resume saved to your account!");
        } catch (error) {
            console.error("Failed to save resume to backend:", error);
            // Local save already succeeded, so show partial success
            toast.info("Resume saved locally. Backend sync failed — check if the server is running.");
        }
    };

    // Upload & Parse Existing Resume (PDF, DOCX, TXT)
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsingFile(true);
        const toastId = toast.loading(`Parsing ${file.name}...`);

        try {
            const rawText = await extractTextFromFile(file);
            const parsed = parseResumeText(rawText);

            // Merge with current state (preserve what was extracted)
            setResumeData((prev) => ({
                ...prev,
                name: parsed.name || prev.name,
                email: parsed.email || prev.email,
                phone: parsed.phone || prev.phone,
                linkedin: parsed.linkedin || prev.linkedin,
                github: parsed.github || prev.github,
                summary: parsed.summary || prev.summary,
                skills: parsed.skills || prev.skills,
                education: parsed.education || prev.education,
                projectTitle: parsed.projectTitle || prev.projectTitle,
                projectDescription: parsed.projectDescription || prev.projectDescription,
                certifications: parsed.certifications || prev.certifications
            }));

            toast.update(toastId, {
                render: `Successfully parsed and loaded "${file.name}"!`,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
        } catch (err) {
            console.error("Resume file parse error:", err);
            toast.update(toastId, {
                render: err.message || "Failed to extract text from resume file.",
                type: "error",
                isLoading: false,
                autoClose: 3500
            });
        } finally {
            setIsParsingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Analyze & Tailor Resume to Job Description
    const handleAnalyzeAndTailor = () => {
        if (!jobDescriptionInput.trim()) {
            toast.error("Please paste a Job Description first.");
            return;
        }

        setIsTailoring(true);
        try {
            const result = tailorResumeToJobDescription(resumeData, jobDescriptionInput);
            setTailoringResult(result);
            toast.success(`Analysis ready! Detected role: ${result.targetRole}`);
        } catch (err) {
            toast.error(err.message || "Failed to analyze Job Description.");
        } finally {
            setIsTailoring(false);
        }
    };

    // Apply Tailored Changes
    const handleApplyTailoredChanges = () => {
        if (!tailoringResult) return;
        setPreviousResumeData({ ...resumeData });
        setResumeData(tailoringResult.tailoredResume);
        setShowTailorModal(false);
        toast.success("Tailored changes successfully applied to your resume!");
    };

    // Revert Tailored Changes
    const handleRevertChanges = () => {
        if (previousResumeData) {
            setResumeData(previousResumeData);
            setPreviousResumeData(null);
            toast.info("Reverted to your previous resume.");
        }
    };

    // Download High-Fidelity PDF
    const downloadResume = () => {
        if (!resumeData.name?.trim() || !resumeData.email?.trim()) {
            toast.error("Please fill your name and email before downloading.");
            return;
        }

        const element = resumeRef.current;
        const opt = {
            margin: [8, 8, 8, 8],
            filename: `${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        const toastId = toast.loading("Generating your PDF...");
        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
                toast.update(toastId, {
                    render: "Resume downloaded successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2500
                });
            })
            .catch((err) => {
                console.error("PDF generation error:", err);
                toast.update(toastId, {
                    render: "Failed to generate PDF. Please try again.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            });
    };

    // Parse skills array for clean badge display
    const skillsList = (resumeData.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    // Parse certifications
    const certsList = (resumeData.certifications || "")
        .split(/,|\n/)
        .map((c) => c.trim())
        .filter(Boolean);

    return (
        <div className="resume-builder-page py-4">
            <div className="container-fluid px-lg-5">
                {/* Top Control Bar */}
                <div className="builder-toolbar">
                    <div className="row align-items-center g-3">
                        <div className="col-lg-4 col-md-5">
                            <div className="builder-toolbar-title">
                                <h2>Real-World Resume Builder</h2>
                                <p>Interactive ATS-tailored resume studio</p>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-7">
                            <div className="toolbar-actions justify-content-md-end">
                                {/* Upload Resume Button */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    accept=".pdf,.docx,.txt"
                                    onChange={handleFileUpload}
                                />
                                <button
                                    className="btn-toolbar-action btn-upload-resume"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isParsingFile}
                                    title="Upload existing resume to auto-populate fields"
                                >
                                    <FaFileUpload />
                                    {isParsingFile ? "Importing..." : "Upload Resume"}
                                </button>

                                {/* Tailor to Job Description Button */}
                                <button
                                    className="btn-toolbar-action btn-tailor-jd"
                                    onClick={() => setShowTailorModal(true)}
                                    title="Paste a job description to tailor this resume"
                                >
                                    <FaMagic /> Tailor to Job
                                </button>

                                {/* Template Themes */}
                                <div className="template-selector ms-1 me-1">
                                    <FaPalette className="text-muted" />
                                    <span
                                        className={`template-pill ${template === "theme-modern" ? "active" : ""}`}
                                        onClick={() => setTemplate("theme-modern")}
                                    >
                                        Modern
                                    </span>
                                    <span
                                        className={`template-pill ${template === "theme-executive" ? "active" : ""}`}
                                        onClick={() => setTemplate("theme-executive")}
                                    >
                                        Executive
                                    </span>
                                    <span
                                        className={`template-pill ${template === "theme-tech" ? "active" : ""}`}
                                        onClick={() => setTemplate("theme-tech")}
                                    >
                                        Tech
                                    </span>
                                </div>

                                {/* Save Button */}
                                <button
                                    className="btn-toolbar-action btn-save-resume"
                                    onClick={handleSaveResume}
                                >
                                    <FaSave /> Save
                                </button>

                                {/* Download PDF Button */}
                                <button
                                    className="btn-toolbar-action btn-download-pdf"
                                    onClick={downloadResume}
                                >
                                    <FaDownload /> Download PDF
                                </button>

                                {/* Undo Tailoring Button if available */}
                                {previousResumeData && (
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleRevertChanges}
                                        title="Revert to state before tailoring"
                                    >
                                        <FaUndo /> Undo Tailor
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Split Studio: Left Editor, Right Live Resume Paper */}
                <div className="row g-4">
                    {/* Left: Interactive Section Editor */}
                    <div className="col-xl-5 col-lg-5">
                        <div className="builder-editor-card">
                            {/* Navigation Tabs */}
                            <div className="editor-tabs">
                                <button
                                    className={`editor-tab-btn ${activeTab === "personal" ? "active" : ""}`}
                                    onClick={() => setActiveTab("personal")}
                                >
                                    <FaUser /> Info
                                </button>
                                <button
                                    className={`editor-tab-btn ${activeTab === "summary" ? "active" : ""}`}
                                    onClick={() => setActiveTab("summary")}
                                >
                                    <FaFileAlt /> Summary
                                </button>
                                <button
                                    className={`editor-tab-btn ${activeTab === "skills" ? "active" : ""}`}
                                    onClick={() => setActiveTab("skills")}
                                >
                                    <FaCode /> Skills
                                </button>
                                <button
                                    className={`editor-tab-btn ${activeTab === "experience" ? "active" : ""}`}
                                    onClick={() => setActiveTab("experience")}
                                >
                                    <FaBriefcase /> Projects
                                </button>
                                <button
                                    className={`editor-tab-btn ${activeTab === "education" ? "active" : ""}`}
                                    onClick={() => setActiveTab("education")}
                                >
                                    <FaGraduationCap /> Education
                                </button>
                                <button
                                    className={`editor-tab-btn ${activeTab === "certifications" ? "active" : ""}`}
                                    onClick={() => setActiveTab("certifications")}
                                >
                                    <FaAward /> Certs
                                </button>
                            </div>

                            {/* Active Tab Form Body */}
                            <div className="editor-content-body">
                                {activeTab === "personal" && (
                                    <div>
                                        <div className="mb-3">
                                            <label className="section-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-modern"
                                                name="name"
                                                value={resumeData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Alex Morgan"
                                            />
                                        </div>

                                        <div className="row g-2 mb-3">
                                            <div className="col-md-6">
                                                <label className="section-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-modern"
                                                    name="email"
                                                    value={resumeData.email}
                                                    onChange={handleChange}
                                                    placeholder="alex@example.com"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="section-label">Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-modern"
                                                    name="phone"
                                                    value={resumeData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="section-label">Location / Address</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-modern"
                                                name="address"
                                                value={resumeData.address || ""}
                                                onChange={handleChange}
                                                placeholder="City, State / Remote"
                                            />
                                        </div>

                                        <div className="row g-2 mb-3">
                                            <div className="col-md-6">
                                                <label className="section-label">LinkedIn</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-modern"
                                                    name="linkedin"
                                                    value={resumeData.linkedin || ""}
                                                    onChange={handleChange}
                                                    placeholder="linkedin.com/in/username"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="section-label">GitHub / Portfolio</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-modern"
                                                    name="github"
                                                    value={resumeData.github || ""}
                                                    onChange={handleChange}
                                                    placeholder="github.com/username"
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setResumeData(SAMPLE_RESUME)}
                                            >
                                                Load Sample Profile
                                            </button>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setActiveTab("summary")}
                                            >
                                                Next: Summary →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "summary" && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="section-label mb-0">Professional Summary</label>
                                            <button
                                                className="btn btn-sm text-primary p-0 border-0"
                                                onClick={() => setShowTailorModal(true)}
                                            >
                                                <FaMagic /> Tailor to JD
                                            </button>
                                        </div>
                                        <textarea
                                            className="form-control form-control-modern"
                                            rows="7"
                                            name="summary"
                                            value={resumeData.summary}
                                            onChange={handleChange}
                                            placeholder="Write an impactful 3-4 sentence overview highlighting your core strengths, years of experience, and primary tech stack."
                                        />
                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setActiveTab("personal")}
                                            >
                                                ← Back: Info
                                            </button>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setActiveTab("skills")}
                                            >
                                                Next: Skills →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "skills" && (
                                    <div>
                                        <label className="section-label">Technical Skills (Comma Separated)</label>
                                        <textarea
                                            className="form-control form-control-modern"
                                            rows="5"
                                            name="skills"
                                            value={resumeData.skills}
                                            onChange={handleChange}
                                            placeholder="React, JavaScript, TypeScript, HTML5, CSS3, Redux, Git, REST APIs"
                                        />
                                        <div className="mt-3 p-3 bg-light rounded-3">
                                            <small className="text-muted d-block mb-2">
                                                <strong>Quick Add Tech Stack:</strong>
                                            </small>
                                            <div className="d-flex flex-wrap gap-1">
                                                {[
                                                    "React",
                                                    "TypeScript",
                                                    "Redux Toolkit",
                                                    "Next.js",
                                                    "Tailwind CSS",
                                                    "Jest",
                                                    "REST APIs",
                                                    "GSAP"
                                                ].map((skill) => (
                                                    <button
                                                        key={skill}
                                                        type="button"
                                                        className="btn btn-xs btn-outline-secondary py-1 px-2"
                                                        style={{ fontSize: "0.75rem" }}
                                                        onClick={() => {
                                                            const current = (resumeData.skills || "")
                                                                .split(",")
                                                                .map((s) => s.trim())
                                                                .filter(Boolean);
                                                            if (!current.some((s) => s.toLowerCase() === skill.toLowerCase())) {
                                                                setResumeData({
                                                                    ...resumeData,
                                                                    skills: [...current, skill].join(", ")
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        + {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setActiveTab("summary")}
                                            >
                                                ← Back: Summary
                                            </button>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setActiveTab("experience")}
                                            >
                                                Next: Projects →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "experience" && (
                                    <div>
                                        <div className="mb-3">
                                            <label className="section-label">Project / Role Title</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-modern"
                                                name="projectTitle"
                                                value={resumeData.projectTitle}
                                                onChange={handleChange}
                                                placeholder="e.g. NextRole - Modern Career Management Platform"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="section-label">Project Description & Accomplishments</label>
                                            <textarea
                                                className="form-control form-control-modern"
                                                rows="6"
                                                name="projectDescription"
                                                value={resumeData.projectDescription}
                                                onChange={handleChange}
                                                placeholder="Describe what you built, technologies utilized, challenges solved, and measurable impact."
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setActiveTab("skills")}
                                            >
                                                ← Back: Skills
                                            </button>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setActiveTab("education")}
                                            >
                                                Next: Education →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "education" && (
                                    <div>
                                        <label className="section-label">Education & Degree</label>
                                        <textarea
                                            className="form-control form-control-modern"
                                            rows="5"
                                            name="education"
                                            value={resumeData.education}
                                            onChange={handleChange}
                                            placeholder="Degree Name, University / College, Graduation Year, GPA / Relevant Coursework"
                                        />
                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setActiveTab("experience")}
                                            >
                                                ← Back: Projects
                                            </button>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setActiveTab("certifications")}
                                            >
                                                Next: Certs →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "certifications" && (
                                    <div>
                                        <label className="section-label">Certifications & Honors</label>
                                        <textarea
                                            className="form-control form-control-modern"
                                            rows="5"
                                            name="certifications"
                                            value={resumeData.certifications}
                                            onChange={handleChange}
                                            placeholder="Certifications separated by commas or new lines (e.g. AWS Certified Cloud Practitioner, Meta Front-End Developer)"
                                        />
                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setActiveTab("education")}
                                            >
                                                ← Back: Education
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={handleSaveResume}
                                            >
                                                <FaSave /> Save Resume
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Real-World Resume Document Surface */}
                    <div className="col-xl-7 col-lg-7">
                        <div className="resume-paper-container">
                            <div
                                className={`resume-paper ${template}`}
                                ref={resumeRef}
                                id="resume-document"
                            >
                                {/* Header / Contact */}
                                <div className="paper-header">
                                    <h1 className="paper-name">
                                        {resumeData.name || "Your Full Name"}
                                    </h1>
                                    <div className="paper-contact-bar">
                                        {resumeData.email && (
                                            <span className="paper-contact-item">
                                                <FaEnvelope /> {resumeData.email}
                                            </span>
                                        )}
                                        {resumeData.phone && (
                                            <span className="paper-contact-item">
                                                <FaPhone /> {resumeData.phone}
                                            </span>
                                        )}
                                        {resumeData.address && (
                                            <span className="paper-contact-item">
                                                <FaMapMarkerAlt /> {resumeData.address}
                                            </span>
                                        )}
                                        {resumeData.linkedin && (
                                            <span className="paper-contact-item">
                                                <FaLinkedin /> {resumeData.linkedin}
                                            </span>
                                        )}
                                        {resumeData.github && (
                                            <span className="paper-contact-item">
                                                <FaGithub /> {resumeData.github}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Summary */}
                                {resumeData.summary && (
                                    <div className="paper-section">
                                        <h3 className="paper-section-title">Professional Summary</h3>
                                        <p className="paper-summary-text">{resumeData.summary}</p>
                                    </div>
                                )}

                                {/* Skills */}
                                {skillsList.length > 0 && (
                                    <div className="paper-section">
                                        <h3 className="paper-section-title">Technical Skills</h3>
                                        <p className="paper-skills-text">
                                            {skillsList.join(", ")}
                                        </p>
                                    </div>
                                )}

                                {/* Projects & Experience */}
                                {(resumeData.projectTitle || resumeData.projectDescription) && (
                                    <div className="paper-section">
                                        <h3 className="paper-section-title">Projects & Experience</h3>
                                        <div className="paper-entry mb-3">
                                            <div className="paper-entry-header">
                                                <h4 className="paper-entry-title">
                                                    {resumeData.projectTitle || "Project Title"}
                                                </h4>
                                            </div>
                                            <p className="paper-entry-desc">
                                                {resumeData.projectDescription || "Project description and achievements..."}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {resumeData.education && (
                                    <div className="paper-section">
                                        <h3 className="paper-section-title">Education</h3>
                                        <div className="paper-entry-desc" style={{ whiteSpace: "pre-line" }}>
                                            {resumeData.education}
                                        </div>
                                    </div>
                                )}

                                {/* Certifications */}
                                {certsList.length > 0 && (
                                    <div className="paper-section">
                                        <h3 className="paper-section-title">Certifications & Credentials</h3>
                                        <ul className="paper-cert-list">
                                            {certsList.map((cert, idx) => (
                                                <li key={idx}>{cert}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Tailor Resume to Job Description */}
            {showTailorModal && (
                <div className="tailor-modal-overlay">
                    <div className="tailor-modal-dialog">
                        <div className="tailor-modal-header">
                            <div>
                                <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
                                    <FaMagic className="text-primary" /> Tailor Resume to Job Description
                                </h3>
                                <p className="text-muted small mb-0">
                                    Analyze job requirements and automatically align your summary, skills, and project highlights.
                                </p>
                            </div>
                            <button
                                className="btn btn-light rounded-circle p-2"
                                onClick={() => setShowTailorModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Input Area */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="form-label fw-semibold small text-muted">
                                    PASTE TARGET JOB DESCRIPTION
                                </label>
                                <button
                                    className="btn btn-sm btn-link text-decoration-none p-0"
                                    onClick={() => setJobDescriptionInput(SAMPLE_JOB_DESCRIPTION)}
                                >
                                    Load Sample JD
                                </button>
                            </div>
                            <textarea
                                className="form-control form-control-modern"
                                rows="6"
                                placeholder="Paste the full job description here (responsibilities, required skills, qualification)..."
                                value={jobDescriptionInput}
                                onChange={(e) => setJobDescriptionInput(e.target.value)}
                            />
                        </div>

                        <div className="text-end mb-4">
                            <button
                                className="btn btn-primary px-4"
                                onClick={handleAnalyzeAndTailor}
                                disabled={isTailoring}
                            >
                                {isTailoring ? "Analyzing JD..." : "⚡ Analyze & Generate Tailored Resume"}
                            </button>
                        </div>

                        {/* Tailoring Result Breakdown */}
                        {tailoringResult && (
                            <div className="tailor-analysis-results border-top pt-3">
                                {/* Score Comparison Meter */}
                                <div className="tailor-score-meter">
                                    <div className="score-meter-box before">
                                        <span className="small text-muted d-block">Original Match</span>
                                        <span className="num">{tailoringResult.scoreBefore}%</span>
                                    </div>
                                    <div className="text-muted fs-4">➔</div>
                                    <div className="score-meter-box after">
                                        <span className="small text-muted d-block">Tailored ATS Match</span>
                                        <span className="num">{tailoringResult.scoreAfter}%</span>
                                    </div>
                                </div>

                                <div className="alert alert-info py-2 small d-flex align-items-center gap-2 mb-3">
                                    <FaCheckCircle className="text-info" />
                                    <span>
                                        Target Role Identified: <strong>{tailoringResult.targetRole}</strong>.
                                        Added <strong>{tailoringResult.skillsAdded.length}</strong> missing in-demand skills.
                                    </span>
                                </div>

                                {/* Tailored Skills Injected */}
                                {tailoringResult.skillsAdded.length > 0 && (
                                    <div className="tailor-diff-card">
                                        <strong className="d-block small text-uppercase text-muted mb-2">
                                            Skills Injected from Job Description:
                                        </strong>
                                        <div className="d-flex flex-wrap gap-1">
                                            {tailoringResult.skillsAdded.map((skill, idx) => (
                                                <span key={idx} className="badge bg-primary text-white">
                                                    + {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tailored Summary Preview */}
                                <div className="tailor-diff-card">
                                    <strong className="d-block small text-uppercase text-muted mb-1">
                                        Tailored Professional Summary:
                                    </strong>
                                    <p className="small mb-0 text-dark">
                                        {tailoringResult.tailoredResume.summary}
                                    </p>
                                </div>

                                {/* Tailored Project Preview */}
                                <div className="tailor-diff-card">
                                    <strong className="d-block small text-uppercase text-muted mb-1">
                                        Tailored Project Description:
                                    </strong>
                                    <p className="small mb-0 text-dark">
                                        {tailoringResult.tailoredResume.projectDescription}
                                    </p>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowTailorModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-success px-4"
                                        onClick={handleApplyTailoredChanges}
                                    >
                                        <FaCheckCircle /> Apply to Resume Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResumeBuilder;
