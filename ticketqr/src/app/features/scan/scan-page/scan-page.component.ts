import { Component, OnDestroy, NgZone, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { ValidationResult } from '../../../core/models/ticket.model';
import { TicketService } from '../../../core/services/ticket.service';

type ScanMode = 'camera' | 'manual';
type ScanState = 'idle' | 'scanning' | 'result';

@Component({
  selector: 'app-scan-page',
  standalone: false,
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnDestroy, AfterViewInit {
  @ViewChild('qrReader') qrReaderRef!: ElementRef;

  mode: ScanMode = 'camera';
  state: ScanState = 'idle';
  result: ValidationResult | null = null;
  manualInput = '';
  error = '';
  scanning = false;

  private html5Qrcode: Html5Qrcode | null = null;

  constructor(private ticketService: TicketService, private zone: NgZone) {}

  ngAfterViewInit(): void {}

  setMode(mode: ScanMode): void {
    this.mode = mode;
    this.state = 'idle';
    this.result = null;
    this.error = '';
    this.stopCamera();
  }

  startCamera(): void {
    this.state = 'scanning';
    this.scanning = true;
    this.error = '';

    setTimeout(() => {
      this.html5Qrcode = new Html5Qrcode('qr-reader');
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      };

      this.html5Qrcode.start(
        { facingMode: 'environment' },
        config,
        (decodedText: string) => {
          this.zone.run(() => {
            this.onScanSuccess(decodedText);
          });
        },
        () => {}
      ).catch((err: any) => {
        this.zone.run(() => {
          this.error = 'Impossible d\'accéder à la caméra. Vérifiez les permissions.';
          this.state = 'idle';
          this.scanning = false;
        });
      });
    }, 100);
  }

  stopCamera(): void {
    if (this.html5Qrcode) {
      this.html5Qrcode.stop().catch(() => {});
      this.html5Qrcode = null;
    }
    this.scanning = false;
  }

  private onScanSuccess(decodedText: string): void {
    this.stopCamera();
    this.state = 'result';
    this.result = this.ticketService.validate(decodedText);
  }

  validateManual(): void {
    if (!this.manualInput.trim()) {
      this.error = 'Veuillez entrer les données du QR code.';
      return;
    }
    this.error = '';
    this.result = this.ticketService.validate(this.manualInput.trim());
    this.state = 'result';
  }

  reset(): void {
    this.state = 'idle';
    this.result = null;
    this.manualInput = '';
    this.error = '';
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR');
  }
}
