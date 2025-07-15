"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Update the import path if the file is named differently or located elsewhere
// Example: import { joueursParPoste, Player } from '../../shared/defenders';
// Make sure the file '../../shared/defender.ts' exists and exports 'joueursParPoste' and 'Player'
const defender_1 = require("../../shared/defender");
async function runDiagnostic() {
    try {
        const ailiersDroits = defender_1.joueursParPoste.ailiersDroits;
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
