import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mi-emprendimiento',
  templateUrl: './mi-emprendimiento.page.html',
  styleUrls: ['./mi-emprendimiento.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MiEmprendimientoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
