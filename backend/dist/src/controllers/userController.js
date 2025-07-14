"use strict";
// controllers/userController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJoueur = exports.getJoueurById = exports.getCurrentUser = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const userModel_1 = require("../models/userModel");
const joueurModel_1 = require("../models/joueurModel");
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const registerUser = async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    const checkSql = 'SELECT id FROM users WHERE email = ? LIMIT 1';
    db_1.db.query(checkSql, [email], async (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length > 0)
            return res.status(409).json({ error: 'Email déjà utilisé.' });
        const hashed = await bcrypt_1.default.hash(password, 10);
        const insertSql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        db_1.db.query(insertSql, [email, username, hashed], (insertErr) => {
            if (insertErr)
                return res.status(500).json({ error: 'Erreur inscription.' });
            res.status(201).json({ message: 'Utilisateur créé.' });
        });
    });
};
exports.registerUser = registerUser;
const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }
    const sql = 'SELECT id, email, username, password FROM users WHERE email = ? LIMIT 1';
    db_1.db.query(sql, [email], async (err, results) => {
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
};
exports.loginUser = loginUser;
const logoutUser = (_req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Déconnecté' });
};
exports.logoutUser = logoutUser;
const getCurrentUser = (req, res) => {
    const payload = req.user;
    if (!payload || typeof payload.userId !== 'number') {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }
    const userId = payload.userId;
    const sql = 'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1';
    db_1.db.query(sql, [userId], (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length === 0)
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        const user = (0, userModel_1.mapSqlRowToUser)(results[0]);
        res.json({ user });
    });
};
exports.getCurrentUser = getCurrentUser;
const getJoueurById = (req, res) => {
    const joueurId = Number(req.params.id);
    if (isNaN(joueurId))
        return res.status(400).json({ error: 'ID invalide' });
    const sql = 'SELECT * FROM players WHERE id = ? LIMIT 1';
    db_1.db.query(sql, [joueurId], (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length === 0)
            return res.status(404).json({ error: 'Joueur non trouvé.' });
        const joueur = (0, joueurModel_1.mapSqlRowToJoueur)(results[0]);
        res.json({ joueur });
    });
};
exports.getJoueurById = getJoueurById;
const createJoueur = (req, res) => {
    const { name, age, position } = req.body;
    if (!name || !age || !position) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    const sql = 'INSERT INTO players (name, age, position) VALUES (?, ?, ?)';
    db_1.db.query(sql, [name, age, position], (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Erreur lors de la création du joueur.' });
        const insertResult = result;
        res.status(201).json({ message: 'Joueur créé.', joueurId: insertResult.insertId });
    });
};
exports.createJoueur = createJoueur;
