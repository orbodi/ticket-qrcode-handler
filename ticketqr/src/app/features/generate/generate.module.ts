import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { GenerateRoutingModule } from './generate-routing.module';
import { GeneratePageComponent } from './generate-page/generate-page.component';

@NgModule({
  declarations: [GeneratePageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenerateRoutingModule,
    QRCodeComponent
  ]
})
export class GenerateModule {}
