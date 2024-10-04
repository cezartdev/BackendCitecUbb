// Definir una interfaz para el objeto de detalles
interface ErrorDetails {
  type: string;
  value: string;
  msg: string;
  path:string;
  location:string;
}

class KeepFormatError extends Error {
  details: ErrorDetails[];
  code: number;

  constructor(details: ErrorDetails[], code: number = 500) {
    // Llama al constructor de la clase Error con el mensaje
    super("Error para mantener el formato");

    // Establece el nombre del error personalizado
    this.name = 'KeepFormatError';

    // Asigna los detalles personalizados
    this.details = details;
    this.code = code;
    // Captura el stack trace (rastro del error)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KeepFormatError);
    }
  }
}

export default KeepFormatError;


