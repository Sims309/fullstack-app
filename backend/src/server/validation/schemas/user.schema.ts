import { z } from 'zod';

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email invalide' })
    .nonempty({ message: 'Email requis' }),
  password: z
    .string()
    .min(6, { message: 'Mot de passe trop court (min 6 caractères)' })
    .nonempty({ message: 'Mot de passe requis' }),
});

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email invalide' })
    .nonempty({ message: 'Email requis' }),
  password: z
    .string()
    .min(6, { message: 'Mot de passe trop court (min 6 caractères)' })
    .nonempty({ message: 'Mot de passe requis' }),
  username: z
    .string()
    .min(3, { message: "Nom d'utilisateur trop court (min 3 caractères)" })
    .nonempty({ message: "Nom d'utilisateur requis" }),
  confirmPassword: z
    .string()
    .nonempty({ message: 'Confirmation du mot de passe requise' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Typage TypeScript généré automatiquement à partir des schémas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;