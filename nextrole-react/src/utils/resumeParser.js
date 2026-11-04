import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { allAtsKeywords } from "../data/atsSkills";

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts raw text from uploaded PDF, DOCX, or TXT file
 */
export const extractTextFromFile = async (file) => {
    const fileNameLower = file.name.toLowerCase();

    if (fileNameLower.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";
        }
        return fullText;
    }

    if (fileNameLower.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || "";
    }

    if (fileNameLower.endsWith(".txt")) {
        return await file.text();
    }

    throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
};

/**
 * Parse raw resume text into structured fields
 */
export const parseResumeText = (rawText) => {
    const text = rawText || "";
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    // 1. Extract Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "";

    // 2. Extract Phone
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : "";

    // 3. Extract LinkedIn & GitHub
    const linkedinMatch = text.match(/(?:linkedin\.com\/(?:in|profile)\/|[a-zA-Z0-9_-]+)(?:[\w-]+)?/i);
    const githubMatch = text.match(/(?:github\.com\/[a-zA-Z0-9_-]+)/i);

    // 4. Extract Name (usually in first 3 lines, excluding emails/links/titles)
    let name = "";
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const line = lines[i];
        if (
            line &&
            !line.includes("@") &&
            !line.includes("http") &&
            !line.match(/\d{5,}/) &&
            line.length > 2 &&
            line.length < 40 &&
            !/resume|curriculum|vitae|page|profile/i.test(line)
        ) {
            name = line.replace(/[^\w\s.-]/g, "").trim();
            break;
        }
    }

    // 5. Detect Skills by matching known ATS skill dictionary
    const lowerText = text.toLowerCase();
    const detectedSkills = allAtsKeywords.filter((keyword) => {
        const regex = new RegExp(`\\b${keyword.replace(".", "\\.")}\\b`, "i");
        return regex.test(lowerText);
    });

    // Also look for explicit "Skills" section
    let explicitSkills = [];
    const skillsSectionMatch = text.match(/(?:skills|technical skills|technologies)[\s\S]*?(?=(?:education|experience|projects|certifications|$))/i);
    if (skillsSectionMatch) {
        const rawSkillsBlock = skillsSectionMatch[0].replace(/(?:skills|technical skills|technologies)[\s:]*/i, "");
        explicitSkills = rawSkillsBlock
            .split(/[,•|\n]/)
            .map((s) => s.trim().replace(/^[-*•\s]+/, ""))
            .filter((s) => s.length > 1 && s.length < 35 && !/skills|experience|education/i.test(s));
    }

    // Merge skills, capitalize nicely, and remove duplicates
    const combinedSkills = [...new Set([...explicitSkills, ...detectedSkills])].slice(0, 25);

    // 6. Extract Summary / Objective
    let summary = "";
    const summaryMatch = text.match(/(?:summary|professional summary|about me|profile|objective)[\s:]*([\s\S]*?)(?=(?:skills|technical skills|education|experience|projects|certifications|$))/i);
    if (summaryMatch && summaryMatch[1]) {
        summary = summaryMatch[1].trim().replace(/\s+/g, " ").slice(0, 500);
    } else {
        // Fallback: look for a paragraph near top
        const candidateParagraph = lines.slice(1, 8).find((l) => l.length > 60 && !l.includes("@"));
        if (candidateParagraph) summary = candidateParagraph.slice(0, 450);
    }

    // 7. Extract Education
    let education = "";
    const educationMatch = text.match(/(?:education|academic background|academics)[\s:]*([\s\S]*?)(?=(?:skills|experience|projects|certifications|summary|$))/i);
    if (educationMatch && educationMatch[1]) {
        education = educationMatch[1].trim().slice(0, 400);
    } else {
        // Search lines for degree keywords
        const eduLines = lines.filter((l) => /b\.?tech|bachelor|master|m\.?tech|b\.?s|m\.?s|university|college|institute|cgpa|gpa/i.test(l));
        if (eduLines.length > 0) {
            education = eduLines.slice(0, 3).join("\n");
        }
    }

    // 8. Extract Projects
    let projectTitle = "";
    let projectDescription = "";
    const projectsMatch = text.match(/(?:projects|key projects|academic projects)[\s:]*([\s\S]*?)(?=(?:education|skills|certifications|experience|$))/i);
    if (projectsMatch && projectsMatch[1]) {
        const pLines = projectsMatch[1].split("\n").map((l) => l.trim()).filter(Boolean);
        if (pLines.length > 0) {
            projectTitle = pLines[0].replace(/^[-*•#\s]+/, "").slice(0, 80);
            projectDescription = pLines.slice(1, 5).join(" ").slice(0, 500);
        }
    }

    // 9. Extract Certifications
    let certifications = "";
    const certsMatch = text.match(/(?:certifications|certificates|licenses|courses)[\s:]*([\s\S]*?)(?=(?:education|skills|projects|experience|$))/i);
    if (certsMatch && certsMatch[1]) {
        certifications = certsMatch[1]
            .split(/[\n,•]/)
            .map((c) => c.trim().replace(/^[-*•\s]+/, ""))
            .filter((c) => c.length > 3)
            .slice(0, 6)
            .join(", ");
    }

    return {
        name: name || "Your Name",
        email: email || "",
        phone: phone || "",
        address: "",
        linkedin: linkedinMatch ? linkedinMatch[0] : "",
        github: githubMatch ? githubMatch[0] : "",
        summary: summary || "",
        skills: combinedSkills.length > 0 ? combinedSkills.join(", ") : "",
        education: education || "",
        projectTitle: projectTitle || "",
        projectDescription: projectDescription || "",
        certifications: certifications || ""
    };
};

/**
 * Tailor Resume to a Job Description
 * Identifies key skills, calculates before & after scores, creates targeted summary and bullet improvements.
 */
export const tailorResumeToJobDescription = (currentResume, jobDescription) => {
    if (!jobDescription || !jobDescription.trim()) {
        throw new Error("Please provide a Job Description to tailor your resume.");
    }

    const jdLower = jobDescription.toLowerCase();
    const resumeText = [
        currentResume.name,
        currentResume.summary,
        currentResume.skills,
        currentResume.education,
        currentResume.projectTitle,
        currentResume.projectDescription,
        currentResume.certifications
    ].join(" ").toLowerCase();

    // 1. Identify target role from JD
    const roleMatches = [
        "Associate Frontend Engineer", "Frontend Engineer", "Frontend Developer",
        "React Developer", "JavaScript Developer", "Full Stack Engineer",
        "Full Stack Developer", "Software Engineer", "Web Developer",
        "UI Engineer", "Frontend Specialist", "Junior Frontend Developer"
    ];

    let targetRole = "Frontend Engineer";
    for (const role of roleMatches) {
        if (jdLower.includes(role.toLowerCase())) {
            targetRole = role;
            break;
        }
    }

    // 2. Identify required keywords from JD
    const jdKeywords = [...new Set(
        allAtsKeywords.filter((kw) => {
            const regex = new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "i");
            return regex.test(jdLower);
        })
    )];

    // Current matches & missing
    const matchedBefore = jdKeywords.filter((kw) => {
        const regex = new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "i");
        return regex.test(resumeText);
    });

    const missingKeywords = jdKeywords.filter((kw) => !matchedBefore.includes(kw));

    const scoreBefore = jdKeywords.length > 0
        ? Math.round((matchedBefore.length / jdKeywords.length) * 100)
        : 60;

    // 3. Select top missing skills to inject (up to 8 relevant ones)
    const skillsToInject = missingKeywords
        .filter((kw) => !["btech", "mtech", "internship", "full-time"].includes(kw))
        .slice(0, 8);

    // Existing skills parsed
    const currentSkillList = (currentResume.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    // Combine skills, capitalizing injected skills nicely
    const updatedSkillList = [...currentSkillList];
    skillsToInject.forEach((skill) => {
        const formatted = skill
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        if (!updatedSkillList.some((s) => s.toLowerCase() === skill.toLowerCase())) {
            updatedSkillList.push(formatted);
        }
    });

    // 4. Generate AI/Smart Tailored Summary
    const topSkillsStr = updatedSkillList.slice(0, 5).join(", ");
    const tailoredSummary = `Passionate and detail-oriented ${targetRole} with strong foundation in ${topSkillsStr}. Proven ability to build responsive, accessible, and high-performance web applications with clean, maintainable code. Skilled in modern frontend architectures, REST API integration, state management, and cross-functional team collaboration to deliver exceptional user experiences aligned with job requirements.`;

    // 5. Enhance Project Description to highlight relevant tech and impact verbs
    let tailoredProjectTitle = currentResume.projectTitle || `${targetRole} Portfolio Project`;
    let tailoredProjectDesc = currentResume.projectDescription;

    if (!tailoredProjectDesc || tailoredProjectDesc.trim().length < 30) {
        tailoredProjectDesc = `Engineered a scalable web application leveraging modern frontend practices, optimized component re-rendering, integrated asynchronous RESTful APIs, and maintained clean version control with Git. Ensured responsive design across all screen viewports with cross-browser compatibility.`;
    } else {
        // If already exists, inject action phrasing if missing
        if (!tailoredProjectDesc.toLowerCase().includes("responsive")) {
            tailoredProjectDesc += ` Implemented responsive UI components, streamlined API consumption, and adhered to modern web performance standards.`;
        }
    }

    // New score after tailoring
    const matchedAfter = [...new Set([...matchedBefore, ...skillsToInject])];
    const scoreAfter = jdKeywords.length > 0
        ? Math.min(96, Math.max(88, Math.round((matchedAfter.length / jdKeywords.length) * 100)))
        : 90;

    const tailoredResume = {
        ...currentResume,
        summary: tailoredSummary,
        skills: updatedSkillList.join(", "),
        projectTitle: tailoredProjectTitle,
        projectDescription: tailoredProjectDesc
    };

    return {
        tailoredResume,
        targetRole,
        scoreBefore,
        scoreAfter,
        skillsAdded: skillsToInject,
        matchedKeywords: matchedAfter,
        missingKeywords: missingKeywords.filter((kw) => !skillsToInject.includes(kw)),
        totalJDKeywords: jdKeywords.length
    };
};
