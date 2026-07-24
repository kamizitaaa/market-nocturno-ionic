import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline, pulseOutline, addCircleOutline, starOutline,
  searchOutline, downloadOutline, createOutline, trashOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    HeaderComponent
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

  emprendimientos = [
    {
      id: 1,
      nombre: 'Tacos El Güero',
      categoria: 'Comida',
      precio: '$50-100',
      estado: 'activo',
      fecha: '2026-01-15'
    },
    {
      id: 2,
      nombre: 'Artesanías Lupita',
      categoria: 'Artesanías',
      precio: '$100-500',
      estado: 'destacado',
      fecha: '2026-02-20'
    }
  ];

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
      searchOutline, downloadOutline, createOutline, trashOutline
    });
  }

  ngOnInit() {}
}