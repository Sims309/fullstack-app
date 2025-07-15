"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = mysql2_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
exports.db.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion à la base de données :', err.message);
        process.exit(1); // Arrêter l'application si la connexion échoue
    }
    else {
        console.log('✅ Connecté à la base de données MySQL');
    }
});
// Gestion des erreurs de connexion
exports.db.on('error', (err) => {
    console.error('Erreur de base de données:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Connexion à la base de données fermée. Tentative de reconnexion...');
        // Ici vous pourriez ajouter une logique de reconnexion
    }
});
// Fermeture propre de la connexion
process.on('SIGINT', () => {
    console.log('Fermeture de la connexion à la base de données...');
    exports.db.end(() => {
        console.log('Connexion fermée.');
        process.exit(0);
    });
});
