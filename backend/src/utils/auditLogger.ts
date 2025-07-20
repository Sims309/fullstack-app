// src/server/utils/auditLogger.ts
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../../../logs/audit.log');

export function logFraudAttempt(ip: string, endpoint: string, reason: string) {
  const logEntry = `[${new Date().toISOString()}] IP: ${ip} | Endpoint: ${endpoint} | Raison: ${reason}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Erreur lors de l’écriture du journal de fraude :', err);
    }
  });
}

export function readFraudLogs(): string {
  try {
    return fs.readFileSync(logFilePath, 'utf-8');
  } catch (err) {
    return 'Aucun journal trouvé ou erreur de lecture.';
  }
}
