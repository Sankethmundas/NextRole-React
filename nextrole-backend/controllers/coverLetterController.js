const CoverLetter = require("../models/CoverLetter");

const buildCoverLetterText = (formData) => {
    const { name, role, company, skills, fit, tone = "Professional" } = formData || {};

    if (!name || !role || !company || !skills || !fit) {
        throw new Error("Please provide name, role, company, skills, and fit details.");
    }

    let intro = "";
    let body = "";
    let closing = "";

    if (tone === "Professional") {
        intro = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${role} position at ${company}.`;
        body = `With skills and experience in ${skills}, I believe I am a strong candidate for this opportunity. ${fit}`;
        closing = `I would welcome the opportunity to contribute to ${company} and discuss how my background aligns with your needs.\n\nSincerely,\n${name}`;
    } else if (tone === "Confident") {
        intro = `Dear Hiring Manager,\n\nI am excited to apply for the ${role} role at ${company}.`;
        body = `My background in ${skills} has prepared me to take on this role with confidence. ${fit}`;
        closing = `I am confident that my skills and project experience would make me a valuable addition to ${company}. I would be glad to discuss my application further.\n\nBest regards,\n${name}`;
    } else {
        intro = `Dear Hiring Manager,\n\nI hope you are doing well. I’m excited to apply for the ${role} position at ${company}.`;
        body = `I have worked on ${skills}, and I feel that my background makes me a great fit for this role. ${fit}`;
        closing = `Thank you for taking the time to review my application. I’d be happy to discuss how I can contribute to ${company}.\n\nWarm regards,\n${name}`;
    }

    return `${intro}\n\n${body}\n\n${closing}`;
};

const saveCoverLetter = async (req, res) => {
    try {
        const user = req.user.userId;
        const { formData } = req.body;
        const generatedLetter = buildCoverLetterText(formData);

        const coverLetter = await CoverLetter.findOneAndUpdate(
            { user },
            {
                user,
                formData,
                generatedLetter
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return res.status(201).json({
            success: true,
            message: "Cover letter generated successfully",
            generatedLetter,
            coverLetter
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error generating cover letter",
            error: error.message
        });
    }
};

const getCoverLetter = async (req, res) => {
    try {
        const coverLetter = await CoverLetter.findOne({
            user: req.user.userId
        });

        return res.status(200).json({
            success: true,
            coverLetter: coverLetter || null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching cover letter",
            error: error.message
        });
    }
};

module.exports = {
    saveCoverLetter,
    getCoverLetter,
    buildCoverLetterText
};
