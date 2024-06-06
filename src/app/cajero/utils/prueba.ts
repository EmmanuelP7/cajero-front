// src/app/cajero.service.ts

import { Injectable } from '@angular/core';

export interface Denominacion
{
  denominacion: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CajeroService
{
  private dinero: Denominacion[] = [
    { denominacion: 1000, cantidad: 2 },
    { denominacion: 500, cantidad: 5 },
    { denominacion: 200, cantidad: 10 },
    { denominacion: 100, cantidad: 20 },
    { denominacion: 50, cantidad: 30 },
    { denominacion: 20, cantidad: 40 },
    { denominacion: 10, cantidad: 50 },
    { denominacion: 5, cantidad: 100 },
    { denominacion: 2, cantidad: 200 },
    { denominacion: 1, cantidad: 300 },
    { denominacion: 0.5, cantidad: 100 }
  ];

  constructor () { }

  private calcularTotal(): number
  {
    return this.dinero.reduce((total, denominacion) => total + denominacion.denominacion * denominacion.cantidad, 0);
  }

  retirarDinero(monto: number): Denominacion[] | string
  {
    const totalDinero = this.calcularTotal();
    if (monto > totalDinero)
    {
      return "El monto solicitado excede el dinero disponible en el cajero.";
    }
    let resultado: Denominacion[] = [];
    for (let denominacion of this.dinero)
    {
      let cantidadNecesaria = Math.floor(monto / denominacion.denominacion);
      let cantidadAUsar = Math.min(cantidadNecesaria, denominacion.cantidad);
      if (cantidadAUsar > 0)
      {
        resultado.push({ denominacion: denominacion.denominacion, cantidad: cantidadAUsar });
        monto -= cantidadAUsar * denominacion.denominacion;
        denominacion.cantidad -= cantidadAUsar;
      }
      if (monto === 0)
      {
        break;
      }
    }
    if (monto > 0)
    {
      return "No hay suficiente dinero en el cajero para completar el retiro.";
    }
    return resultado;
  }
}
