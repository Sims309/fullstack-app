import bcrypt from 'bcrypt';

/**
 * Service de gestion des mots de passe
 */
class PasswordService {
  // 🔐 Hachage du mot de passe
  static async hashPassword(plainPassword: string): Promise<string> {
    try {
      return await bcrypt.hash(plainPassword, 10);
    } catch (error) {
      throw new Error(`Erreur lors du hashage du mot de passe : ${(error as Error).message}`);
    }
  }

  // 🔍 Vérification du mot de passe
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Erreur lors de la vérification du mot de passe : ${(error as Error).message}`);
    }
  }
}

/**
 * 🧪 Exemple d'exécution directe du test de vérification
 */
(async () => {
  const motDePasseClair = 'admin123';

  // Hash généré précédemment avec hash.ts ou enregistré en base
  const hashExistant = '$2b$10$ImS3ouSaA/XddATjJXT5FOlx2WRabOSLoedbYrCQBKMJenp4c4kDW';

  try {
    const estValide = await PasswordService.verifyPassword(motDePasseClair, hashExistant);

    if (estValide) {
      console.log('✅ Mot de passe valide');
    } else {
      console.log('❌ Mot de passe invalide');
    }
  } catch (error) {
    console.error('💥 Erreur :', error);
  }
})();
