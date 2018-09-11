export function convertObjectToMap(object: {} | undefined): Map<string, {}> {
  const finalMap = new Map();

  if (object !== undefined) {
    Object.keys(object).forEach(key => {
      finalMap.set(key, object[key]);
    });
  }

  return finalMap;
}
