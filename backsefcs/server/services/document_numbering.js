const SUFFIX_BY_CONCEPT = {
    // Certificados de estudios (regular y Segunda Especialidad)
    59: "Cert.Est.USE",
    102: "Cert.Est.USE",
    120: "Cert.Est.USE",

    // Constancias de ingreso
    1: "C.Ing.USE",
    2: "C.Ing.USE",
    113: "C.Ing.USE",

    // Constancias de estudio (regular y Segunda Especialidad)
    36: "C.Est.USE",
    98: "C.Est.USE",
    117: "C.Est.USE",
    118: "C.Est.USE",

    // Constancias de egresado (regular y Segunda Especialidad)
    111: "C.Egr.USE",
    115: "C.Egr.USE",
    119: "C.Egr.USE",

    // Constancias de expedito
    104: "C.Exp.USE",
    130: "C.Exp.S.USE",

    // Otras constancias de Segunda Especialidad
    122: "C.Mat.USE",
    103: "C.NoAdeu.USE",
    17: "C.OrdMer.USE",
    124: "C.NoProcDis.USE",
};

const getDocumentSuffixByConcept = (idConcept) => SUFFIX_BY_CONCEPT[idConcept] || null;

const formatDocumentCode = (correlative, date, suffix) => {
    if (!correlative || !suffix) return null;

    return `${correlative}-${new Date(date).getFullYear()}-${suffix}`;
};

module.exports = {
    getDocumentSuffixByConcept,
    formatDocumentCode,
};
