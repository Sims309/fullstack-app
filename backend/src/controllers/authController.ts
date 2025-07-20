// src/server/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';

// Import du type AuthenticatedRequest
import { AuthenticatedRequest } from '@/types/express/authenticatedRequest';


const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const checkSql = 'SELECT id FROM users WHERE email = ? LIMIT 1';
    const [results] = await db.query(checkSql, [email]) as any[];

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insertSql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    const [insertResult] = await db.query(insertSql, [email, username, hashed]) as any[];

    res.status(201).json({ message: 'Utilisateur créé.', userId: insertResult.insertId });
  } catch (err) {
    console.error('❌ Erreur d’enregistrement :', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const sql = 'SELECT id, email, username, password FROM users WHERE email = ? LIMIT 1';
    const [results] = await db.query(sql, [email]) as any[];

    if (results.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

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
  } catch (err) {
    console.error('❌ Erreur de connexion :', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnecté' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  // cast sûr car authenticateToken middleware ajoute req.user
  const authReq = req as AuthenticatedRequest;
  const payload = authReq.user;

  if (!payload || typeof payload.userId !== 'number') {
    return res.status(401).json({ error: 'Utilisateur non authentifié.' });
  }

  try {
    const sql = 'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1';
    const [results] = await db.query(sql, [payload.userId]) as any[];

    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const user = results[0];
    res.json({ user });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération de l’utilisateur :', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
