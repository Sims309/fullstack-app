"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Defender_1 = require("@shared/Defender");
async function runDiagnostic() {
    try {
        const ailiersDroits = Defender_1.joueursParPoste.ailiersDroits;
        ailiersDroits.forEach((player) => {
            console.log(`✅ Joueur: ${player.name} (${player.club})`);
        });
        // Simule une opération async qui peut échouer
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
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
