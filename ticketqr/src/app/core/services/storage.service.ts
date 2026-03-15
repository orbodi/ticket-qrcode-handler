import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model';

const STORAGE_KEY = 'ticketqr_tickets';

@Injectable({ providedIn: 'root' })
export class StorageService {

  getAll(): Ticket[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getById(id: string): Ticket | undefined {
    return this.getAll().find(t => t.id === id);
  }

  save(ticket: Ticket): void {
    const tickets = this.getAll();
    const idx = tickets.findIndex(t => t.id === ticket.id);
    if (idx >= 0) {
      tickets[idx] = ticket;
    } else {
      tickets.unshift(ticket);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }

  delete(id: string): void {
    const tickets = this.getAll().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }

  getStats() {
    const all = this.getAll();
    return {
      total: all.length,
      active: all.filter(t => t.status === 'active').length,
      used: all.filter(t => t.status === 'used').length,
      expired: all.filter(t => t.status === 'expired').length,
    };
  }
}
