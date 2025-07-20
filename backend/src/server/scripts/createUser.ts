import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Configuration de la base de données
const dbConfig = {
  host: 'localhost',
  user: 'root', // à adapter
  password: 'TON_MDP_MYSQL', // à adapter
  database: 'fullstack_db',
};

interface NewUser {
  email: string;
  username: string;
  password: string; // en clair ici, sera haché ensuite
  role: 'user' | 'admin';
}

// Fonction robuste pour créer un utilisateur
export async function createUser(user: NewUser): Promise<void> {
  let connection;
  try {
    // Connexion à la base
    connection = await mysql.createConnection(dbConfig);

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Insertion dans la table users
    const [result] = await connection.execute(
      'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)',
      [user.email, user.username, hashedPassword, user.role]
    );

    console.log(`✅ Utilisateur créé : ${user.email}`);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur :', error);
  } finally {
    if (connection) await connection.end();
  }
}

// Exemple d'utilisation si on exécute ce fichier directement
if (require.main === module) {
  const demoUser: NewUser = {
    email: 'fictif@test.com',
    username: 'fictif_user',
    password: 'test1234',
    role: 'user',
  };

  createUser(demoUser);
}
