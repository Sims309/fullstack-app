// models/userModel.ts

export type UserRole = 'admin' | 'user' | 'moderator' | 'guest';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
export function mapSqlRowToUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    role: row.role,
  };
}
/**
 * Vérifie si l'utilisateur est admin.
 * @param user - l'utilisateur à vérifier
 * @returns true si l'utilisateur est admin, sinon false
 */
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité selon son rôle requis.
 * Les rôles sont hiérarchisés de guest < user < moderator < admin.
 * @param user - l'utilisateur à vérifier
 * @param requiredRole - rôle minimum requis pour accéder à la fonctionnalité
 * @returns true si l'utilisateur a le droit, sinon false
 */
export function canAccessFeature(user: User, requiredRole: UserRole): boolean {
  const rolesHierarchy: UserRole[] = ['guest', 'user', 'moderator', 'admin'];
  return rolesHierarchy.indexOf(user.role) >= rolesHierarchy.indexOf(requiredRole);
}
