// src/schemas/user.schema.ts
import { z } from 'zod';

// 1) Regex stricte pour les emails (empêche les erreurs courantes)
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

// 2) Schéma de base avec tous les champs, mais sans logique refine
const baseRegisterSchema = z.object({
  email: z
    .string()
    .regex(emailRegex, { message: 'Email invalide' })
    .nonempty({ message: 'Email requis' }),

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
});

// 3) Schéma utilisé côté frontend (valide que password === confirmPassword)
export const registerSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ['confirmPassword'],
  }
);

// 4) Schéma backend : confirmPassword n’est **pas** nécessaire côté API
export const registerBackendSchema = baseRegisterSchema.omit({
  confirmPassword: true,
});

// 5) Schéma de login
export const loginSchema = z.object({
  email: z
    .string()
    .regex(emailRegex, { message: 'Email invalide' })
    .nonempty({ message: 'Email requis' }),

  password: z
    .string()
    .min(6, { message: 'Mot de passe trop court (min 6 caractères)' })
    .nonempty({ message: 'Mot de passe requis' }),
});

// 6) Types TypeScript (facultatif mais recommandé)
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterBackendInput = z.infer<typeof registerBackendSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

