import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonButton,
  IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import { HeaderComponent } from '../shared/headers/public-header/header.component';
import { HomeService, HomeSlide } from '../services/home';

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

  slidesOriginales: HomeSlide[] = [];

  // Clonamos primero/último para el loop infinito
  carouselImages: HomeSlide[] = [];
  currentSlide = 1;
  slideWidth = 285;
  isTransitioning = false;
  autoPlayInterval: any;

  // Número de slides visibles según el ancho de pantalla.
  // Debe coincidir con los breakpoints de home.page.scss (.carousel-slide min-width)
  slidesToShow = 4;

  constructor(private homeService: HomeService) {
    addIcons({ personOutline });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateSlidesToShow();
  }

  updateSlidesToShow() {
    const width = window.innerWidth;
    // Debe coincidir con @media (max-width: 768px) en home.page.scss
    this.slidesToShow = width <= 768 ? 1 : 4;
  }

  ngOnInit() {
    this.updateSlidesToShow();

    this.homeService.getSlides().subscribe({
      next: (data) => {
        this.slidesOriginales = data;

        if (this.slidesOriginales.length > 0) {
          this.carouselImages = [
            this.slidesOriginales[this.slidesOriginales.length - 1],
            ...this.slidesOriginales,
            this.slidesOriginales[0]
          ];
          this.startAutoPlay();
        }
      },
      error: () => {
        this.slidesOriginales = [];
        this.carouselImages = [];
      }
    });
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
    const slidePercent = 100 / this.slidesToShow;
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
        this.currentSlide = this.slidesOriginales.length;
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