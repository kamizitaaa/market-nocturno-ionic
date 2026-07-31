import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, arrowBackOutline, storefrontOutline, addOutline, removeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { EmprendimientoService } from '../../services/emprendimiento';
import { ProductoService } from '../../services/producto';
import { CarritoService } from '../../services/carrito';
import { AuthService } from '../../services/auth';
import { Emprendimiento } from '../../models/emprendimiento.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-emprendimiento-detalle',
  templateUrl: './emprendimiento-detalle.page.html',
  styleUrls: ['./emprendimiento-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, HeaderComponent]
})
export class EmprendimientoDetallePage implements OnInit {

  emprendimiento: Emprendimiento | null = null;
  productos: Producto[] = [];
  isLoggedIn = false;
  cargando = true;
  agregandoId: number | null = null;

  // Cantidad seleccionada por producto (id del producto -> cantidad)
  cantidades: { [productoId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emprendimientoService: EmprendimientoService,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private authService: AuthService
  ) {
    addIcons({ cartOutline, arrowBackOutline, storefrontOutline, addOutline, removeOutline });
  }

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isAuthenticated();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos(id);
  }

  cargarDatos(id: number) {
    this.cargando = true;

    this.emprendimientoService.getById(id).subscribe({
      next: (data) => {
        this.emprendimiento = data;
      },
      error: () => {
        this.emprendimiento = null;
      }
    });

    this.productoService.getAll(id).subscribe({
      next: (data) => {
        this.productos = data;
        // Inicializa cada producto en cantidad 1
        data.forEach(p => this.cantidades[p.id] = 1);
        this.cargando = false;
      },
      error: () => {
        this.productos = [];
        this.cargando = false;
      }
    });
  }

  getCantidad(productoId: number): number {
    return this.cantidades[productoId] ?? 1;
  }

  cambiarCantidad(productoId: number, delta: number) {
    const actual = this.getCantidad(productoId);
    const nueva = actual + delta;
    if (nueva < 1) return;
    this.cantidades[productoId] = nueva;
  }

  agregarAlCarrito(producto: Producto) {
    const cantidad = this.getCantidad(producto.id);

    this.agregandoId = producto.id;
    this.carritoService.agregar(producto.id, cantidad).subscribe({
      next: () => {
        this.agregandoId = null;
        alert(`"${producto.nombre}" (x${cantidad}) se agregó a tu carrito`);
        this.cantidades[producto.id] = 1; // reinicia el contador después de agregar
      },
      error: () => {
        this.agregandoId = null;
        alert('No se pudo agregar el producto, intenta de nuevo');
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  volver() {
    this.router.navigate(['/emprendimientos']);
  }
}