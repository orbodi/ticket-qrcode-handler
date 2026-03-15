export type TicketStatus = 'active' | 'used' | 'expired' | 'invalid';
export type TicketCategory = 'VIP' | 'Standard' | 'Premium' | 'Press';

export interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  holderName: string;
  holderEmail: string;
  category: TicketCategory;
  seatNumber?: string;
  createdAt: string;
  status: TicketStatus;
  signature: string;
  usedAt?: string;
}

export interface ValidationResult {
  valid: boolean;
  ticket?: Ticket;
  message: string;
  scannedAt: string;
}

export interface TicketFormData {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  holderName: string;
  holderEmail: string;
  category: TicketCategory;
  seatNumber?: string;
}
