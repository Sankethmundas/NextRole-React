const mongoose = require("mongoose");

const coverLetterSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        formData: {
            type: Object,
            default: {}
        },
        generatedLetter: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CoverLetter", coverLetterSchema);
