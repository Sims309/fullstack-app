// tests/checkUserRole.test.ts
import { checkUserRole } from '@middleware/checkUserRole';
import { Request, Response, NextFunction } from 'express';

// Mock du module auditLogger pour éviter les dépendances externes dans les tests
jest.mock('@utils/auditLogger', () => ({
  logFraudAttempt: jest.fn()
}));

describe('🧠 Middleware checkUserRole', () => {
  const createMockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
  };

  const createMockReq = (user?: any, ip = '127.0.0.1', originalUrl = '/test'): Request => {
    return {
      user,
      ip,
      originalUrl
    } as Request;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('❌ refuse si aucun utilisateur', () => {
    const req = createMockReq(undefined);
    const res = createMockRes();
    const next = jest.fn();

    checkUserRole(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Accès non autorisé. Aucun rôle trouvé.' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('❌ refuse si utilisateur sans rôle', () => {
    const req = createMockReq({ id: '123' }); // user sans role
    const res = createMockRes();
    const next = jest.fn();

    checkUserRole(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Accès non autorisé. Aucun rôle trouvé.' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('❌ refuse si rôle non autorisé', () => {
    const req = createMockReq({ role: 'user' });
    const res = createMockRes();
    const next = jest.fn();

    checkUserRole(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Accès interdit. Rôle requis : admin' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('✅ accepte si rôle autorisé', () => {
    const req = createMockReq({ role: 'admin' });
    const res = createMockRes();
    const next = jest.fn();

    checkUserRole(['admin'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('✅ accepte si un des rôles multiples est autorisé', () => {
    const req = createMockReq({ role: 'moderator' });
    const res = createMockRes();
    const next = jest.fn();

    checkUserRole(['admin', 'moderator', 'manager'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('🔒 gère les valeurs par défaut pour ip et originalUrl manquants', () => {
    const req = { user: undefined } as Request; // Pas d'ip ni originalUrl
    const res = createMockRes();
    const next = jest.fn();

    // Ne devrait pas planter même sans ip/originalUrl
    expect(() => {
      checkUserRole(['admin'])(req, res, next);
    }).not.toThrow();

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
