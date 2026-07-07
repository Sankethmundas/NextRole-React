const Resume = require('../models/Resume');

const saveResume = async (req, res) => {
    try {
        const user = req.user.userId;
        const { resumeData } = req.body;

        const resume = await Resume.findOneAndUpdate(
            { user },
            {
                user,
                ...resumeData
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return res.status(201).json({
            success: true,
            message: 'Resume saved successfully',
            resume
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error saving resume',
            error: error.message
        });
    }
};

const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.userId });

        return res.status(200).json({
            success: true,
            resume: resume || null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching resume',
            error: error.message
        });
    }
};

module.exports = {
    saveResume,
    getResume
};