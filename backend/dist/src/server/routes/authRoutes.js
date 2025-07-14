"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// authRoutes.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../controllers/authController");
const authMiddleware_1 = require("./middleware/authMiddleware");
const router = express_1.default.Router();
// Route d'inscription
router.post('/register', authController_1.registerUser);
// Route de connexion
router.post('/login', authController_1.loginUser);
// Route de déconnexion
router.post('/logout', authController_1.logoutUser);
// Récupération de l'utilisateur courant (protégée)
router.get('/me', authMiddleware_1.authenticateToken, authController_1.getCurrentUser);
exports.default = router;
