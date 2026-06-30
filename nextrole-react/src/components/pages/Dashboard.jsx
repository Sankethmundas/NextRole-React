import "./Dashboard.css";

function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <h1>
                    Welcome, {user?.name} 👋
                </h1>

                <p>
                    Manage your career with NextRole.
                </p>

            </div>

            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h3>Resume Builder</h3>
                    <p>Create and update your resume.</p>
                </div>

                <div className="dashboard-card">
                    <h3>Job Tracker</h3>
                    <p>Track your job applications.</p>
                </div>

                <div className="dashboard-card">
                    <h3>ATS Checker</h3>
                    <p>Check your resume score.</p>
                </div>

                <div className="dashboard-card">
                    <h3>Cover Letter</h3>
                    <p>Generate AI cover letters.</p>
                </div>

            </div>

        </div>
    );

}

export default Dashboard;