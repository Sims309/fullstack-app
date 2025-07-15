import bcrypt from 'bcrypt';

const password = 'admin123';

bcrypt.hash(password, 10, (err: Error | undefined, hash: string) => {
  if (err) {
    console.error('Erreur de hash :', err);
  } else {
    console.log('Mot de passe hashé :', hash);
  }
});
