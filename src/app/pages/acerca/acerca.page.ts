import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../shared/header/header.component';

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
export class AcercaPage {

  equipo = [
    {
      nombre: 'Ana García',
      puesto: 'Fundadora & Directora',
      descripcion: 'Apasionada del emprendimiento local con más de 5 años impulsando el comercio en Aguascalientes.',
      foto: 'assets/LogoMercadoNoctuno.png'
    },
    {
      nombre: 'Carlos Martínez',
      puesto: 'Coordinador de Eventos',
      descripcion: 'Responsable de que cada edición del Market sea una experiencia única e inolvidable.',
      foto: 'assets/LogoMercadoNoctuno.png'
    },
    {
      nombre: 'María López',
      puesto: 'Relaciones con Emprendedores',
      descripcion: 'El puente entre los emprendedores y el Market, siempre lista para ayudar a crecer.',
      foto: 'assets/LogoMercadoNoctuno.png'
    },
    {
      nombre: 'Roberto Díaz',
      puesto: 'Marketing & Redes Sociales',
      descripcion: 'El encargado de que el mundo conozca la magia del Market Nocturno en redes sociales.',
      foto: 'assets/LogoMercadoNoctuno.png'
    }
  ];

  galeria = [
    'elmejor.png',
    'yoamomarket.png',
    'mascaras.png',
    'personas2.png',
    'personas.png',
    'pelicula.png'
  ];
}