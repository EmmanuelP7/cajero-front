
export async function post(datos: any): Promise<any>
{

  try
  {
    const response = await fetch('http://localhost:8087/operaciones/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });


    console.log(response);

    const data = await response.json();
    console.log('Datos recibidos:', data);

    if (response.ok)
    {
      const numeroOperacion = data.id;
      const messageResponse = "Retiro exitoso";

      const finalResponse = {
        messageResponse: messageResponse,
        numeroOperacion: numeroOperacion
      };
      return finalResponse;

    }
    if (response.status == 400 && data.messageResponse != null)
    {
      const finalResponse = {
        messageResponse: data.messageResponse,
        numeroOperacion: ""

      };
      return finalResponse;
    }

    throw new Error(`HTTP error! status: ${response.status}`);

    // alert(messageResponse);

  } catch (error)
  {
    // console.error('Error en la solicitud:', error);
    // alert("El usuario ya se encuentra registrado");

    const finalResponse = {
      messageResponse: "Error al conectar",
      numeroOperacion: "Sin  conexion - No registrado"
    };
    return finalResponse;

  }


}
