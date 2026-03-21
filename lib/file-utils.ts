// lib/file-utils.ts

// Tamaño máximo en bytes (4.5 MB)
export const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

// Tipos de archivo permitidos
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

// Extensiones permitidas para mostrar al usuario
export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

// Función para validar tamaño
export function validateFileSize(file: File): { valid: boolean; message?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `El archivo "${file.name}" es demasiado grande. Tamaño máximo: 4.5 MB. Tu archivo: ${(file.size / (1024 * 1024)).toFixed(2)} MB`
    };
  }
  return { valid: true };
}

// Función para validar tipo
export function validateFileType(file: File): { valid: boolean; message?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: `El archivo "${file.name}" no es un tipo válido. Formatos permitidos: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }
  return { valid: true };
}

// Función para validar archivo completo
export function validateFile(file: File): { valid: boolean; message?: string } {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) return sizeValidation;
  
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) return typeValidation;
  
  return { valid: true };
}

// Formatear tamaño para mostrar
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}