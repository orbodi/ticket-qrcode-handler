import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'ticketqr-secret-2026-secure-key';

@Injectable({ providedIn: 'root' })
export class CryptoService {

  sign(payload: string): string {
    return CryptoJS.HmacSHA256(payload, SECRET_KEY).toString(CryptoJS.enc.Hex);
  }

  verify(payload: string, signature: string): boolean {
    const expected = this.sign(payload);
    return expected === signature;
  }

  buildPayload(id: string, eventDate: string, holderEmail: string): string {
    return `${id}|${eventDate}|${holderEmail}`;
  }
}
