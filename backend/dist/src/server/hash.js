"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const password = 'admin123';
bcrypt_1.default.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Erreur de hash :', err);
    }
    else {
        console.log('Mot de passe hashé :', hash);
    }
});
