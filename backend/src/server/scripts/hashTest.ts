import bcrypt from 'bcrypt';

async function testHash() {
  const password = 'monmotdepasse123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Mot de passe clair:', password);
  console.log('Mot de passe hashé:', hash);
}

testHash();
