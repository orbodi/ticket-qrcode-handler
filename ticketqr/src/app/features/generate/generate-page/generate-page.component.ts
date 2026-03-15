import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket, TicketCategory } from '../../../core/models/ticket.model';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-generate-page',
  standalone: false,
  templateUrl: './generate-page.component.html',
  styleUrls: ['./generate-page.component.scss']
})
export class GeneratePageComponent implements OnInit {
  @ViewChild('qrCanvas') qrCanvas!: ElementRef;

  form!: FormGroup;
  generatedTicket: Ticket | null = null;
  qrData = '';
  isGenerating = false;
  copied = false;

  categories: TicketCategory[] = ['Standard', 'Premium', 'VIP', 'Press'];

  constructor(private fb: FormBuilder, private ticketService: TicketService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      holderName: ['', [Validators.required, Validators.minLength(2)]],
      holderEmail: ['', [Validators.required, Validators.email]],
      category: ['Standard', Validators.required],
      seatNumber: ['']
    });
  }

  generate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isGenerating = true;
    setTimeout(() => {
      this.generatedTicket = this.ticketService.create(this.form.value);
      this.qrData = this.ticketService.buildQrData(this.generatedTicket);
      this.isGenerating = false;
    }, 400);
  }

  reset(): void {
    this.form.reset({ category: 'Standard' });
    this.generatedTicket = null;
    this.qrData = '';
  }

  copyId(): void {
    if (this.generatedTicket) {
      navigator.clipboard.writeText(this.generatedTicket.id);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    }
  }

  downloadQr(): void {
    const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `ticket-${this.generatedTicket?.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  get f() { return this.form.controls; }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
