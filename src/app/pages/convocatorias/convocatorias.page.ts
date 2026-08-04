import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, megaphoneOutline, closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { ConvocatoriaService, Convocatoria } from '../../services/convocatoria';

@Component({
  selector: 'app-convocatorias-public',
  templateUrl: './convocatorias.page.html',
  styleUrls: ['./convocatorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon,
    HeaderComponent
  ]
})
export class ConvocatoriasPage implements OnInit {

  convocatoriasActivas: Convocatoria[] = [];
  cargando = true;

  // Modal inscripción
  modalInscripcionAbierto = false;
  convocatoriaSeleccionada: Convocatoria | null = null;
  enviandoInscripcion = false;

  formInscripcion = {
    nombre: '',
    telefono: '',
    email: '',
    tipo_negocio: '',
    mensaje: ''
  };

  constructor(private convocatoriaService: ConvocatoriaService) {
    addIcons({ calendarOutline, megaphoneOutline, closeOutline });
  }

  ngOnInit() {
    this.cargarConvocatorias();
  }

  cargarConvocatorias() {
    this.cargando = true;
    this.convocatoriaService.getAll().subscribe({
      next: (data) => {
        this.convocatoriasActivas = data;
        this.cargando = false;
      },
      error: () => {
        this.convocatoriasActivas = [];
        this.cargando = false;
      }
    });
  }

  abrirModalInscripcion(conv: Convocatoria) {
    this.convocatoriaSeleccionada = conv;
    this.formInscripcion = { nombre: '', telefono: '', email: '', tipo_negocio: '', mensaje: '' };
    this.modalInscripcionAbierto = true;
  }

  cerrarModalInscripcion() {
    this.modalInscripcionAbierto = false;
    this.convocatoriaSeleccionada = null;
  }

  enviarInscripcion() {
    if (!this.formInscripcion.nombre || !this.formInscripcion.telefono || !this.formInscripcion.tipo_negocio) {
      alert('Nombre, teléfono y tipo de negocio son obligatorios');
      return;
    }

    if (!this.convocatoriaSeleccionada) return;

    this.enviandoInscripcion = true;
    this.convocatoriaService.inscribirse(this.convocatoriaSeleccionada.id, this.formInscripcion).subscribe({
      next: (res) => {
        this.enviandoInscripcion = false;
        alert(res.message);
        this.cerrarModalInscripcion();
      },
      error: (err) => {
        this.enviandoInscripcion = false;
        if (err.error?.errors) {
          const mensajes = ([] as string[]).concat(...Object.values(err.error.errors) as string[][]).join('\n');
          alert(mensajes);
        } else {
          alert(err.error?.message || 'No se pudo completar la inscripción');
        }
      }
    });
  }
}