// fullstack-app/backend/src/server/scripts/diagnostic.ts

// ✅ Import mis à jour vers le bon fichier partagé
import { joueursParPoste, Joueur as Player } from '@shared/types/joueurs';

async function runDiagnostic() {
  try {
    const ailiersDroits: Player[] = joueursParPoste.ailiersDroits;

    ailiersDroits.forEach((player: Player) => {
      console.log(`✅ Joueur: ${player.name} (${player.club})`);
    });

    // Simule une opération async qui peut échouer
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Diagnostic terminé avec succès.');

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`❌ ÉCHEC: ${error.message}`);
    } else {
      console.log('❌ ÉCHEC: Une erreur inconnue est survenue.');
    }
  }
}

runDiagnostic();
