"use strict";
// fullstack-app/backend/src/controllers/playerController.ts
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
        const joueur = {
            id: results[0].id,
            posteId: results[0].posteId,
            name: results[0].name,
            country: results[0].country,
            image: results[0].image,
            fifa_points: results[0].fifa_points,
            biography: results[0].biography,
            statistics: results[0].statistics,
            trophees_majeurs: results[0].trophees_majeurs,
            age: results[0].age,
            club: results[0].club,
            nationalite: results[0].nationalite,
            buts: results[0].buts,
            passes: results[0].passes,
            cartons_jaunes: results[0].cartons_jaunes,
            cartons_rouges: results[0].cartons_rouges
        };
        res.json({ joueur });
    });
};
exports.getJoueurById = getJoueurById;
const createJoueur = (req, res) => {
    const { posteId, name, country, image, fifa_points, biography, statistics, trophees_majeurs, age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges } = req.body;
    if (!posteId || !name || !country || !image || fifa_points === undefined || !biography || !statistics ||
        !trophees_majeurs || age === undefined || !club || !nationalite ||
        buts === undefined || passes === undefined || cartons_jaunes === undefined || cartons_rouges === undefined) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    const sql = `
    INSERT INTO milieux_defensifs (
      posteId, name, country, image, fifa_points, biography, statistics,
      trophees_majeurs, age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    db_1.db.query(sql, [
        posteId, name, country, image, fifa_points, biography, statistics,
        trophees_majeurs, age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges
    ], (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Erreur lors de la création du milieu défensif.' });
        res.status(201).json({ message: 'Milieu défensif créé.', joueurId: result.insertId });
    });
};
exports.createJoueur = createJoueur;
