module.exports = {
    openapi: "3.0.0",
    info: {
        title: "AI ATS & Resume Analyzer API",
        version: "1.0.0",
        description: "API documentation for the AI-powered ATS and Resume Analyzer platform (MVC & Raw SQL version)."
    },
    servers: [
        { url: "http://localhost:5000/api/v1" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [{ bearerAuth: [] }],
    paths: {
        "/auth/register": {
            post: {
                tags: ["Authentication"],
                summary: "Register a new user",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    email: { type: "string" },
                                    password: { type: "string" },
                                    role: { type: "string", enum: ["candidate", "admin"] }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: "User registered" } }
            }
        },
        "/auth/login": {
            post: {
                tags: ["Authentication"],
                summary: "Login and get tokens",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Login successful" } }
            }
        },
        "/resumes/upload": {
            post: {
                tags: ["Resumes"],
                summary: "Upload a resume (PDF/DOCX)",
                responses: { 201: { description: "Upload successful" } }
            }
        },
        "/ats/analyze": {
            post: {
                tags: ["ATS Scoring"],
                summary: "Analyze a resume against a job",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    resumeId: { type: "string" },
                                    jobId: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Analysis completed" } }
            }
        }
    }
};
