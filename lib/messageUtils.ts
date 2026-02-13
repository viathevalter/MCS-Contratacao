
export const applyTemplate = (templateText: string, context: Record<string, string>): string => {
  let result = templateText;
  
  Object.keys(context).forEach(key => {
    const value = context[key] || '';
    // Replace {key} globally
    const regex = new RegExp(`{${key}}`, 'gi');
    result = result.replace(regex, value);
  });

  return result;
};

export const getContextFromEntity = (entity: any, type: 'candidate' | 'worker'): Record<string, string> => {
  if (type === 'candidate') {
    return {
      nombre: entity.raw_name,
      telefono: entity.raw_phone,
      email: entity.raw_email || '',
      ubicacion: entity.raw_payload.location,
      profesion: entity.raw_payload.offer,
      id: entity.id
    };
  } else {
    return {
      nombre: entity.full_name,
      telefono: entity.phone,
      email: entity.email || '',
      ubicacion: entity.location,
      profesion: entity.profession_primary,
      codigo: entity.worker_code,
      id: entity.id
    };
  }
};
