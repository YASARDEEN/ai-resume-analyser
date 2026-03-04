exports.calculateScore = (parsedData, jobRequirements) => {
    const resumeSkills = (parsedData.skills || []).map(s => s.toLowerCase());
    const mandatoryKW = jobRequirements.filter(k => k.type === 'mandatory');
    const preferredKW = jobRequirements.filter(k => k.type === 'preferred');

    let score = 0;
    let matchedMandatory = [];
    let missedMandatory = [];
    let matchedPreferred = [];
    let missedPreferred = [];

    // Check Mandatory
    mandatoryKW.forEach(k => {
        const isMatched = resumeSkills.some(s => s.includes(k.keyword.toLowerCase()));
        if (isMatched) {
            matchedMandatory.push(k.keyword);
        } else {
            missedMandatory.push(k.keyword);
        }
    });

    // Check Preferred
    preferredKW.forEach(k => {
        const isMatched = resumeSkills.some(s => s.includes(k.keyword.toLowerCase()));
        if (isMatched) {
            matchedPreferred.push(k.keyword);
            score += k.weight;
        } else {
            missedPreferred.push(k.keyword);
        }
    });

    // Initial base score calculation
    const totalMandatory = mandatoryKW.length;
    const mandatoryMatchRate = totalMandatory > 0 ? matchedMandatory.length / totalMandatory : 1;

    // Final score logic: 
    // - 60 points based on mandatory (if all pass)
    // - 40 points based on preferred weights
    let finalScore = (mandatoryMatchRate * 60) + Math.min(score, 40);

    // Experience bonus (simulation)
    if (parsedData.experience && parsedData.experience.length > 2) {
        finalScore += 5;
    }

    return {
        score: Math.min(Math.round(finalScore), 100),
        confidence: 0.9,
        analysis: {
            matchedMandatory,
            missedMandatory,
            matchedPreferred,
            missedPreferred,
            suggestions: missedMandatory.length > 0
                ? [`Urgent: Add experience or skills related to ${missedMandatory.join(', ')}`]
                : ["Profile looks strong! Consider quantifying achievements in your experience section."]
        }
    };
};
