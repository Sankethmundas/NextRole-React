
import { useState, useEffect } from "react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { FaDownload } from "react-icons/fa";
import "./Resume.css";
import { toast } from "react-toastify";

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
                certififcations: ""
            };

    });

    const handleChange = (e) => {
        setResumeData({
            ...resumeData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {

        localStorage.setItem(
            "resumeData",
            JSON.stringify(resumeData)
        );

    }, [resumeData]);

    return (
        <div className="container py-5">
            <h1 className="mb-4">
                Resume Builder
            </h1>

            <div className="row">
                <div className="col-lg-6  mb-4">
                    <div className="card p-4">

                        <h3 className="mb-4">
                            Resume Information
                        </h3>

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
                                resumeData.certifications
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