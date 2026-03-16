import { Component, OnDestroy, NgZone } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { CryptoService } from '../../../core/services/crypto.service';

type State = 'idle' | 'scanning' | 'valid' | 'invalid';

@Component({
  selector: 'app-scan-page',
  standalone: false,
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnDestroy {
  state: State = 'idle';
  cameraError = '';
  manualInput = '';
  showManual = false;

  private html5Qrcode: Html5Qrcode | null = null;

  constructor(private crypto: CryptoService, private zone: NgZone) {}

  startCamera(): void {
    this.state = 'scanning';
    this.cameraError = '';

    setTimeout(() => {
      this.html5Qrcode = new Html5Qrcode('qr-reader');
      this.html5Qrcode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded: string) => {
          this.zone.run(() => this.processResult(decoded));
        },
        () => {}
      ).catch(() => {
        this.zone.run(() => {
          this.cameraError = 'Impossible d\'accéder à la caméra. Utilisez la saisie manuelle.';
          this.state = 'idle';
          this.showManual = true;
        });
      });
    }, 100);
  }

  stopCamera(): void {
    this.html5Qrcode?.stop().catch(() => {});
    this.html5Qrcode = null;
  }

  validateManual(): void {
    if (this.manualInput.trim()) {
      this.processResult(this.manualInput.trim());
    }
  }

  private processResult(data: string): void {
    this.stopCamera();
    this.state = this.crypto.verify(data) ? 'valid' : 'invalid';
  }

  reset(): void {
    this.state = 'idle';
    this.manualInput = '';
    this.cameraError = '';
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
