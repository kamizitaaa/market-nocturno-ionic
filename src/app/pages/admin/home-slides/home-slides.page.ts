import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, closeOutline, saveOutline, refreshOutline } from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { HomeService, HomeSlide } from '../../../services/home';

@Component({
  selector: 'app-home-slides',
  templateUrl: './home-slides.page.html',
  styleUrls: ['./home-slides.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class HomeSlidesPage implements OnInit, ViewWillEnter {

  slides: HomeSlide[] = [];
  cargando = true;
  cargandoRecarga = false;

  modalAbierto = false;
  guardando = false;
  archivoSeleccionado: File | null = null;
  tituloNuevo = '';

  constructor(private homeService: HomeService) {
    addIcons({ addOutline, trashOutline, closeOutline, saveOutline, refreshOutline });
  }

  ngOnInit() {
    this.cargarSlides();
  }

  ionViewWillEnter() {
    this.cargarSlides();
  }

  cargarSlides() {
    this.cargando = true;
    this.cargandoRecarga = true;

    this.homeService.getSlidesAdmin().subscribe({
      next: (data) => {
        this.slides = data;
        this.cargando = false;
        setTimeout(() => this.cargandoRecarga = false, 400);
      },
      error: () => {
        this.slides = [];
        this.cargando = false;
        setTimeout(() => this.cargandoRecarga = false, 400);
      }
    });
  }

  abrirModal() {
    this.archivoSeleccionado = null;
    this.tituloNuevo = '';
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  agregarSlide() {
    if (!this.archivoSeleccionado) {
      alert('Selecciona una imagen');
      return;
    }

    this.guardando = true;
    this.homeService.agregarSlide(this.archivoSeleccionado, this.tituloNuevo).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModal();
        this.cargarSlides();
      },
      error: () => {
        this.guardando = false;
        alert('No se pudo agregar la imagen');
      }
    });
  }

  toggleActivo(slide: HomeSlide) {
    this.homeService.toggleActivo(slide.id).subscribe({
      next: () => this.cargarSlides(),
      error: () => alert('No se pudo actualizar el estado')
    });
  }

  eliminarSlide(slide: HomeSlide) {
    if (!confirm('¿Eliminar esta imagen del carrusel?')) return;

    this.homeService.eliminarSlide(slide.id).subscribe({
      next: () => this.cargarSlides(),
      error: () => alert('No se pudo eliminar la imagen')
    });
  }

  recargar() {
    this.cargarSlides();
  }
}