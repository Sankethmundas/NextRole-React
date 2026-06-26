import { useState, useEffect } from "react";
import "./Jobtracker.css";
import { toast } from "react-toastify";

function JobTracker() {

    const [jobs, setJobs] = useState(() => {
        const savedJobs = localStorage.getItem("jobs");
        return savedJobs
            ? JSON.parse(savedJobs)
            : [];
    });

    const [company, setCompany] = useState("");

    const [role, setRole] = useState("");

    const [status, setStatus] = useState("Applied");

    const [editIndex, setEditIndex] = useState(-1);

    const [searchText, setSearchText] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const totalJobs = jobs.length;

    const appliedJobs = jobs.filter(
        job => job.status === "Applied"
    ).length;

    const interviewJobs = jobs.filter(
        job => job.status === "Interview"
    ).length;

    const offerJobs = jobs.filter(
        job => job.status === "Offer"
    ).length;

    const rejectedJobs = jobs.filter(
        job => job.status === "Rejected"
    ).length;

    useEffect(() => {
        localStorage.setItem(
            "jobs",
            JSON.stringify(jobs)
        );

    }, [jobs]);

    const addJob = () => {

        if (
            company.trim() === "" ||
            role.trim() === ""
        ) {
            toast.error("Please fill in company and role.");
            return;
        }

        const newJob = {

            company,
            role,
            status

        };

        if (editIndex === -1) {

            setJobs([
                ...jobs,
                newJob
            ]);
            toast.success("Job added successfully!");
        }else {
            const updatedJobs = [...jobs];
            updatedJobs[editIndex] = newJob;
            setJobs(updatedJobs);
            setEditIndex(-1);
            toast.success("Job updated successfully!");
        }

        setCompany("");
        setRole("");
        setStatus("Applied");

    };

    const editJob = (index) => {
        const job = jobs[index];
        setCompany(job.company);
        setRole(job.role);
        setStatus(job.status);
        setEditIndex(index);
    };

    const deleteJob = (index) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        const updatedJobs =
            jobs.filter((_, i) => i !== index);

        setJobs(updatedJobs);
        toast.success("Job deleted successfully!");

    };

    const filteredJobs = jobs.filter((job) => {

        const matchesSearch =
            job.company
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                );

        const matchesStatus =
            statusFilter === "all" ||
            job.status === statusFilter;

        return (
            matchesSearch &&
            matchesStatus
        );

    });

    const exportCSV = () => {

        let csv =
            "Company,Role,Status\n";

        jobs.forEach((job) => {

            csv +=
                `${job.company},${job.role},${job.status}\n`;

        });

        const blob = new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");
        link.href = url;
        link.download = "jobs.csv";
        link.click();
        toast.success("Jobs exported as CSV!");
    };

    return (

        <div className="container py-5">

            <h1 className="text-center mb-4">
                Track Your Job Applications
            </h1>

            <div className="row">

                <div className="col-lg-4 mb-4">

                    <div className="card p-4">

                        <h3 className="text-center mb-4">Add Application</h3>

                        <input
                            className="form-control mb-3"
                            placeholder="Company"
                            value={company}
                            onChange={(e) =>
                                setCompany(e.target.value)
                            }
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Role"
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        />

                        <select
                            className="form-select mb-3"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >

                            <option>Applied</option>

                            <option>Interview</option>

                            <option>Rejected</option>

                            <option>Offer</option>

                        </select>

                        <button
                            className="btn btn-primary w-100"
                            onClick={addJob}
                        >
                            {
                                editIndex === -1
                                    ? "Add Job"
                                    : "Update Job"
                            }
                        </button>

                    </div>

                </div>

                <div className="col-lg-8">

                    <div className="card p-4">

                        <h3 className="mb-4">
                            Applications
                        </h3>

                        <div className="row mb-4">

                            <div className="col mb-3">
                                <div className="stat-card">
                                    <h3>{totalJobs}</h3>
                                    <p>Total Applications</p>
                                </div>
                            </div>

                            <div className="col mb-3">
                                <div className="stat-card applied-card">
                                    <h3>{appliedJobs}</h3>
                                    <p>Applied</p>
                                </div>
                            </div>

                            <div className="col mb-3">
                                <div className="stat-card interview-card">
                                    <h3>{interviewJobs}</h3>
                                    <p>Interviews</p>
                                </div>
                            </div>

                            <div className="col mb-3">
                                <div className="stat-card offer-card">
                                    <h3>{offerJobs}</h3>
                                    <p>Offers</p>
                                </div>
                            </div>

                            <div className="col mb-3">
                                <div className="stat-card offer-card">
                                    <h3>{rejectedJobs}</h3>
                                    <p>Rejected</p>
                                </div>
                            </div>

                        </div>


                        <button
                            className="btn btn-primary mb-3"
                            onClick={exportCSV}
                        >
                            Export CSV
                        </button>

                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search company..."
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.target.value)
                            }
                        />


                        <select
                            className="form-select mb-3"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="all">
                                All Statuses
                            </option>

                            <option value="Applied">
                                Applied
                            </option>

                            <option value="Interview">
                                Interview
                            </option>

                            <option value="Offer">
                                Offer
                            </option>

                            <option value="Rejected">
                                Rejected
                            </option>

                        </select>

                        {
                            filteredJobs.length === 0 ? (

                                <div className="text-center p-5">

                                    <h4>
                                        No Applications Found
                                    </h4>

                                    <p>
                                        Start tracking your job applications.
                                    </p>

                                </div>

                            ) : (

                                <table className="table">
                                    ...
                                </table>

                            )
                        }
                        <div className="table-responsive">
                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>Company</th>

                                        <th>Role</th>

                                        <th>Status</th>

                                        <th>Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        filteredJobs.map((job, index) => (

                                            <tr key={index}>

                                                <td>
                                                    {job.company}
                                                </td>

                                                <td>
                                                    {job.role}
                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${job.status.toLowerCase()}`}
                                                    >
                                                        {job.status}
                                                    </span>

                                                </td>

                                                <td>

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            editJob(index)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteJob(index)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>



                </div>

            </div>

        </div>

    );

}

export default JobTracker;