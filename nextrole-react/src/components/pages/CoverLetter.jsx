import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { FiCopy, FiDownload } from "react-icons/fi";
import "./CoverLetter.css";
import { toast } from "react-toastify";

function CoverLetter() {

    const previewRef = useRef();
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        company: "",
        skills: "",
        fit: "",
        tone: "Professional"
    });

    const [generatedLetter, setGeneratedLetter] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGenerateLetter = () => {

        if (
            !formData.name ||
            !formData.role ||
            !formData.company ||
            !formData.skills ||
            !formData.fit
        ) {
            toast.error("Please fill all fields before generating the cover letter.");
            return;
        }

        let intro = "";
        let body = "";
        let closing = "";

        if (formData.tone === "Professional") {
            intro = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${formData.role} position at ${formData.company}.`;
            body = `With skills and experience in ${formData.skills}, I believe I am a strong candidate for this opportunity. ${formData.fit}`;
            closing = `I would welcome the opportunity to contribute to ${formData.company} and discuss how my background aligns with your needs.\n\nSincerely,\n${formData.name}`;
        }

        else if (formData.tone === "Confident") {
            intro = `Dear Hiring Manager,\n\nI am excited to apply for the ${formData.role} role at ${formData.company}.`;
            body = `My background in ${formData.skills} has prepared me to take on this role with confidence. ${formData.fit}`;
            closing = `I am confident that my skills and project experience would make me a valuable addition to ${formData.company}. I would be glad to discuss my application further.\n\nBest regards,\n${formData.name}`;
        }

        else if (formData.tone === "Friendly") {
            intro = `Dear Hiring Manager,\n\nI hope you are doing well. I’m excited to apply for the ${formData.role} position at ${formData.company}.`;
            body = `I have worked on ${formData.skills}, and I feel that my background makes me a great fit for this role. ${formData.fit}`;
            closing = `Thank you for taking the time to review my application. I’d be happy to discuss how I can contribute to ${formData.company}.\n\nWarm regards,\n${formData.name}`;
        }

        const finalLetter = `${intro}\n\n${body}\n\n${closing}`;

        setGeneratedLetter(finalLetter);
    };

    const handleCopyLetter = async () => {

        if (!generatedLetter) {
            toast.error("Generate a cover letter first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(generatedLetter);
            toast.success("Cover letter copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy cover letter.");
        }
    };

    const handleDownloadPDF = () => {

        if (!generatedLetter) {
            toast.error("Generate a cover letter first.");
            return;
        }

        const options = {
            margin: 0.5,
            filename: "cover-letter.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf()
            .set(options)
            .from(previewRef.current)
            .save();

        toast.success("Cover letter download started!");
    };

    return (
        <div className="cover-letter-page container py-5">

            <div className="text-center mb-5">
                <h1>Cover Letter Generator</h1>
                <p>
                    Create tailored cover letters for every job application in seconds.
                </p>
            </div>

            <div className="row g-4">

                {/* Left Side Form */}
                <div className="col-lg-5">
                    <div className="card shadow-sm p-4 h-100">
                        <h2 className="mb-4 text-center">
                            Create Cover Letter
                        </h2>

                        <div className="mb-3">
                            <label className="form-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Job Role
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Frontend Developer Intern"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Company Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Google / Infosys / Amazon"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Skills / Experience
                            </label>
                            <textarea
                                className="form-control"
                                rows="3"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, Resume Builder project, Job Tracker project..."
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Why are you a good fit?
                            </label>
                            <textarea
                                className="form-control"
                                rows="3"
                                name="fit"
                                value={formData.fit}
                                onChange={handleChange}
                                placeholder="Explain why you fit this role"
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                Tone
                            </label>
                            <select
                                className="form-select"
                                name="tone"
                                value={formData.tone}
                                onChange={handleChange}
                            >
                                <option>Professional</option>
                                <option>Confident</option>
                                <option>Friendly</option>
                            </select>
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleGenerateLetter}
                        >
                            Generate Cover Letter
                        </button>
                    </div>
                </div>

                {/* Right Side Preview */}
                <div className="col-lg-7">
                    <div className="card shadow-sm p-4 h-100 cover-preview-card">
                        <h2 className="mb-3 text-center">
                            Cover Letter Preview
                        </h2>

                        <div className="cover-top-bar">
                            <div className="cover-actions">
                                <span
                                    className="cover-icon"
                                    onClick={handleCopyLetter}
                                    title="Copy Cover Letter"
                                >
                                    <FiCopy />
                                </span>

                                <span
                                    className="cover-icon"
                                    onClick={handleDownloadPDF}
                                    title="Download PDF"
                                >
                                    <FiDownload />
                                </span>
                            </div>
                        </div>

                        <div className="cover-preview" ref={previewRef}>
                            {
                                generatedLetter ? (
                                    <p>{generatedLetter}</p>
                                ) : (
                                    <div className="empty-preview text-center">
                                        <h4>No Cover Letter Generated Yet</h4>
                                        <p>
                                            Fill the form and generate your cover letter.
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoverLetter;