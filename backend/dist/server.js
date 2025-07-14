"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const db = mysql2_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect(err => {
    if (err)
        console.error('❌ Erreur connexion MySQL :', err.message);
    else
        console.log('✅ Connecté à MySQL');
});
// --- REGISTER ---
app.post('/api/register', async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, username et mot de passe requis.' });
    }
    const checkSql = 'SELECT id FROM users WHERE email = ? LIMIT 1';
    db.query(checkSql, [email], async (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length > 0)
            return res.status(409).json({ error: 'Email déjà utilisé.' });
        const hashed = await bcrypt_1.default.hash(password, 10);
        const insertSql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        db.query(insertSql, [email, username, hashed], insertErr => {
            if (insertErr)
                return res.status(500).json({ error: 'Erreur inscription.' });
            res.status(201).json({ message: 'Utilisateur créé.' });
        });
    });
});
// --- LOGIN ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }
    const sql = 'SELECT id, email, password FROM users WHERE email = ? LIMIT 1';
    db.query(sql, [email], async (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length === 0)
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });
        const user = results[0];
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: 'Mot de passe incorrect.' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'lax'
        });
        res.json({ message: 'Connexion réussie' });
    });
});
// --- LOGOUT ---
app.post('/api/logout', (_req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Déconnecté' });
});
// --- AUTH MIDDLEWARE ---
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ error: 'Token manquant' });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ error: 'Token invalide' });
        req.user = decoded;
        next();
    });
}
// --- CURRENT USER ---
app.get('/api/me', authenticateToken, (req, res) => {
    const payload = req.user;
    const userId = payload.userId;
    const sql = 'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1';
    db.query(sql, [userId], (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length === 0)
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        res.json({ user: results[0] });
    });
});
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map