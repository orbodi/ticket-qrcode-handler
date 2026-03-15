import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  stats = { total: 0, active: 0, used: 0, expired: 0 };
  recentTickets: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.stats = this.ticketService.getStats();
    this.recentTickets = this.ticketService.getAll().slice(0, 5);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Actif',
      used: 'Utilisé',
      expired: 'Expiré',
      invalid: 'Invalide'
    };
    return labels[status] || status;
  }
}
