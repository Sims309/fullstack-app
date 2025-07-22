import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fullstack_db',
};

interface NewUser {
  email: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
}

export async function createUser(user: NewUser): Promise<void> {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // 1. Vérifier si l'email existe déjà
    const [rows] = await connection.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [user.email]
    );
    // @ts-ignore
    if ((rows as any[]).length > 0) {
      // Si utilisateur existant, on met à jour son username, password et role
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await connection.execute(
        'UPDATE users SET username = ?, password = ?, role = ? WHERE email = ?',
        [user.username, hashedPassword, user.role, user.email]
      );
      console.log(`🔄 Utilisateur mis à jour : ${user.email}`);
      return;
    }

    // 2. Sinon, insertion du nouvel utilisateur
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await connection.execute(
      'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)',
      [user.email, user.username, hashedPassword, user.role]
    );
    console.log(`✅ Utilisateur créé : ${user.email}`);
  } catch (error: any) {
    console.error('❌ Erreur lors de la création/mise à jour de l\'utilisateur :', error);
  } finally {
    if (connection) await connection.end();
  }
}

// Exemple exécutable directement
if (require.main === module) {
  const demoUser: NewUser = {
    email: 'fictif@test.com',
    username: 'fictif_user',
    password: 'test1234',  // nouveau mot de passe à enregistrer
    role: 'user',
  };
  createUser(demoUser);
}
