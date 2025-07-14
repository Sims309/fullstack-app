const { db } = require('../../config/db');
import type { Player } from '@shared/Defender';       // uniquement le type
import { ailiersDroits } from '@shared/types/Players';

const insertAiliersDroits = () => {
  console.log('🔄 Début de l\'insertion des ailiers droits...');

  if (!db) {
    console.error('❌ Erreur : db non trouvé');
    return;
  }

  if (!ailiersDroits) {
    console.error('❌ Erreur : ailiersDroits non trouvés');
    return;
  }

  if (!Array.isArray(ailiersDroits)) {
    console.error('❌ Erreur : ailiersDroits n\'est pas un tableau');
    return;
  }

  console.log(`🔄 Insertion de ${ailiersDroits.length} ailiers droits...`);

  ailiersDroits.forEach((player: Player, index: number) => {
    console.log(`\n--- Traitement du joueur ${index + 1} ---`);
    console.log(`Nom: ${player.name}, ID: ${player.id}`);

    if (!player.id || !player.name) {
      console.error('❌ Erreur : joueur sans ID ou nom', player);
      return;
    }

    const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ATT', 9)
    `;

    const values = [
      player.id,
      player.name || '',
      player.country || '',
      player.image || '',
      player.fifa_points || 0,
      player.biography || '',
      player.statistics || '',
      player.trophees_majeurs || '',
      player.age || 0,
      player.club || '',
      player.nationalite || '',
      player.buts || 0,
      player.passes || 0,
      player.cartons_jaunes || 0,
      player.cartons_rouges || 0,
    ];

    console.log('📝 Exécution de la requête SQL...');

    db.query(sql, values, (err: any, result: any) => {
      if (err) {
        console.error(`❌ Erreur insertion ailier droit ${player.name}:`, err.message);
        console.error('SQL:', sql);
        console.error('Valeurs:', values);
      } else {
        console.log(`✅ Ailier droit inséré avec succès : ${player.name} (ID: ${player.id})`);
        console.log('Résultat:', result);
      }
    });
  });
};

// Export
export { insertAiliersDroits };

// Exécution directe
if (require.main === module) {
  console.log('🚀 Lancement du script insertAiliersDroits...');
  insertAiliersDroits();
}
