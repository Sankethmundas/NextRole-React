const Job = require("../models/job");


const createJob = async (req, res) => {
    try {
        const { company, role, status } = req.body;
        if (!company || !role) {

            return res.status(400).json({
                success: false,
                message: "Company and role are required."
            });

        }
        const user = req.user.userId;
        const job = await Job.create({
            company,
            role,
            status,
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
}

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            user: req.user.userId
        });
        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    }
    catch (error) {
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
        const job = await Job.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        job.company = company;
        job.role = role;
        job.status = status;

        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error updating job",
            error: error.message
        })

    }

};

const deleteJob = async (req, res) => {

    try {
        const id = req.params.id;
        const job = await Job.findOne({
            _id: id,
            user: req.user.userId
        });
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
