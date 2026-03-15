import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketsPageComponent } from './tickets-page/tickets-page.component';

@NgModule({
  declarations: [TicketsPageComponent],
  imports: [CommonModule, FormsModule, RouterModule, TicketsRoutingModule, QRCodeComponent]
})
export class TicketsModule {}
