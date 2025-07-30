import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';
import { registerBackendSchema, loginSchema } from '@schemas/user.schema';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const registerUser = async (req: Request, res: Response) => {
  console.log('🔔 registerUser appelé avec body:', req.body);

  try {
    // Ajout des console.log demandés :
    console.log('🧪 registerBackendSchema.shape keys:', Object.keys(registerBackendSchema.shape));
    console.log('🧪 req.body:', req.body);

    const { email, password, username } = registerBackendSchema.parse(req.body);

    // Vérification si l'email existe déjà
    const [existing] = await db.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email déjà utilisé.' });
    }

    // Hash du mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Insertion utilisateur
    const [insertResult] = await db.query<ResultSetHeader>(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashed]
    );

    return res.status(201).json({
      message: 'Utilisateur créé.',
      userId: insertResult.insertId,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      console.log('❌ Erreurs de validation Zod:', err.issues);
      return res.status(400).json({ errors: err.issues });
    }
    console.error('❌ Erreur d\'enregistrement :', err.message);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  console.log('🔔 loginUser appelé avec body:', req.body);

  try {
    const { email, password } = loginSchema.parse(req.body);

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, email, username, password FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

    const user = rows[0] as { id: number; email: string; username: string; password: string };
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60, // 1h
      sameSite: 'lax',
    });

    return res.status(200).json({ message: 'Connexion réussie' });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      console.log('❌ Erreurs de validation Zod:', err.issues);
      return res.status(400).json({ errors: err.issues });
    }
    console.error('❌ Erreur de connexion :', err.message);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('auth-token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(200).json({ message: 'Déconnecté' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const payload = authReq.user;
  if (!payload || typeof payload.userId !== 'number') {
    return res.status(401).json({ error: 'Utilisateur non authentifié.' });
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1',
      [payload.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    return res.status(200).json({ user: rows[0] });
  } catch (err: any) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur :', err.message);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
