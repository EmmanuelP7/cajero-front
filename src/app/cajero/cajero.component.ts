import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cajero.component.html',
  styleUrl: './cajero.component.css'
})
export class CajeroComponent
{
  private readonly _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    monto: ["0"],
    status: false
  });
  retiroMessage = "Ingrese el monto a retirar:";
  errorMessage = " ";
  successMessage = " ";
  denominationsMessage = " ";

  btnContinuar = false;
  btnTerminar = false;





  validar(isNumber: string)
  {
    const numberRegex = /^[0-9]+(\.)?(0|5)?(0)?$/;
    // console.log("validando");
    // console.log(isNumber);



    if (numberRegex.test(isNumber))
    {
      // console.log("si es valido");

      const tam = parseInt(isNumber || '0');
      // console.log(tam);


      if (tam > 1 || (isNumber == '00' && isNumber.length > 1))
      {
        this.formGroup.value.monto = this.formGroup.value.monto?.replace(/^0*/g, "");
      }
      return true;
    }
    return false;
  }


  addDigit(digit: string)
  {
    let tempMonto = this.formGroup.value.monto;
    // console.log("checando longitud");
    // console.log(tempMonto);
    // console.log(tempMonto?.length);
    if (tempMonto?.length == 0 && digit == '.')
    {
      tempMonto = '0' + tempMonto;
      this.formGroup.value.monto = '0';
    }

    if (this.validar(tempMonto + digit))
    {
      this.formGroup.value.monto += digit;

    }
    else
    {
      this.formGroup.value.monto = tempMonto;
    }
    this.updateInput();

  }

  deleteDigit()
  {
    // console.log("borrando");
    this.formGroup.value.monto = this.formGroup.value.monto?.slice(0, -1);
    this.updateInput();
  }

  updateInput()
  {
    this.formGroup.patchValue({
      monto: this.formGroup.value.monto
    });
  }

  inputNumber()
  {
    // console.log("input text");
    const ceros = /^(0)+$/;

    // console.log(this.formGroup.value.monto);


    if (!this.validar(this.formGroup.value.monto ?? ""))
    {
      // console.log("no cumple");

      this.deleteDigit();

    }
    if (ceros.test(this.formGroup.value.monto ?? '0'))
    {
      // console.log("si cumple");

      this.updateInput();
      this.formGroup.value.monto = '0';
      this.updateInput();
    }


  }

  terminar()
  {

    this.btnContinuar = false;
    this.btnTerminar = false;
    this.cancel();


  }

  cancel()
  {

    if (!this.btnContinuar)
    {
      this.successMessage = " ";
      this.retiroMessage = "Ingrese el monto a retirar:";
      this.denominationsMessage = " ";
      this.formGroup.patchValue({
        monto: "0"
      });
    }
  }


  dinero_inicial = [
    { "denominacion": 1000, "cantidad": 2, "tipo": "billete" },
    { "denominacion": 500, "cantidad": 5, "tipo": "billete" },
    { "denominacion": 200, "cantidad": 10, "tipo": "billete" },
    { "denominacion": 100, "cantidad": 20, "tipo": "billete" },
    { "denominacion": 50, "cantidad": 30, "tipo": "billete" },
    { "denominacion": 20, "cantidad": 40, "tipo": "billete" },
    { "denominacion": 10, "cantidad": 50, "tipo": "moneda" },
    { "denominacion": 5, "cantidad": 100, "tipo": "moneda" },
    { "denominacion": 2, "cantidad": 200, "tipo": "moneda" },
    { "denominacion": 1, "cantidad": 300, "tipo": "moneda" },
    { "denominacion": 0.5, "cantidad": 100, "tipo": "moneda" }
  ];

  montoDisponible = 12550;
  retirar()
  {

    // console.log("monto disponible:");
    // console.log(this.montoDisponible);

    // console.log("Monto a retirar");
    // console.log(this.formGroup.value.monto);
    const cantidadRetirar = Number(this.formGroup.value.monto);



    if (this.montoDisponible >= cantidadRetirar)
    {
      const mensaje = this.checarDenominaciones(cantidadRetirar);

      this.montoDisponible = this.montoDisponible - cantidadRetirar;

      this.successMessage = "Retire su dinero por favor";
      this.retiroMessage = " ";
      this.denominationsMessage = mensaje;
      this.btnContinuar = true;
      this.btnTerminar = true;
    }
    else
    {
      this.errorMessage = "No hay dinero suficiente, ingrese un monto diferente";
      setTimeout(() =>
      {
        this.errorMessage = " ";
      }, 2000);
    }

  }

  checarDenominaciones(cantidaRetiro: number): string
  {
    const denominaciones = [];
    // console.log("comenzando a retirar");
    // console.log(cantidaRetiro);

    for (const denomicacion in this.dinero_inicial)
    {
      if (Object.prototype.hasOwnProperty.call(this.dinero_inicial, denomicacion))
      {
        const element = this.dinero_inicial[denomicacion];
        // console.log(element);
        let f = 0;
        while (cantidaRetiro >= element.denominacion && element.cantidad > 0)
        {
          // console.log(cantidaRetiro + "-" + element.denominacion);
          f++;
          element.cantidad = element.cantidad - 1;
          cantidaRetiro = cantidaRetiro - element.denominacion;
          // console.log(cantidaRetiro);
        }
        const agregar =
        {
          denomicacion: element.denominacion,
          tipo: element.tipo, cantidad: f
        };
        if (f != 0)
        {
          denominaciones.push(agregar);
        }
      }
    }
    // console.log(denominaciones);
    // console.log(typeof (denominaciones));

    const mensaje = this.crearMensaje(denominaciones);
    return mensaje;
  }

  crearMensaje(array: any[]): string
  {
    let mensaje = "";

    // console.log(array.length);

    for (let index = 0; index < array.length; index++)
    {
      const element = array[index];
      // console.log(element);

      const denominacion = element.denomicacion;
      let tipo = element.tipo;
      const cantidad = element.cantidad;
      if (cantidad > 1)
      {
        tipo = tipo + "s";
      }

      mensaje += `${cantidad} ${tipo} de ${denominacion}<br/>`;
    }
    // console.log(mensaje);
    return mensaje;



  }

  recargar()
  {
    window.location.reload();
  }

}

