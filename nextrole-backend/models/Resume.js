const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        email: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        phone: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        address: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        linkedin: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        github: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        summary: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        skills: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },
        education: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },
        projectTitle: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        projectDescription: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        },
        certifications: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Resume", resumeSchema);