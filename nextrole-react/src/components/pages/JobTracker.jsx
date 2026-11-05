import { useState, useEffect } from "react";
import "./Jobtracker.css";
import { toast } from "react-toastify";
import {
    createJob,
    getJobs,
    updateJob,
    deleteJob as deleteJobAPI
} from "../../services/jobService";

const STORAGE_KEY = "nextrole_job_applications";

const getLocalJobs = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const setLocalJobs = (jobs) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
        console.warn("Failed to persist jobs locally", e);
    }
};

function JobTracker() {
    const [jobs, setJobs] = useState(() => getLocalJobs());
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Applied");
    const [editingJobId, setEditingJobId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const data = await getJobs();
            const serverJobs = data?.jobs || (Array.isArray(data) ? data : []);

            if (serverJobs && serverJobs.length > 0) {
                setJobs(serverJobs);
                setLocalJobs(serverJobs);
            } else {
                const local = getLocalJobs();
                if (local.length > 0) {
                    setJobs(local);
                } else {
                    setJobs([]);
                    setLocalJobs([]);
                }
            }
        } catch (error) {
            console.warn("Backend unavailable, using local applications:", error);
            const local = getLocalJobs();
            if (local.length > 0) {
                setJobs(local);
            }
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Statistics
    const totalJobs = jobs.length;
    const appliedJobs = jobs.filter(job => job.status === "Applied").length;
    const interviewJobs = jobs.filter(job => job.status === "Interview").length;
    const offerJobs = jobs.filter(job => job.status === "Offer").length;
    const rejectedJobs = jobs.filter(job => job.status === "Rejected").length;

    const addJob = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (isSubmitting) return;

        if (company.trim() === "" || role.trim() === "") {
            toast.error("Please fill in company and role.");
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem("token");

        try {
            if (editingJobId === null) {
                // Add new application
                const tempId = "local_" + Date.now();
                let newJobItem = {
                    _id: tempId,
                    company: company.trim(),
                    role: role.trim(),
                    status,
                    createdAt: new Date().toISOString()
                };

                // Attempt cloud sync if token exists
                if (token) {
                    try {
                        const res = await createJob({
                            company: company.trim(),
                            role: role.trim(),
                            status
                        });
                        if (res?.job) {
                            newJobItem = res.job;
                        }
                    } catch (cloudErr) {
                        console.warn("Cloud sync failed, saved locally:", cloudErr);
                    }
                }

                const updatedJobs = [newJobItem, ...jobs.filter(j => j._id !== newJobItem._id)];
                setJobs(updatedJobs);
                setLocalJobs(updatedJobs);
                toast.success("Job added successfully!");
            } else {
                // Update existing application
                let updatedJobItem = {
                    _id: editingJobId,
                    company: company.trim(),
                    role: role.trim(),
                    status,
                    updatedAt: new Date().toISOString()
                };

                if (token && !String(editingJobId).startsWith("local_")) {
                    try {
                        const res = await updateJob(editingJobId, {
                            company: company.trim(),
                            role: role.trim(),
                            status
                        });
                        if (res?.job) {
                            updatedJobItem = res.job;
                        }
                    } catch (cloudErr) {
                        console.warn("Cloud update failed, updated locally:", cloudErr);
                    }
                }

                const updatedJobs = jobs.map(j => (j._id === editingJobId ? { ...j, ...updatedJobItem } : j));
                setJobs(updatedJobs);
                setLocalJobs(updatedJobs);
                toast.success("Job updated successfully!");
            }

            setCompany("");
            setRole("");
            setStatus("Applied");
            setEditingJobId(null);
        } catch (err) {
            console.error("Failed to save job:", err);
            toast.error("Failed to save job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const editJob = (job) => {
        setCompany(job.company);
        setRole(job.role);
        setStatus(job.status);
        setEditingJobId(job._id);
        window.scrollTo({ top: 100, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setCompany("");
        setRole("");
        setStatus("Applied");
        setEditingJobId(null);
    };

    const deleteJob = async (job) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${job.company} - ${job.role}?`
        );
        if (!confirmed) return;

        // Immediate optimistic delete locally
        const remaining = jobs.filter(j => j._id !== job._id);
        setJobs(remaining);
        setLocalJobs(remaining);

        const token = localStorage.getItem("token");
        if (token && !String(job._id).startsWith("local_")) {
            try {
                await deleteJobAPI(job._id);
            } catch (cloudErr) {
                console.warn("Cloud delete failed, deleted locally:", cloudErr);
            }
        }

        toast.success("Job deleted successfully!");
    };

    const filteredJobs = jobs.filter((job) => {
        const search = searchText.toLowerCase().trim();
        const matchesSearch =
            !search ||
            (job.company && job.company.toLowerCase().includes(search)) ||
            (job.role && job.role.toLowerCase().includes(search));

        const matchesStatus =
            statusFilter === "all" ||
            job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const exportCSV = () => {
        if (jobs.length === 0) {
            toast.info("No applications to export.");
            return;
        }

        let csv = "Company,Role,Status,Created At\n";
        jobs.forEach((job) => {
            const date = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "";
            csv += `"${(job.company || "").replace(/"/g, '""')}","${(job.role || "").replace(/"/g, '""')}","${job.status || "Applied"}","${date}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Job_Applications_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Jobs exported as CSV!");
    };

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Track Your Job Applications</h1>

            <div className="row">
                {/* Left Form: Add / Edit Application */}
                <div className="col-lg-4 mb-4">
                    <div className="card p-4 shadow-sm">
                        <h3 className="text-center mb-4">
                            {editingJobId === null ? "Add Application" : "Edit Application"}
                        </h3>

                        <form onSubmit={addJob}>
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">Company Name *</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Google, Stripe, Meta"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    autoFocus={editingJobId !== null}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">Job Title / Role *</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Associate Frontend Engineer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold">Application Status</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : editingJobId === null
                                            ? "Add Job"
                                            : "Update Job"}
                                </button>
                                {editingJobId !== null && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={cancelEdit}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Pipeline Dashboard & Applications Table */}
                <div className="col-lg-8">
                    <div className="card p-4 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <h3 className="mb-0">Applications Pipeline</h3>
                            {jobs.length > 0 && (
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={exportCSV}
                                >
                                    Export CSV
                                </button>
                            )}
                        </div>

                        {/* Pipeline Stats */}
                        <div className="row g-2 mb-4 text-center">
                            <div className="col">
                                <div className="stat-card">
                                    <h3>{totalJobs}</h3>
                                    <p className="text-muted small">Total</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="stat-card applied-card">
                                    <h3 className="text-primary">{appliedJobs}</h3>
                                    <p className="text-muted small">Applied</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="stat-card interview-card">
                                    <h3 className="text-warning">{interviewJobs}</h3>
                                    <p className="text-muted small">Interview</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="stat-card offer-card">
                                    <h3 className="text-success">{offerJobs}</h3>
                                    <p className="text-muted small">Offer</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="stat-card rejected-card">
                                    <h3 className="text-danger">{rejectedJobs}</h3>
                                    <p className="text-muted small">Rejected</p>
                                </div>
                            </div>
                        </div>

                        {/* Filter & Search Bar */}
                        <div className="row g-2 mb-3">
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by company or role..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses ({totalJobs})</option>
                                    <option value="Applied">Applied ({appliedJobs})</option>
                                    <option value="Interview">Interview ({interviewJobs})</option>
                                    <option value="Offer">Offer ({offerJobs})</option>
                                    <option value="Rejected">Rejected ({rejectedJobs})</option>
                                </select>
                            </div>
                        </div>

                        {/* Applications Table / Empty State */}
                        {filteredJobs.length === 0 ? (
                            <div className="text-center p-5 border rounded-3 bg-light">
                                <h5 className="text-muted mb-2">No Applications Found</h5>
                                <p className="text-secondary small mb-0">
                                    {jobs.length === 0
                                        ? "Start tracking your job applications by filling in the form on the left."
                                        : "No applications match your search or filter."}
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Company</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredJobs.map((job) => (
                                            <tr key={job._id}>
                                                <td className="fw-semibold text-dark">
                                                    {job.company}
                                                </td>
                                                <td>{job.role}</td>
                                                <td>
                                                    <span
                                                        className={`status-badge ${String(job.status || "applied").toLowerCase()}`}
                                                    >
                                                        {job.status || "Applied"}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() => editJob(job)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() => deleteJob(job)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobTracker;
