import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonButton,
  IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import { HeaderComponent } from '../shared/headers/public-header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonContent, IonButton,
    IonButtons, IonIcon, HeaderComponent
  ]
})
export class HomePage implements OnInit, OnDestroy {

  originalImages = [
    'elmejor.png',
    'yoamomarket.png',
    'mascaras.png',
    'personas2.png',
    'personas.png',
    'pelicula.png',
    'fachada.png'
  ];

  // Clonamos primeras y últimas para el loop infinito
  carouselImages: string[] = [];
  currentSlide = 1;
  slideWidth = 285;
  isTransitioning = false;
  autoPlayInterval: any;

  constructor() {
    addIcons({ personOutline });
  }

  ngOnInit() {
    // Agrega clon del último al inicio y clon del primero al final
    this.carouselImages = [
      this.originalImages[this.originalImages.length - 1],
      ...this.originalImages,
      this.originalImages[0]
    ];
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  getTrackStyle() {
  const slidePercent = 100 / 4; // 4 slides visibles
  return {
    transform: `translateX(-${this.currentSlide * slidePercent}%)`,
    transition: this.isTransitioning ? 'none' : 'transform 0.5s ease-in-out'
    };
  }

  prevSlide() {
    this.stopAutoPlay();
    this.currentSlide--;

    if (this.currentSlide === 0) {
      setTimeout(() => {
        this.isTransitioning = true;
        this.currentSlide = this.originalImages.length;
        setTimeout(() => this.isTransitioning = false, 50);
      }, 500);
    }
    this.startAutoPlay();
  }

  nextSlide() {
    this.currentSlide++;

    if (this.currentSlide === this.carouselImages.length - 1) {
      setTimeout(() => {
        this.isTransitioning = true;
        this.currentSlide = 1;
        setTimeout(() => this.isTransitioning = false, 50);
      }, 500);
    }
  }
}