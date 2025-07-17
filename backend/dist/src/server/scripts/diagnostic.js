"use strict";
// fullstack-app/backend/src/server/scripts/diagnostic.ts
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ Import mis à jour vers le bon fichier partagé
const joueurs_1 = require("@shared/types/joueurs");
async function runDiagnostic() {
    try {
        const ailiersDroits = joueurs_1.joueursParPoste.ailiersDroits;
        ailiersDroits.forEach((player) => {
            console.log(`✅ Joueur: ${player.name} (${player.club})`);
        });
        // Simule une opération async qui peut échouer
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Diagnostic terminé avec succès.');
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`❌ ÉCHEC: ${error.message}`);
        }
        else {
            console.log('❌ ÉCHEC: Une erreur inconnue est survenue.');
        }
    }
}
runDiagnostic();
