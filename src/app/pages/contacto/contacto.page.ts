import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, chatboxOutline, sendOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { ContactoService } from '../../services/contacto';

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
  enviando = false;

  constructor(private contactoService: ContactoService) {
    addIcons({ personOutline, mailOutline, chatboxOutline, sendOutline });
  }

  enviar() {
    if (!this.nombre || !this.email || !this.asunto || !this.mensaje) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.enviando = true;

    this.contactoService.enviar({
      nombre: this.nombre,
      email: this.email,
      asunto: this.asunto,
      mensaje: this.mensaje
    }).subscribe({
      next: () => {
        this.enviando = false;
        alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
        this.nombre = '';
        this.email = '';
        this.asunto = '';
        this.mensaje = '';
      },
      error: (err) => {
        this.enviando = false;
        console.error('Error al enviar mensaje de contacto:', err);
        alert('Ocurrió un error al enviar tu mensaje. Intenta de nuevo.');
      }
    });
  }
}