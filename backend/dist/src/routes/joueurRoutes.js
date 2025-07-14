"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/joueurRoutes.ts
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controllers/controller");
const router = express_1.default.Router();
router.post('/joueurs', controller_1.createJoueur);
// La route PUT est supprimée car updateJoueur n'existe pas encore
// router.put('/joueurs/:id', updateJoueur);
router.get('/joueurs/:id', controller_1.getJoueurById);
exports.default = router;
//# sourceMappingURL=joueurRoutes.js.map