import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../../core/models/ticket.model';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-tickets-page',
  standalone: false,
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.scss']
})
export class TicketsPageComponent implements OnInit {
  allTickets: Ticket[] = [];
  filtered: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  selectedQrData = '';

  searchTerm = '';
  filterStatus = 'all';
  filterCategory = 'all';

  statuses = ['all', 'active', 'used', 'expired'];
  categories = ['all', 'Standard', 'Premium', 'VIP', 'Press'];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.allTickets = this.ticketService.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filtered = this.allTickets.filter(t => {
      const matchSearch = !this.searchTerm ||
        t.eventName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.holderName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus = this.filterStatus === 'all' || t.status === this.filterStatus;
      const matchCat = this.filterCategory === 'all' || t.category === this.filterCategory;
      return matchSearch && matchStatus && matchCat;
    });
  }

  openTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.selectedQrData = this.ticketService.buildQrData(ticket);
  }

  closeDetail(): void {
    this.selectedTicket = null;
    this.selectedQrData = '';
  }

  deleteTicket(id: string): void {
    if (confirm('Supprimer ce ticket définitivement ?')) {
      this.ticketService.delete(id);
      this.load();
      if (this.selectedTicket?.id === id) {
        this.closeDetail();
      }
    }
  }

  downloadQr(ticket: Ticket): void {
    const canvas = document.querySelector('.detail-qr qrcode canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `ticket-${ticket.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { active: 'Actif', used: 'Utilisé', expired: 'Expiré', invalid: 'Invalide' };
    return map[status] || status;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR');
  }
}
