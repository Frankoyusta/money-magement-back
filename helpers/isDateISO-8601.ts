export const isValidIsoDateTime = (value: any, { req, location, path }: any): boolean => {
    console.log(value)
    // 1. Valida el formato de texto estricto YYYY-MM-DDTHH:mm:ssZ
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (!isoRegex.test(value)) return false;

    // 2. Valida que los números correspondan a una fecha real (ej: evita 31 de febrero)
    const date = new Date(value);
    return !isNaN(date.getTime());
}
