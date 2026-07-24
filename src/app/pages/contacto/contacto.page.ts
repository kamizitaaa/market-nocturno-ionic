import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, chatboxOutline, sendOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    HeaderComponent
  ]
})
export class ContactoPage {

  nombre = '';
  email = '';
  asunto = '';
  mensaje = '';

  constructor() {
    addIcons({ personOutline, mailOutline, chatboxOutline, sendOutline });
  }

  enviar() {
    if (!this.nombre || !this.email || !this.asunto || !this.mensaje) {
      alert('Por favor completa todos los campos');
      return;
    }

    console.log('Mensaje enviado:', {
      nombre: this.nombre,
      email: this.email,
      asunto: this.asunto,
      mensaje: this.mensaje
    });

    alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    this.nombre = '';
    this.email = '';
    this.asunto = '';
    this.mensaje = '';
  }
}