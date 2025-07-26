// tests/checkUserRole.test.ts
import { checkUserRole } from '../src/server/middleware/checkUserRole';
import { getMockReq, getMockRes } from '@jest-mock/express';

jest.mock('../src/utils/auditLogger', () => ({
  logFraudAttempt: jest.fn(),
}));

describe('🧠 Middleware checkUserRole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('❌ refuse si aucun utilisateur', () => {
    const req = getMockReq({ user: undefined });
    const { res, next } = getMockRes();

    checkUserRole(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Accès non autorisé. Authentification requise.' }); // ✅ message corrigé
    expect(next).not.toHaveBeenCalled();
  });

  it('❌ refuse si utilisateur sans rôle', () => {
    const req = getMockReq({ user: {} });
    const { res, next } = getMockRes();

    checkUserRole(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Accès non autorisé. Aucun rôle trouvé.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('❌ refuse si rôle non autorisé', () => {
    const req = getMockReq({ user: { role: 'user' } });
    const { res, next } = getMockRes();

    checkUserRole(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Accès interdit. Rôle requis : admin', userRole: 'user' }); // facultatif selon ton implémentation
    expect(next).not.toHaveBeenCalled();
  });

  it('✅ accepte si rôle autorisé', () => {
    const req = getMockReq({ user: { role: 'admin' } });
    const { res, next } = getMockRes();

    checkUserRole(['admin'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('✅ accepte si un des rôles multiples est autorisé', () => {
    const req = getMockReq({ user: { role: 'moderator' } });
    const { res, next } = getMockRes();

    checkUserRole(['admin', 'moderator', 'manager'])(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('🔒 gère défaut ip/originalUrl manquants sans planter', () => {
    const req: any = getMockReq({ user: undefined });
    delete req.ip;
    delete req.originalUrl;
    const { res, next } = getMockRes();

    expect(() => {
      checkUserRole(['admin'])(req, res, next);
    }).not.toThrow();

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Accès non autorisé. Authentification requise.' }); // ✅ cohérence maintenue
  });
});
