const crypto = require("crypto");

const getAllowedIps = () => (process.env.INTEGRATION_ALLOWED_IPS || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);

const getClientIp = (req) => {
    const forwarded = process.env.INTEGRATION_TRUST_PROXY === "true" && req.headers["x-forwarded-for"];
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;

    return ip && ip.replace(/^::ffff:/, "");
};

module.exports = (req, res, next) => {
    const configuredKey = process.env.INTEGRATION_API_KEY;
    const receivedKey = req.get("x-integration-api-key");

    if (!configuredKey) {
        return res.status(503).send({
            message: "La integración no está configurada en este servidor.",
        });
    }

    if (!receivedKey ||
        receivedKey.length !== configuredKey.length ||
        !crypto.timingSafeEqual(Buffer.from(receivedKey), Buffer.from(configuredKey))) {
        return res.status(401).send({message: "No autorizado."});
    }

    const allowedIps = getAllowedIps();
    if (allowedIps.length && !allowedIps.includes(getClientIp(req))) {
        return res.status(403).send({message: "Origen no autorizado."});
    }

    return next();
};
