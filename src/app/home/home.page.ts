import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { LaneService } from 'src/app/core/lane/lane.service';
import { LaneStudent } from 'src/app/core/models/LaneStudent';
import { LaneData } from 'src/app/core/models/LaneData';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class HomePage implements OnInit, OnDestroy {

  // Objeto para almacenar los estudiantes por carril
  laneData: LaneData = {
    'carril-1': [],
    'carril-2': [],
    'carril-3': []
  };

  private laneDataSubscription: Subscription | undefined; // Suscripción al Observable del servicio

  constructor(private laneService: LaneService) {} // Inyectar LaneService

  ngOnInit() {
    // Suscribirse al Observable del servicio para recibir actualizaciones de los carriles
    this.laneDataSubscription = this.laneService.laneData$.subscribe(data => {
      this.laneData = data;
      console.log('Datos de carriles recibidos en el componente:', this.laneData);
    });
  }

  ngOnDestroy() {
    // Desuscribirse del Observable del servicio cuando el componente se destruye
    this.laneDataSubscription?.unsubscribe();
    // Opcional: Si el LaneService es un singleton y quieres detener sus listeners
    // this.laneService.destroyListeners(); // Solo si LaneService no se usa en ningún otro lugar
  }

  /**
   * Obtiene la clase CSS para el color de fondo de la fila según la sección del estudiante.
   * @param seccion La sección del estudiante ('preescolar', 'primaria', 'bachillerato').
   * @returns La clase CSS correspondiente.
   */
  getSectionColorClass(seccion: string): string {
    switch (seccion.toLowerCase()) {
      case 'preescolar':
        return 'preescolar-bg'; // Amarillo
      case 'primaria':
        return 'primaria-bg'; // Rojo
      case 'bachillerato':
        return 'bachillerato-bg'; // Verde
      default:
        return ''; // Sin color por defecto
    }
  }
}
