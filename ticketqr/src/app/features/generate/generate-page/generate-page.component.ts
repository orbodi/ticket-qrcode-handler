import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../../core/services/crypto.service';

@Component({
  selector: 'app-generate-page',
  standalone: false,
  templateUrl: './generate-page.component.html',
  styleUrls: ['./generate-page.component.scss']
})
export class GeneratePageComponent implements OnInit {
  qrData = '';
  copied = false;

  constructor(private crypto: CryptoService) {}

  ngOnInit(): void {
    this.qrData = this.crypto.generateQrData();
  }

  download(): void {
    const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'ticket-qrcode.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  copy(): void {
    navigator.clipboard.writeText(this.qrData);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }
}
