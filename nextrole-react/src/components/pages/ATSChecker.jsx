import { useState } from "react";
import "./ATSChecker.css";
import mammoth from "mammoth";
import { toast } from "react-toastify";

function ATSChecker() {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [atsScore, setAtsScore] = useState(null);
    const [matchedKeywords, setMatchedKeywords] = useState([]);
    const [missingKeywords, setMissingKeywords] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [groupedMatched, setGroupedMatched] = useState({});
    const [groupedMissing, setGroupedMissing] = useState({});

    const extractTextFromDOCX = async (file) => {

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        return result.value;
    };

    const skillKeywords = [
        "html",
        "css",
        "javascript",
        "react",
        "reactjs",
        "bootstrap",
        "tailwind",
        "sql",
        "mysql",
        "mongodb",
        "firebase",
        "python",
        "java",
        "c++",
        "node",
        "nodejs",
        "express",
        "frontend",
        "backend",
        "full stack"
    ];

    const toolKeywords = [
        "git",
        "github",
        "api",
        "apis",
        "api integration",
        "responsive design",
        "localstorage",
        "form handling",
        "state management",
        "component-based architecture",
        "ui",
        "ux",
        "excel",
        "tableau",
        "power bi",
        "aws",
        "azure",
        "matlab"
    ];

    const certificationKeywords = [
        "certification",
        "certifications",
        "aws certification",
        "azure certification",
        "oracle java",
        "nptel",
        "coursera"
    ];

    const eligibilityKeywords = [
        "internship",
        "btech",
        "computer science",
        "problem solving",
        "problem-solving",
        "data analysis",
        "machine learning"
    ];

    const allKeywords = [
        ...skillKeywords,
        ...toolKeywords,
        ...certificationKeywords,
        ...eligibilityKeywords
    ];

    const groupKeywords = (keywords) => {
        return {
            Skills: keywords.filter((word) => skillKeywords.includes(word)),
            Tools: keywords.filter((word) => toolKeywords.includes(word)),
            Certifications: keywords.filter((word) =>
                certificationKeywords.includes(word)
            ),
            Eligibility: keywords.filter((word) =>
                eligibilityKeywords.includes(word)
            )
        };
    };


    const getScoreStatus = (score) => {
        if (score >= 75) {
            return "Strong Match";
        } else if (score >= 50) {
            return "Moderate Match";
        } else {
            return "Needs Improvement";
        }
    };

    const getScoreClass = (score) => {
        if (score >= 75) {
            return "score-high";
        } else if (score >= 50) {
            return "score-medium";
        } else {
            return "score-low";
        }
    };

    const handleCheckATS = async () => {
        if (!resumeFile || !jobDescription.trim()) {
            toast.error("Please upload a resume and paste the job description.");
            return;
        }
        setIsChecking(true);

        try {
            let resumeText = "";

            if (resumeFile.name.toLowerCase().endsWith(".docx")) {
                resumeText = await extractTextFromDOCX(resumeFile);
            } else {
                toast.error("Please upload only DOCX file for now.");
                setIsChecking(false);
                return;
            }

            const resumeLower = resumeText.toLowerCase();
            const jdLower = jobDescription.toLowerCase();

            const relevantJDKeywords = allKeywords.filter((keyword) =>
                jdLower.includes(keyword)
            );

            const uniqueJDKeywords = [...new Set(relevantJDKeywords)];

            const matched = uniqueJDKeywords.filter((keyword) =>
                resumeLower.includes(keyword)
            );

            const missing = uniqueJDKeywords.filter((keyword) =>
                !resumeLower.includes(keyword)
            );

            const score = uniqueJDKeywords.length > 0
                ? Math.round((matched.length / uniqueJDKeywords.length) * 100)
                : 0;

            const matchedGroups = groupKeywords(matched);
            const missingGroups = groupKeywords(missing);

            const generatedSuggestions = [];

            if (uniqueJDKeywords.length === 0) {
                toast.error("No recognizable ATS keywords found in the job description.");
                setIsChecking(false);
                return;
            }

            if (missing.length > 0) {
                generatedSuggestions.push(
                    `Add these missing keywords to your resume where relevant: ${missing.slice(0, 8).join(", ")}.`
                );
            }

            if (score < 50) {
                generatedSuggestions.push(
                    "Your ATS score is low. Try aligning your skills, projects, and experience more closely with the job description."
                );
            }

            if (score >= 50 && score < 75) {
                generatedSuggestions.push(
                    "Your resume matches the job description partially. Add more relevant technical skills, tools, and role-specific keywords."
                );
            }

            if (score >= 75) {
                generatedSuggestions.push(
                    "Your resume has a strong ATS match. You can further improve it by tailoring project descriptions and achievements to the role."
                );
            }

            generatedSuggestions.push(
                "Use exact job-title keywords, technical skills, and important tools from the job description naturally inside your resume."
            );

            toast.success("ATS score generated successfully!");
            setMatchedKeywords(matched);
            setMissingKeywords(missing);
            setAtsScore(score);
            setSuggestions(generatedSuggestions);
            setGroupedMatched(matchedGroups);
            setGroupedMissing(missingGroups);

        } catch (error) {
            console.error("ATS Error:", error);
            toast.error("Failed to read the resume file.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="ats-page container py-5">
            <div className="text-center mb-5">
                <h1>ATS Resume Checker</h1>
                <p>
                    Upload your resume and compare it with a job description to see how well it matches ATS requirements.
                </p>
            </div>

            <div className="row g-4">
                {/* Resume Upload */}
                <div className="col-lg-5">
                    <div className="card shadow-sm p-4 h-100">
                        <h2 className="mb-4 text-center">Upload Resume</h2>

                        <div className="upload-box">
                            <input
                                type="file"
                                accept=".docx"
                                className="form-control"
                                onChange={(e) =>
                                    setResumeFile(e.target.files[0])
                                }
                            />
                            <p className="upload-note mt-3 mb-0">
                                Supported formats: DOCX
                            </p>

                            {resumeFile && (
                                <div className="selected-file mt-3">
                                    <strong>Selected File:</strong> {resumeFile.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="col-lg-7">
                    <div className="card shadow-sm p-4 h-100">
                        <h2 className="mb-4 text-center">Job Description</h2>

                        <textarea
                            className="form-control ats-textarea"
                            rows="12"
                            placeholder="Paste job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary px-4 py-2"
                    onClick={handleCheckATS}
                    disabled={isChecking}
                >
                    {isChecking ? "Checking..." : "Check ATS Score"}
                </button>
            </div>

            {atsScore !== null && (
                <div className="card shadow-sm p-4 mt-5 ats-result-card">
                    <h2 className="text-center mb-4">ATS Analysis Result</h2>

                    <div className="text-center mb-4">
                        <div className={`ats-score-circle ${getScoreClass(atsScore)}`}>
                            {atsScore}%
                        </div>

                        <p className="mt-3 score-label">
                            ATS Match Score
                        </p>

                        <p className="score-status">
                            {getScoreStatus(atsScore)}
                        </p>

                        <p className="score-summary">
                            {atsScore >= 75 &&
                                "Your resume aligns well with this job description. Only minor improvements may be needed."}

                            {atsScore >= 50 && atsScore < 75 &&
                                "Your resume matches the job description partially. Adding a few missing skills and tools can improve it."}

                            {atsScore < 50 &&
                                "Your resume needs better alignment with the job description. Focus on adding relevant skills, tools, and keywords."}
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="keyword-box matched-box">
                                <h4>Matched Keywords</h4>

                                {Object.entries(groupedMatched).map(([category, items]) =>
                                    items.length > 0 ? (
                                        <div key={category} className="keyword-group">
                                            <h5>{category}</h5>
                                            <ul>
                                                {items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="keyword-box missing-box">
                                <h4>Missing Keywords</h4>

                                {Object.entries(groupedMissing).map(([category, items]) =>
                                    items.length > 0 ? (
                                        <div key={category} className="keyword-group">
                                            <h5>{category}</h5>
                                            <ul>
                                                {items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="suggestions-box mt-4">
                        <h4>Suggestions to Improve ATS Score</h4>

                        <ul>
                            {suggestions.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

        </div >
    );
}

export default ATSChecker;