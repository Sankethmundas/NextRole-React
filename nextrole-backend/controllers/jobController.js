const Job = require("../models/Job");


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

module.exports = {
    createJob
};