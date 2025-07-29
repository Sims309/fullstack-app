// tests/equipeIdeal.service.test.ts ✅
import { EquipeIdealService } from '../src/server/services/equipeIdeal.service';
import { prisma } from '../src/server/prismaClient'; // ✅ chemin relatif depuis tests/

// 🧪 Mock de prisma
jest.mock('../src/server/prismaClient', () => ({
  prisma: {
    joueur: {
      findUnique: jest.fn(),
    },
    equipeIdeal: {
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const service = new EquipeIdealService();

describe('🔧 Méthodes CRUD du service EquipeIdeal', () => {
  const joueurMock = {
    id: '123',
    poste: 1,
    nom: 'Test Joueur',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ addJoueur - ajoute un joueur si tout est valide', async () => {
    (prisma.equipeIdeal.count as jest.Mock).mockResolvedValue(0);
    (prisma.equipeIdeal.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.joueur.findUnique as jest.Mock).mockResolvedValue(joueurMock);
    (prisma.equipeIdeal.create as jest.Mock).mockResolvedValue({
      ...joueurMock,
    });

    const res = await service.addJoueur({ id: joueurMock.id, poste: joueurMock.poste });

    expect(prisma.equipeIdeal.create).toHaveBeenCalled();
    expect(res).toEqual([{ ...joueurMock }]);
  });

  it('🗑️ removeJoueur - supprime un joueur par ID', async () => {
    (prisma.equipeIdeal.delete as jest.Mock).mockResolvedValue({});

    await service.removeJoueur('123');

    expect(prisma.equipeIdeal.delete).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('✏️ updateJoueur - met à jour le poste du joueur', async () => {
    const updated = { id: '123', poste: 2 };

    (prisma.equipeIdeal.update as jest.Mock).mockResolvedValue(updated);

    const result = await service.updateJoueur('123', { poste: 2 });

    expect(prisma.equipeIdeal.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { poste: 2 },
    });

    expect(result).toEqual(updated);
  });
});