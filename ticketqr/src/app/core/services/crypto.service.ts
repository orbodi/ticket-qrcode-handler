import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'tqr-$3cr3t-k3y-2026-@auth';
const VALID_TOKEN = 'TICKETQR-AUTHENTIC-v1';

@Injectable({ providedIn: 'root' })
export class CryptoService {

  // Génère une signature HMAC déterministe — toujours la même
  generateQrData(): string {
    return CryptoJS.HmacSHA256(VALID_TOKEN, SECRET_KEY).toString(CryptoJS.enc.Hex);
  }

  // Vérifie que le QR scanné provient bien de cette app
  verify(scanned: string): boolean {
    try {
      const expected = this.generateQrData();
      return scanned.trim() === expected;
    } catch {
      return false;
    }
  }
}
