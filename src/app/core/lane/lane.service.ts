import { Injectable } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';

import { LaneData } from 'src/app/core/models/LaneData';
import { LaneStudent } from 'src/app/core/models/LaneStudent';

@Injectable({
  providedIn: 'root'
})
export class LaneService {
  private laneDataSubject: Subject<LaneData> = new Subject<LaneData>();
  public laneData$: Observable<LaneData> = this.laneDataSubject.asObservable();

  private firestoreSubscriptions: Subscription[] = [];
  private currentLaneData: LaneData = {
    'carril-1': [],
    'carril-2': [],
    'carril-3': []
  };

  constructor(private firestore: Firestore) {
    this.setupLaneListeners(); // Configurar los listeners al inicializar el servicio
  }

  /**
   * Configura los listeners en tiempo real para cada carril en Firestore.
   * Emite los datos actualizados a través de laneDataSubject.
   */
  private setupLaneListeners() {
    const laneIds = ['carril-1', 'carril-2', 'carril-3'];

    laneIds.forEach(laneId => {
      const laneDocRef = doc(this.firestore, 'pickup_queue', laneId);
      const sub = new Subscription(onSnapshot(laneDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.currentLaneData[laneId as keyof LaneData] = (data['students'] || []) as LaneStudent[];
        } else {
          this.currentLaneData[laneId as keyof LaneData] = [];
        }
        // Emitir la copia actualizada de los datos de todos los carriles
        this.laneDataSubject.next({ ...this.currentLaneData });
        console.log(`Carril ${laneId} actualizado en el servicio:`, this.currentLaneData[laneId as keyof LaneData]);
      }));
      this.firestoreSubscriptions.push(sub);
    });
  }

  /**
   * Limpia todas las suscripciones de Firestore cuando el servicio ya no es necesario.
   * Esto es importante para evitar fugas de memoria.
   */
  destroyListeners() {
    this.firestoreSubscriptions.forEach(sub => sub.unsubscribe());
    this.firestoreSubscriptions = []; // Limpiar el array de suscripciones
    this.laneDataSubject.complete(); // Opcional: completar el Subject si el servicio se destruye
  }

}
