export type UserRole = 'admin' | 'user' | 'moderator' | 'guest';
export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare function mapSqlRowToUser(row: any): User;
/**
 * Vérifie si l'utilisateur est admin.
 * @param user - l'utilisateur à vérifier
 * @returns true si l'utilisateur est admin, sinon false
 */
export declare function isAdmin(user: User): boolean;
/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité selon son rôle requis.
 * Les rôles sont hiérarchisés de guest < user < moderator < admin.
 * @param user - l'utilisateur à vérifier
 * @param requiredRole - rôle minimum requis pour accéder à la fonctionnalité
 * @returns true si l'utilisateur a le droit, sinon false
 */
export declare function canAccessFeature(user: User, requiredRole: UserRole): boolean;
