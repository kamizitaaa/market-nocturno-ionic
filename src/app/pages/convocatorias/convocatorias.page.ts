import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, megaphoneOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';

interface Convocatoria {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  imagen: string;
  activa: boolean;
}

@Component({
  selector: 'app-convocatorias-public',
  templateUrl: './convocatorias.page.html',
  styleUrls: ['./convocatorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonIcon,
    HeaderComponent
  ]
})
export class ConvocatoriasPage implements OnInit {

  // Por ahora local; cuando tengas backend, aquí harás el fetch al servicio
  convocatorias: Convocatoria[] = [
    {
      id: 1,
      titulo: 'Convocatoria Edición Agosto 2026',
      descripcion: 'Abrimos convocatoria para nuevos emprendedores que quieran participar en la edición de agosto del Market Nocturno. Buscamos negocios de comida, artesanías, ropa y accesorios.',
      fechaInicio: '2026-07-25',
      fechaFin: '2026-08-10',
      imagen: 'https://via.placeholder.com/900x400',
      activa: true
    },
    {
      id: 2,
      titulo: 'Convocatoria Zona de Artesanías',
      descripcion: 'Buscamos artesanos locales para ampliar la zona de artesanías del mercado. Trae tus productos hechos a mano y sé parte de esta nueva edición.',
      fechaInicio: '2026-06-01',
      fechaFin: '2026-06-30',
      imagen: 'https://via.placeholder.com/900x400',
      activa: false
    }
  ];

  constructor() {
    addIcons({ calendarOutline, megaphoneOutline });
  }

  ngOnInit() {}

  get convocatoriasActivas(): Convocatoria[] {
    return this.convocatorias.filter(c => c.activa);
  }
}