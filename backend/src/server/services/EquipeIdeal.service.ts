// importe ton interface Joueur depuis le dossier shared/types (ajuste le chemin selon ta config)
import { Joueur } from '@shared/types/joueurs';

import { prisma } from '@/server/prismaClient';

export class EquipeIdealService {
  /**
   * Récupère les 10 meilleurs joueurs pour un poste donné
   */
  public async getJoueursByPoste(poste: number): Promise<Joueur[]> {
    try {
      const joueursRaw = await prisma.joueur.findMany({
        where: { poste },
        orderBy: { rating: 'desc' },
        take: 10,
      });

      const joueurs: Joueur[] = joueursRaw.map(j => ({
        posteId: j.poste,
        id: Number(j.id),
        name: j.nom,
        country: '',
        image: '',
        fifa_points: 0,
        biography: '',
        statistics: '',
        trophees_majeurs: '',
        age: 0,
        club: '',
        nationalite: '',
        buts: 0,
        passes: 0,
        cartons_jaunes: 0,
        cartons_rouges: 0,
      }));

      return joueurs;
    } catch (error) {
      console.error(`Erreur getJoueursByPoste (poste=${poste}):`, error);
      throw new Error('Impossible de récupérer les joueurs');
    }
  }

  /**
   * Récupère l'équipe idéale : titulaires et remplaçants
   */
  public async getEquipe(): Promise<{ titulaires: Joueur[]; remplaçants: Joueur[] }> {
    try {
      const entries = await prisma.equipeIdeal.findMany({
        orderBy: { addedAt: 'asc' },
      });

      const joueursRaw = await Promise.all(
        entries.map((e: { joueurId: string }) =>
          prisma.joueur.findUnique({ where: { id: e.joueurId } })
        )
      );

      const validJoueurs: Joueur[] = joueursRaw
        .filter((j): j is NonNullable<typeof j> => j !== null)
        .map(j => ({
          posteId: j.poste,
          id: Number(j.id),
          name: j.nom,
          country: '',
          image: '',
          fifa_points: 0,
          biography: '',
          statistics: '',
          trophees_majeurs: '',
          age: 0,
          club: '',
          nationalite: '',
          buts: 0,
          passes: 0,
          cartons_jaunes: 0,
          cartons_rouges: 0,
        }));

      const titulaires = validJoueurs.slice(0, 11);
      const remplaçants = validJoueurs.slice(11, 16);

      return { titulaires, remplaçants };
    } catch (error) {
      console.error('Erreur getEquipe:', error);
      throw new Error('Impossible de récupérer l\'équipe idéale');
    }
  }

  /**
   * Ajoute un seul joueur
   */
  public async addJoueur(entry: { id: string; poste: number }) {
    return this.validateAndCreate([entry]);
  }

  /**
   * Ajoute plusieurs joueurs
   */
  public async batchAddJoueurs(entries: { id: string; poste: number }[]) {
    return this.validateAndCreate(entries);
  }

  private async validateAndCreate(entries: { id: string; poste: number }[]) {
    try {
      const existingCount = await prisma.equipeIdeal.count();
      const totalAfter = existingCount + entries.length;
      const MAX_PLAYERS = 16;

      if (totalAfter > MAX_PLAYERS) {
        throw new Error(`Ajout impossible : limite de ${MAX_PLAYERS} joueurs dépassée`);
      }

      const created = [];

      for (const entry of entries) {
        const exists = await prisma.equipeIdeal.findFirst({ where: { joueurId: entry.id } });
        if (exists) {
          throw new Error(`Joueur ${entry.id} déjà dans l'équipe idéale`);
        }

        const joueur = await prisma.joueur.findUnique({ where: { id: entry.id } });
        if (!joueur) {
          throw new Error(`Joueur ${entry.id} introuvable`);
        }

        const record = await prisma.equipeIdeal.create({
          data: {
            joueurId: entry.id,
            poste: entry.poste,
            addedAt: new Date(),
          },
        });

        created.push(record);
      }

      return created;
    } catch (error) {
      console.error('Erreur validateAndCreate:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }

  /**
   * Supprime un joueur
   */
  public async removeJoueur(entryId: string): Promise<void> {
    try {
      await prisma.equipeIdeal.delete({ where: { id: entryId } });
    } catch (error) {
      console.error(`Erreur removeJoueur (${entryId}):`, error);
      throw new Error('Impossible de supprimer le joueur');
    }
  }

  /**
   * Met à jour un joueur
   */
  public async updateJoueur(entryId: string, updates: Partial<{ poste: number }>) {
    try {
      return await prisma.equipeIdeal.update({
        where: { id: entryId },
        data: updates,
      });
    } catch (error) {
      console.error(`Erreur updateJoueur (${entryId}):`, error);
      throw new Error('Impossible de mettre à jour le joueur');
    }
  }
}
