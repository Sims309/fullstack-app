import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { mapSqlRowToUser, User } from '../models/userModel';
import { mapSqlRowToJoueur, Joueur } from '../models/joueurModel';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload;
}

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const [results] = await db.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (results.length > 0) {
      return res.status(409).json({ error: 'Email déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [insertResult] = await db.query<ResultSetHeader>(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashed]
    );

    res.status(201).json({ message: 'Utilisateur créé.', userId: insertResult.insertId });
  } catch (err) {
    console.error('❌ Erreur d’enregistrement:', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const [results] = await db.query<RowDataPacket[]>(
      'SELECT id, email, username, password FROM users WHERE email = ? LIMIT 1',
      [email]
    );

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
  } catch (err) {
    console.error('❌ Erreur de connexion:', (err as Error).message);
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

  try {
    const [results] = await db.query<RowDataPacket[]>(
      'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1',
      [payload.userId]
    );

    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

    const user: User = mapSqlRowToUser(results[0]);
    res.json({ user });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération de l’utilisateur:', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const getJoueurById = async (req: Request, res: Response) => {
  const joueurId = Number(req.params.id);
  if (isNaN(joueurId)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const [results] = await db.query<RowDataPacket[]>(
      'SELECT * FROM players WHERE id = ? LIMIT 1',
      [joueurId]
    );

    if (results.length === 0) return res.status(404).json({ error: 'Joueur non trouvé.' });

    const joueur: Joueur = mapSqlRowToJoueur(results[0]);
    res.json({ joueur });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération du joueur:', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const createJoueur = async (req: Request, res: Response) => {
  const { name, age, position } = req.body;

  if (!name || !age || !position) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO players (name, age, position) VALUES (?, ?, ?)',
      [name, age, position]
    );

    res.status(201).json({ message: 'Joueur créé.', joueurId: result.insertId });
  } catch (err) {
    console.error('❌ Erreur lors de la création du joueur:', (err as Error).message);
    res.status(500).json({ error: 'Erreur lors de la création du joueur.' });
  }
};
