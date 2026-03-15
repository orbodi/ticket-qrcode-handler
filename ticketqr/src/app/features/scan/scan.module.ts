import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScanRoutingModule } from './scan-routing.module';
import { ScanPageComponent } from './scan-page/scan-page.component';

@NgModule({
  declarations: [ScanPageComponent],
  imports: [CommonModule, FormsModule, ScanRoutingModule]
})
export class ScanModule {}
