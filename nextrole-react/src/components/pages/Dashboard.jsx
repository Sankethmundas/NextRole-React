import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import { getJobs } from "../../services/jobService";
import { getResume } from "../../services/resumeService";
import { getCoverLetter } from "../../services/coverLetterService";
import { getAtsResults } from "../../services/atsService";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [jobCount, setJobCount] = useState(0);
    const [hasResume, setHasResume] = useState(false);
    const [hasCoverLetter, setHasCoverLetter] = useState(false);
    const [atsCount, setAtsCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const load = async () => {
            try {
                const jobsRes = await getJobs();
                setJobCount(jobsRes?.count || (jobsRes?.jobs?.length || 0));
            } catch (e) {
                console.warn("Failed to load jobs for dashboard", e);
            }

            try {
                const resumeRes = await getResume();
                setHasResume(!!resumeRes?.resume);
            } catch (e) {
                console.warn("Failed to load resume for dashboard", e);
            }

            try {
                const coverRes = await getCoverLetter();
                setHasCoverLetter(!!coverRes?.coverLetter);
            } catch (e) {
                console.warn("Failed to load cover letter for dashboard", e);
            }

            try {
                const atsRes = await getAtsResults();
                setAtsCount((atsRes?.atsResults || []).length);
            } catch (e) {
                console.warn("Failed to load ATS results for dashboard", e);
            }
        };

        load();
    }, []);

    const activityCards = [
        {
            title: "Resume Builder",
            description: hasResume
                ? "You have a saved resume on your account."
                : "Create and refine a polished resume.",
            link: "/resume-builder",
            badge: hasResume ? "Saved" : "Start now"
        },
        {
            title: "Job Tracker",
            description: jobCount > 0
                ? `You have ${jobCount} tracked job${jobCount > 1 ? "s" : ""}.`
                : "Keep all your applications in one place.",
            link: "/job-tracker",
            badge: jobCount > 0 ? `${jobCount} tracked` : "Track jobs"
        },
        {
            title: "ATS Checker",
            description: atsCount > 0
                ? `You have ${atsCount} saved ATS analyses.`
                : "Check how well your resume matches a job description.",
            link: "/ats-checker",
            badge: atsCount > 0 ? `${atsCount} saved` : "Analyze now"
        },
        {
            title: "Cover Letter",
            description: hasCoverLetter
                ? "You have a generated cover letter saved."
                : "Generate a tailored cover letter in seconds.",
            link: "/cover-letter",
            badge: hasCoverLetter ? "Saved" : "Create letter"
        }
    ];

    return (
        <div className="dashboard-page">
            <section className="dashboard-hero">
                <div>
                    <p className="dashboard-eyebrow">Welcome back</p>
                    <h1>Hi, {user?.name || "there"} 👋</h1>
                    <p className="dashboard-subtext">
                        This is your career workspace. Review your activity, keep your applications organized, and continue building your profile.
                    </p>
                </div>

                <div className="dashboard-summary-card">
                    <h3>Your activity snapshot</h3>
                    <ul>
                        <li><strong>{jobCount}</strong> job{jobCount === 1 ? "" : "s"} tracked</li>
                        <li><strong>{hasResume ? "1" : "0"}</strong> saved resume</li>
                        <li><strong>{atsCount}</strong> ATS analyses saved</li>
                    </ul>
                </div>
            </section>

            <section className="dashboard-grid">
                {activityCards.map((card) => (
                    <Link to={card.link} key={card.title} className="dashboard-card">
                        <span className="dashboard-badge">{card.badge}</span>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </Link>
                ))}
            </section>

            <section className="dashboard-bottom-section">
                <div className="dashboard-panel">
                    <h3>Recent focus</h3>
                    <p>
                        Your dashboard is designed to keep your job-search journey in one calm place. Use the tools above to build your resume, track companies, and prepare for interviews.
                    </p>
                </div>

                <div className="dashboard-panel">
                    <h3>What to do next</h3>
                    <ul>
                        <li>Update your resume with your latest experience</li>
                        <li>Track new roles you applied for</li>
                        <li>Run an ATS check before sending applications</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;