import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { AcercaService, AcercaInfo, MiembroEquipo, ImagenGaleria } from '../../services/acerca';

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.page.html',
  styleUrls: ['./acerca.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonContent,
    HeaderComponent
  ]
})
export class AcercaPage implements OnInit {

  info: AcercaInfo | null = null;
  equipo: MiembroEquipo[] = [];
  galeria: ImagenGaleria[] = [];

  constructor(private acercaService: AcercaService) {}

  ngOnInit() {
    this.acercaService.getInfo().subscribe({
      next: (data) => { this.info = data; },
      error: () => { this.info = null; }
    });

    this.acercaService.getEquipo().subscribe({
      next: (data) => { this.equipo = data; },
      error: () => { this.equipo = []; }
    });

    this.acercaService.getGaleria().subscribe({
      next: (data) => { this.galeria = data; },
      error: () => { this.galeria = []; }
    });
  }
}