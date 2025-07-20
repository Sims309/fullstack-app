import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const payload = {
  userId: 1,
  username: 'testuser',
  role: 'user',
};

const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('⚠️ JWT_SECRET n’est pas défini dans le fichier .env');
  process.exit(1);
}

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Voici ton token JWT :');
console.log(token);
