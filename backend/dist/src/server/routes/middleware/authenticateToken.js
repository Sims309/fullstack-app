"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Token manquant' });
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err)
            return res.status(403).json({ error: 'Token invalide' });
        // Ici on vérifie si user est bien un objet, pas une string
        if (typeof user === 'string') {
            // Si c'est une string, on refuse ou on parse en objet selon ta logique
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
}
