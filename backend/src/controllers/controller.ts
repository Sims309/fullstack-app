// controllers/controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';  // chemin correct
import { mapSqlRowToUser, User } from '../models/userModel';
import { mapSqlRowToJoueur, Joueur } from '../models/joueurModel';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload & { userId?: number };
}

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if ((existingUsers as any[]).length > 0) {
      return res.status(409).json({ error: 'Email déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashed]);

    res.status(201).json({ message: 'Utilisateur créé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const [users] = await db.query('SELECT id, email, username, password FROM users WHERE email = ? LIMIT 1', [email]);
    if ((users as any[]).length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

    const user = (users as any)[0];
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
      sameSite: 'lax',
    });

    res.json({ message: 'Connexion réussie' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnecté' });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.user;
  if (!payload || typeof payload.userId !== 'number') {
    return res.status(401).json({ error: 'Utilisateur non authentifié.' });
  }

  const userId = payload.userId;

  try {
    const [results] = await db.query('SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1', [userId]);
    if ((results as any[]).length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const user: User = mapSqlRowToUser((results as any)[0]);
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const getJoueurById = async (req: Request, res: Response) => {
  const joueurId = Number(req.params.id);
  if (isNaN(joueurId)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const [results] = await db.query('SELECT * FROM players WHERE id = ? LIMIT 1', [joueurId]);
    if ((results as any[]).length === 0) {
      return res.status(404).json({ error: 'Joueur non trouvé.' });
    }

    const joueur: Joueur = mapSqlRowToJoueur((results as any)[0]);
    res.json({ joueur });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const createJoueur = async (req: Request, res: Response) => {
  const { name, age, position } = req.body;

  if (!name || !age || !position) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const [result] = await db.query('INSERT INTO players (name, age, position) VALUES (?, ?, ?)', [name, age, position]);
    // result is ResultSetHeader
    const insertId = (result as any).insertId;
    res.status(201).json({ message: 'Joueur créé.', joueurId: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du joueur.' });
  }
};
