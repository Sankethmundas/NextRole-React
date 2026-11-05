const Job = require("../models/job");

const getUserId = (req) => req.user?.userId || req.user?.id || req.user?._id;

const createJob = async (req, res) => {
    try {
        const { company, role, status } = req.body;
        if (!company || !role) {
            return res.status(400).json({
                success: false,
                message: "Company and role are required."
            });
        }
        const user = getUserId(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Please log in again."
            });
        }
        const job = await Job.create({
            company: company.trim(),
            role: role.trim(),
            status: status || "Applied",
            user
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating job",
            error: error.message
        });
    }
};

const getJobs = async (req, res) => {
    try {
        const user = getUserId(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Please log in again."
            });
        }
        const jobs = await Job.find({ user }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching jobs",
            error: error.message
        });
    }
};

const updateJob = async (req, res) => {
    try {
        const id = req.params.id;
        const { company, role, status } = req.body;
        const user = getUserId(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Please log in again."
            });
        }
        const job = await Job.findOne({ _id: id, user });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        if (company) job.company = company.trim();
        if (role) job.role = role.trim();
        if (status) job.status = status;

        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating job",
            error: error.message
        });
    }
};

const deleteJob = async (req, res) => {
    try {
        const id = req.params.id;
        const user = getUserId(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Please log in again."
            });
        }
        const job = await Job.findOne({ _id: id, user });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        await job.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting job",
            error: error.message
        });
    }
};

module.exports = {
    createJob,
    getJobs,
    updateJob,
    deleteJob
};
