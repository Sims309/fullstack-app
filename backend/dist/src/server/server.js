"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const playersRoutes_1 = __importDefault(require("./routes/playersRoutes"));
const joueurRoutes_1 = __importDefault(require("./routes/joueurRoutes"));
const authMiddleware_1 = require("./routes/middleware/authMiddleware");
const logger_1 = __importDefault(require("../logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Sécurisation des headers HTTP
app.use((0, helmet_1.default)());
// Logging des requêtes HTTP
app.use((0, morgan_1.default)('dev'));
// Limitation du nombre de requêtes par IP
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Trop de requêtes, réessayez plus tard.',
});
app.use(limiter);
// Configuration CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Connexion à la base de données MySQL
const db = mysql2_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect(err => {
    if (err)
        logger_1.default.error('❌ Erreur connexion MySQL : %s', err.message);
    else
        logger_1.default.info('✅ Connecté à MySQL');
});
// Routes publiques
app.use('/api/auth', authRoutes_1.default);
app.use('/api/players', playersRoutes_1.default);
app.use('/api/joueurs', joueurRoutes_1.default);
// Route protégée de test avec req typé AuthenticatedRequest
app.get('/api/protected', authMiddleware_1.authenticateToken, (req, res) => {
    res.json({ message: 'Route protégée', user: req.user });
});
// Récupération de l'utilisateur connecté
app.get('/api/me', authMiddleware_1.authenticateToken, (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(400).json({ error: 'Utilisateur non identifié' });
    }
    const sql = 'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1';
    db.query(sql, [userId], (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length === 0)
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        res.json({ user: results[0] });
    });
});
// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
exports.default = app;
