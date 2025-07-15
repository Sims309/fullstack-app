import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { db } from '../db';

// Import Joueur et la fonction mapSqlRowToJoueur depuis joueurs.ts
import type { Joueur } from '@shared/types/joueurs';
import { mapSqlRowToJoueur } from '@shared/types/joueurs';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// ✅ Typage correct du payload JWT (évite TS2769)
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { userId?: number };
}

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  const checkSql = 'SELECT id FROM users WHERE email = ? LIMIT 1';
  db.query(checkSql, [email], async (err, results: any[]) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur.' });
    if (results.length > 0) return res.status(409).json({ error: 'Email déjà utilisé.' });
    const hashed = await bcrypt.hash(password, 10);
    const insertSql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    db.query(insertSql, [email, username, hashed], (insertErr) => {
      if (insertErr) return res.status(500).json({ error: 'Erreur inscription.' });
      res.status(201).json({ message: 'Utilisateur créé.' });
    });
  });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }
  const sql = 'SELECT id, email, username, password FROM users WHERE email = ? LIMIT 1';
  db.query(sql, [email], async (err, results: any[]) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur.' });
    if (results.length === 0) return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Mot de passe incorrect.' });
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'lax'
    });
    res.json({ message: 'Connexion réussie' });
  });
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnecté' });
};

// ✅ Ici on garde la signature d’origine, avec le bon type enrichi
export const getCurrentUser = (req: AuthenticatedRequest, res: Response) => {
  const payload = req.user;
  if (!payload || typeof payload.userId !== 'number') {
    return res.status(401).json({ error: 'Utilisateur non authentifié.' });
  }
  const userId = payload.userId;
  const sql = 'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1';
  db.query(sql, [userId], (err, results: any[]) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur.' });
    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    const user = results[0];
    res.json({ user });
  });
};

export const getJoueurById = (req: Request, res: Response) => {
  const joueurId = Number(req.params.id);
  if (isNaN(joueurId)) return res.status(400).json({ error: 'ID invalide' });

  const sql = 'SELECT * FROM players WHERE id = ? LIMIT 1';
  db.query(sql, [joueurId], (err, results: any[]) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur.' });
    if (results.length === 0) return res.status(404).json({ error: 'Joueur non trouvé.' });

    const joueur: Joueur = mapSqlRowToJoueur(results[0]);
    res.json({ joueur });
  });
};
