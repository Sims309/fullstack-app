"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            error: 'Token manquant',
            message: 'Un token d\'authentification est requis'
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'string') {
            res.status(403).json({
                error: 'Token invalide',
                message: 'Le format du token est incorrect'
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                error: 'Token expiré',
                message: 'Votre session a expiré, veuillez vous reconnecter'
            });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({
                error: 'Token invalide',
                message: 'Le token fourni est invalide'
            });
        }
        else {
            res.status(500).json({
                error: 'Erreur serveur',
                message: 'Erreur lors de la vérification de l\'authentification'
            });
        }
        return;
    }
};
exports.authenticateToken = authenticateToken;
