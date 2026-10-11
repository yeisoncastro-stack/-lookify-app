export type ServiceErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_DUPLICATE'
  | 'DOCUMENTO_DUPLICADO'
  | 'SERVICIO_INVALIDO'
  | 'SOLICITUD_NO_ENCONTRADA'
  | 'ARCHIVO_INVALIDO'
  | 'ARCHIVO_MUY_GRANDE'
  | 'SERVICIO_SIN_CERTIFICADO'
  | 'LIMITE_CERTIFICADOS_SERVICIO'
  | 'CERTIFICADO_NO_ENCONTRADO'
  | 'VALIDATION'
  | 'NETWORK'
  | 'UNKNOWN';

export class ServiceError extends Error {
  readonly code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'ServiceError';
    this.code = code;
  }
}
