// hash.js
const bcrypt = require('bcrypt');

const password = 'admin123'; // 🔒 Choisis ton mot de passe ici

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Erreur de hash :', err);
  } else {
    console.log('Mot de passe hashé :', hash);
  }
});
