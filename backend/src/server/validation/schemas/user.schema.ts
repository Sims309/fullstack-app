// src/schemas/user.schema.ts
import { z } from 'zod';

// ✅ Validation email Zod native (plus robuste que regex maison)
const emailField = z
  .string()
  .email({ message: 'Email invalide' })
  .nonempty({ message: 'Email requis' });

// ✅ Avatar peut être vide ou une URL valide
const avatarField = z
  .string()
  .url({ message: 'URL de l’avatar invalide' })
  .optional()
  .or(z.literal(''));

// ──────────────────────────────
// 🔹 Schéma de base
const baseRegisterSchema = z.object({
  email: emailField,

  username: z
    .string()
    .min(3, { message: "Nom d'utilisateur trop court (min 3 caractères)" })
    .nonempty({ message: "Nom d'utilisateur requis" }),

  password: z
    .string()
    .min(6, { message: 'Mot de passe trop court (min 6 caractères)' })
    .nonempty({ message: 'Mot de passe requis' }),

  confirmPassword: z
    .string()
    .nonempty({ message: 'Confirmation du mot de passe requise' }),

  avatar: avatarField,
});

// 🔹 Schéma d'inscription côté frontend (vérifie que les mots de passe correspondent)
export const registerSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ['confirmPassword'],
  }
);

// 🔹 Schéma backend (pas besoin de confirmPassword mais on garde avatar)
export const registerBackendSchema = baseRegisterSchema.omit({
  confirmPassword: true,
});

// 🔹 Schéma de connexion
export const loginSchema = z.object({
  email: emailField,

  password: z
    .string()
    .min(6, { message: 'Mot de passe trop court (min 6 caractères)' })
    .nonempty({ message: 'Mot de passe requis' }),
});

// 🔹 Types TypeScript utiles partout
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterBackendInput = z.infer<typeof registerBackendSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
