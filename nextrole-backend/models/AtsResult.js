const mongoose = require("mongoose");

const atsResultSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        resumeText: {
            type: String,
            default: ""
        },
        jobDescription: {
            type: String,
            default: ""
        },
        result: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("AtsResult", atsResultSchema);
