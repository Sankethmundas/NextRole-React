const Resume = require('../models/Resume');

const getUserId = (req) => req.user?.userId || req.user?.id || req.user?._id;

const saveResume = async (req, res) => {
    try {
        const user = getUserId(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User authentication failed. Please log in again.'
            });
        }
        const resumeData = req.body.resumeData || req.body;

        const resume = await Resume.findOneAndUpdate(
            { user },
            {
                user,
                ...resumeData
            },
            {
                returnDocument: 'after',
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
        const user = getUserId(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User authentication failed. Please log in again.'
            });
        }
        const resume = await Resume.findOne({ user });

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