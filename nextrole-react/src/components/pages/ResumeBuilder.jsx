
import { useState, useEffect } from "react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { FaDownload } from "react-icons/fa";
import "./Resume.css";
import { toast } from "react-toastify";
import { saveResume, getResume } from "../../services/resumeService";

function ResumeBuilder() {

    const resumeRef = useRef();

    const downloadResume = () => {
        if (
            !resumeData.name.trim() ||
            !resumeData.email.trim() ||
            !resumeData.phone.trim()
        ) {
            toast.error("Please fill your name, email, and phone before downloading the resume.");
            return;
        }

        html2pdf()
            .from(resumeRef.current)
            .save("resume.pdf");

        toast.success("Resume download started!");
    };

    const [resumeData, setResumeData] = useState(() => {

        const savedData =
            localStorage.getItem("resumeData");

        return savedData
            ? JSON.parse(savedData)
            : {
                name: "",
                email: "",
                phone: "",
                summary: "",
                skills: "",
                education: "",
                projectTitle: "",
                projectDescription: "",
                certifications: ""
            };

    });

    const handleChange = (e) => {
        setResumeData({
            ...resumeData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveResume = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please log in to save your resume.");
            return;
        }

        try {
            await saveResume({
                name: resumeData.name,
                email: resumeData.email,
                phone: resumeData.phone,
                summary: resumeData.summary,
                skills: resumeData.skills
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                education: resumeData.education
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                projectTitle: resumeData.projectTitle,
                projectDescription: resumeData.projectDescription,
                certifications: resumeData.certifications
                    .split(/,|\n/)
                    .map((item) => item.trim())
                    .filter(Boolean)
            });

            toast.success("Resume saved to backend!");
        } catch (error) {
            console.error("Failed to save resume", error);
            toast.error("Failed to save resume.");
        }
    };

    useEffect(() => {
        const loadSavedResume = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const response = await getResume();

                if (response?.resume) {
                    const savedResume = response.resume;

                    setResumeData({
                        name: savedResume.name || "",
                        email: savedResume.email || "",
                        phone: savedResume.phone || "",
                        summary: savedResume.summary || "",
                        skills: Array.isArray(savedResume.skills)
                            ? savedResume.skills.join(", ")
                            : (savedResume.skills || ""),
                        education: Array.isArray(savedResume.education)
                            ? savedResume.education.join("\n")
                            : (savedResume.education || ""),
                        projectTitle: savedResume.projectTitle || "",
                        projectDescription: savedResume.projectDescription || "",
                        certifications: Array.isArray(savedResume.certifications)
                            ? savedResume.certifications.join(", ")
                            : (savedResume.certifications || "")
                    });
                }
            } catch (error) {
                console.error("Failed to load saved resume", error);
            }
        };

        loadSavedResume();
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "resumeData",
            JSON.stringify(resumeData)
        );

        const timer = setTimeout(async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                await saveResume({
                    name: resumeData.name,
                    email: resumeData.email,
                    phone: resumeData.phone,
                    summary: resumeData.summary,
                    skills: resumeData.skills
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    education: resumeData.education
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    projectTitle: resumeData.projectTitle,
                    projectDescription: resumeData.projectDescription,
                    certifications: resumeData.certifications
                        .split(/,|\n/)
                        .map((item) => item.trim())
                        .filter(Boolean)
                });
            } catch (error) {
                console.error("Failed to save resume", error);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [resumeData]);

    return (
        <div className="container py-5">
            <h1 className="mb-4">
                Resume Builder
            </h1>

            <div className="row">
                <div className="col-lg-6  mb-4">
                    <div className="card p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">
                                Resume Information
                            </h3>
                            <button className="btn btn-success btn-sm" onClick={handleSaveResume}>
                                Save Resume
                            </button>
                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={resumeData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={resumeData.email}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Phone
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={resumeData.phone}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Professional Summary
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                name="summary"
                                value={resumeData.summary}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Skills
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Java, React, SQL"
                                name="skills"
                                value={resumeData.skills}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Education
                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                name="education"
                                value={resumeData.education}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="mb-3">

                            <label className="form-label">
                                Project Title
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="projectTitle"
                                value={resumeData.projectTitle}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="mb-3">

                            <label className="form-label">
                                Project Description
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                name="projectDescription"
                                value={resumeData.projectDescription}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Certifications
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                name="certifications"
                                value={resumeData.certifications}
                                onChange={handleChange}
                            />

                        </div>


                    </div>
                </div>

                <div className="col-lg-6">
                    <div
                        className="card p-4"
                        ref={resumeRef}
                    >
                        <div className="d-flex justify-content-end">
                            <button
                                className="download-btn"
                                onClick={downloadResume}
                            >
                                <FaDownload />
                            </button>
                        </div>

                        <h2>
                            {resumeData.name || "Your Name"}
                        </h2>



                        <p>
                            {resumeData.email || "Email"}
                        </p>

                        <p>
                            {resumeData.phone || "Phone Number"}
                        </p>

                        <hr />

                        <h5>Professional Summary</h5>

                        <p>
                            {resumeData.summary || "Your summary will appear here"}
                        </p>

                        <hr />

                        <h5>Skills</h5>
                        <ul>

                            {
                                resumeData.skills
                                    .split(",")
                                    .map((skill, index) => (

                                        <li key={index}>
                                            {skill.trim()}
                                        </li>

                                    ))
                            }

                        </ul>

                        <hr />

                        <h5>Education</h5>

                        <p>
                            {resumeData.education || "Education details"}
                        </p>

                        <hr />

                        <h5>Projects</h5>

                        <h6>
                            {resumeData.projectTitle || "Project Title"}
                        </h6>

                        <p>
                            {resumeData.projectDescription || "Project description"}
                        </p>

                        <h5>Certifications</h5>
                        <ul>
                            {
                                (resumeData.certifications || "")
                                    .split(/,|\n/)
                                    .filter(cert => cert.trim() !== "")
                                    .map((cert, index) => (
                                        <li key={index}>
                                            {cert.trim()}
                                        </li>
                                    ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResumeBuilder;