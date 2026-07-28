import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline, pulseOutline, addCircleOutline, starOutline,
  searchOutline, downloadOutline, createOutline, trashOutline,
  personOutline, refreshOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class DashboardPage implements OnInit {

  textoBusqueda = '';

  stats = {
    total: 2,
    activos: 2,
    nuevos: 0,
    destacados: 1
  };

  emprendedores = [
    {
      id: 1,
      nombre: 'María García',
      email: 'maria@gmail.com',
      telefono: '449 123 4567',
      registro: '2026-01-15',
      mfa: true
    },
    {
      id: 2,
      nombre: 'Lupita Martínez',
      email: 'lupita@gmail.com',
      telefono: '449 987 6543',
      registro: '2026-02-20',
      mfa: false
    }
  ];

  constructor() {
    addIcons({
      peopleOutline, pulseOutline, addCircleOutline, starOutline,
      searchOutline, downloadOutline, createOutline, trashOutline,
      personOutline, refreshOutline
    });
  }

  ngOnInit() {}

  get emprendedoresFiltrados() {
    if (!this.textoBusqueda) return this.emprendedores;
    const texto = this.textoBusqueda.toLowerCase();
    return this.emprendedores.filter(e =>
      e.nombre.toLowerCase().includes(texto) ||
      e.email.toLowerCase().includes(texto)
    );
  }
}