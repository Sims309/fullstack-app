"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJoueur = exports.getJoueurById = void 0;
const db_1 = require("../db");
const getJoueurById = (req, res) => {
    const joueurId = Number(req.params.id);
    if (isNaN(joueurId))
        return res.status(400).json({ error: 'ID invalide' });
    const sql = 'SELECT * FROM milieux_defensifs WHERE id = ? LIMIT 1';
    db_1.db.query(sql, [joueurId], (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Erreur serveur.' });
        if (results.length === 0)
            return res.status(404).json({ error: 'Milieu défensif non trouvé.' });
        // Ici on cast le résultat en MilieuDefensif (attention à la correspondance des champs en base)
        const joueur = {
            id: results[0].id,
            nom: results[0].nom,
            pays: results[0].pays,
            image: results[0].image,
            pointsFIFA: results[0].pointsFIFA,
        };
        res.json({ joueur });
    });
};
exports.getJoueurById = getJoueurById;
const createJoueur = (req, res) => {
    const { nom, pays, image, pointsFIFA } = req.body;
    // Vérifie que les champs nécessaires à MilieuDefensif sont présents
    if (!nom || !pays || !image || pointsFIFA === undefined) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    // Prépare l'objet MilieuDefensif
    const nouveauMilieuDefensif = { nom, pays, image, pointsFIFA };
    const sql = 'INSERT INTO milieux_defensifs (nom, pays, image, pointsFIFA) VALUES (?, ?, ?, ?)';
    db_1.db.query(sql, [nouveauMilieuDefensif.nom, nouveauMilieuDefensif.pays, nouveauMilieuDefensif.image, nouveauMilieuDefensif.pointsFIFA], (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Erreur lors de la création du milieu défensif.' });
        res.status(201).json({ message: 'Milieu défensif créé.', joueurId: result.insertId });
    });
};
exports.createJoueur = createJoueur;
