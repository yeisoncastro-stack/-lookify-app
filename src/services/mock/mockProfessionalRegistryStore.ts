import { EstadoSolicitudProfesional, OnboardingPaso } from '../../types/professionalAuth';
import { TipoDocumentoId } from '../../utils/validators';
import { MOCK_PROFESSIONAL_ACCOUNTS } from './mockProfessionalAccounts';

export interface RegisteredProfessionalRecord {
  profesionalId: string;
  solicitudId: string;
  email: string;
  password: string;
  nombre: string;
  tipoDocumento: TipoDocumentoId;
  numeroDocumento: string;
  estadoSolicitud: EstadoSolicitudProfesional;
  onboardingPaso?: OnboardingPaso;
  verificado: boolean;
  estadoOperativo: 'OCUPADO' | 'DISPONIBLE';
}

const registeredByEmail = new Map<string, RegisteredProfessionalRecord>();
const registeredByDocument = new Map<string, RegisteredProfessionalRecord>();
const registeredBySolicitudId = new Map<string, RegisteredProfessionalRecord>();

const serviciosBySolicitudId = new Map<string, string[]>();
const onboardingPasoBySolicitudId = new Map<string, OnboardingPaso>();
const estadoSolicitudBySolicitudId = new Map<string, EstadoSolicitudProfesional>();

/** Demo pro.docs-certificados: servicios sembrados en mapa (no se mutan cuentas semilla). */
export const SOLICITUD_DEMO_DOCS_CERTIFICADOS = 'sol-demo-docs-certificados';
const SERVICIOS_DEMO_DOCS_CERTIFICADOS: string[] = ['pel-1', 'bar-2', 'una-1'];

const seedSolicitudIds = new Set<string>(
  MOCK_PROFESSIONAL_ACCOUNTS.map((a) => a.solicitudId)
);

if (!serviciosBySolicitudId.has(SOLICITUD_DEMO_DOCS_CERTIFICADOS)) {
  serviciosBySolicitudId.set(SOLICITUD_DEMO_DOCS_CERTIFICADOS, [...SERVICIOS_DEMO_DOCS_CERTIFICADOS]);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function documentKey(tipo: TipoDocumentoId, numero: string): string {
  return `${tipo}:${numero.trim()}`;
}

export function findRegisteredByEmail(email: string): RegisteredProfessionalRecord | undefined {
  return registeredByEmail.get(normalizeEmail(email));
}

export function isDocumentRegistered(tipo: TipoDocumentoId, numero: string): boolean {
  return registeredByDocument.has(documentKey(tipo, numero));
}

export function registerProfessionalRecord(record: RegisteredProfessionalRecord): void {
  const emailKey = normalizeEmail(record.email);
  registeredByEmail.set(emailKey, record);
  registeredByDocument.set(documentKey(record.tipoDocumento, record.numeroDocumento), record);
  registeredBySolicitudId.set(record.solicitudId, record);
  if (record.onboardingPaso !== undefined) {
    onboardingPasoBySolicitudId.set(record.solicitudId, record.onboardingPaso);
  }
}

export function solicitudExiste(solicitudId: string): boolean {
  if (registeredBySolicitudId.has(solicitudId)) return true;
  return seedSolicitudIds.has(solicitudId);
}

export function getOnboardingPasoForSolicitud(solicitudId: string): OnboardingPaso | undefined {
  const override = onboardingPasoBySolicitudId.get(solicitudId);
  if (override !== undefined) return override;
  const registered = registeredBySolicitudId.get(solicitudId);
  if (registered?.onboardingPaso !== undefined) return registered.onboardingPaso;
  const seed = MOCK_PROFESSIONAL_ACCOUNTS.find((a) => a.solicitudId === solicitudId);
  return seed?.onboardingPaso;
}

export function setServiciosForSolicitud(solicitudId: string, servicioIds: string[]): void {
  serviciosBySolicitudId.set(solicitudId, [...servicioIds]);
}

export function getServiciosForSolicitud(solicitudId: string): string[] | undefined {
  const stored = serviciosBySolicitudId.get(solicitudId);
  if (stored !== undefined) return [...stored];
  return undefined;
}

export function getEstadoSolicitudForSolicitud(
  solicitudId: string
): EstadoSolicitudProfesional | undefined {
  const override = estadoSolicitudBySolicitudId.get(solicitudId);
  if (override !== undefined) return override;
  const registered = registeredBySolicitudId.get(solicitudId);
  if (registered) return registered.estadoSolicitud;
  const seed = MOCK_PROFESSIONAL_ACCOUNTS.find((a) => a.solicitudId === solicitudId);
  return seed?.estadoSolicitud;
}

export function setEstadoSolicitudForSolicitud(
  solicitudId: string,
  estado: EstadoSolicitudProfesional
): void {
  estadoSolicitudBySolicitudId.set(solicitudId, estado);
}

export function getProfesionalBasicoBySolicitudId(solicitudId: string):
  | { profesionalId: string; nombre: string; email: string }
  | undefined {
  const registered = registeredBySolicitudId.get(solicitudId);
  if (registered) {
    return {
      profesionalId: registered.profesionalId,
      nombre: registered.nombre,
      email: registered.email,
    };
  }
  const seed = MOCK_PROFESSIONAL_ACCOUNTS.find((a) => a.solicitudId === solicitudId);
  if (!seed) return undefined;
  return {
    profesionalId: seed.profesionalId,
    nombre: seed.nombre,
    email: seed.email,
  };
}

export function setOnboardingPasoForSolicitud(solicitudId: string, paso: OnboardingPaso): void {
  onboardingPasoBySolicitudId.set(solicitudId, paso);
  const registered = registeredBySolicitudId.get(solicitudId);
  if (registered) {
    registeredBySolicitudId.set(solicitudId, { ...registered, onboardingPaso: paso });
  }
}
