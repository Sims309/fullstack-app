"use strict";
// models/userModel.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSqlRowToUser = mapSqlRowToUser;
exports.isAdmin = isAdmin;
exports.canAccessFeature = canAccessFeature;
function mapSqlRowToUser(row) {
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
function isAdmin(user) {
    return user.role === 'admin';
}
/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité selon son rôle requis.
 * Les rôles sont hiérarchisés de guest < user < moderator < admin.
 * @param user - l'utilisateur à vérifier
 * @param requiredRole - rôle minimum requis pour accéder à la fonctionnalité
 * @returns true si l'utilisateur a le droit, sinon false
 */
function canAccessFeature(user, requiredRole) {
    const rolesHierarchy = ['guest', 'user', 'moderator', 'admin'];
    return rolesHierarchy.indexOf(user.role) >= rolesHierarchy.indexOf(requiredRole);
}
