import { Injectable } from '@angular/core';
import { Ticket, TicketFormData, ValidationResult } from '../models/ticket.model';
import { CryptoService } from './crypto.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TicketService {

  constructor(
    private crypto: CryptoService,
    private storage: StorageService
  ) {}

  create(data: TicketFormData): Ticket {
    const id = this.generateId();
    const payload = this.crypto.buildPayload(id, data.eventDate, data.holderEmail);
    const signature = this.crypto.sign(payload);

    const ticket: Ticket = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'active',
      signature,
    };

    this.storage.save(ticket);
    return ticket;
  }

  validate(qrContent: string): ValidationResult {
    const scannedAt = new Date().toISOString();

    let parsed: any;
    try {
      parsed = JSON.parse(qrContent);
    } catch {
      return { valid: false, message: 'QR code invalide ou illisible.', scannedAt };
    }

    if (!parsed.id || !parsed.signature) {
      return { valid: false, message: 'Structure QR invalide.', scannedAt };
    }

    const stored = this.storage.getById(parsed.id);
    if (!stored) {
      return { valid: false, message: 'Ticket introuvable dans le système.', scannedAt };
    }

    const payload = this.crypto.buildPayload(stored.id, stored.eventDate, stored.holderEmail);
    if (!this.crypto.verify(payload, parsed.signature)) {
      return { valid: false, ticket: stored, message: 'Signature invalide — ticket falsifié !', scannedAt };
    }

    if (stored.status === 'used') {
      return { valid: false, ticket: stored, message: `Ticket déjà utilisé le ${this.formatDate(stored.usedAt!)}.`, scannedAt };
    }

    if (stored.status === 'expired') {
      return { valid: false, ticket: stored, message: 'Ticket expiré.', scannedAt };
    }

    const eventDate = new Date(stored.eventDate);
    if (eventDate < new Date()) {
      stored.status = 'expired';
      this.storage.save(stored);
      return { valid: false, ticket: stored, message: 'Ticket expiré — événement passé.', scannedAt };
    }

    stored.status = 'used';
    stored.usedAt = scannedAt;
    this.storage.save(stored);

    return { valid: true, ticket: stored, message: 'Ticket valide et enregistré !', scannedAt };
  }

  buildQrData(ticket: Ticket): string {
    return JSON.stringify({ id: ticket.id, signature: ticket.signature });
  }

  getAll(): Ticket[] {
    return this.storage.getAll();
  }

  delete(id: string): void {
    this.storage.delete(id);
  }

  getStats() {
    return this.storage.getStats();
  }

  private generateId(): string {
    return 'TKT-' + Date.now().toString(36).toUpperCase() + '-' +
      Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  private formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR');
  }
}
