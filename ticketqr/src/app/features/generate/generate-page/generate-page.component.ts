import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CryptoService } from '../../../core/services/crypto.service';

@Component({
  selector: 'app-generate-page',
  standalone: false,
  templateUrl: './generate-page.component.html',
  styleUrls: ['./generate-page.component.scss']
})
export class GeneratePageComponent implements OnInit {
  @ViewChild('qrWrapper') qrWrapper!: ElementRef;

  qrData = '';
  copied = false;

  constructor(private crypto: CryptoService) {}

  ngOnInit(): void {
    try {
      this.qrData = this.crypto.generateQrData();
    } catch (e) {
      console.error('Erreur génération QR:', e);
    }
  }

  download(): void {
    setTimeout(() => {
      const canvas = document.querySelector('.qr-wrapper canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL('image/png');

      // iOS Safari ne supporte pas le download programmatique
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.open(dataUrl, '_blank');
        return;
      }

      const link = document.createElement('a');
      link.download = 'ticket-qrcode.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 100);
  }

  copy(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.qrData).catch(() => {});
    }
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }
}
