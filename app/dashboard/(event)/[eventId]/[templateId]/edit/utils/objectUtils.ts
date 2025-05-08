// editor/utils/objectUtils.ts (Creaza un fisier separat pentru utilitare generale)

/**
 * Immutably sets a nested property in an object using a dot-notation path.
 * Creates nested objects if they don't exist.
 * Returns a new object with the updated property.
 *
 * @param obj The original object (will not be mutated).
 * @param path The dot-notation path to the property (e.g., 'position.x', 'style.fontSize').
 * @param value The new value to set.
 * @returns An object containing:
 * - updatedObject: The new object with the updated property.
 * - success: Boolean indicating if the path was valid and the property was set.
 */
export const setNestedProperty = (
  obj: any,
  path: string,
  value: any
): { updatedObject: any; success: boolean } => {
  const keys = path.split('.');
  // Creează o copie profundă a obiectului pentru a menține imutabilitatea
  // ATENTIE: JSON.parse(JSON.stringify(obj)) functionează pentru obiecte simple (JSON-serializabile)
  // Daca stilurile sau alte date pot contine functii, Date objects, undefined etc.,
  // vei avea nevoie de o funcție de deep copy mai robustă (ex: din librariile ca lodash/cloneDeep sau o implementare custom)
  const updatedObject = JSON.parse(JSON.stringify(obj));

  let current = updatedObject;
  let pathValid = true;

  // Traversează calea, creând obiecte intermediare dacă nu există
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Verifică dacă nivelul curent este un obiect și nu null/undefined
    if (typeof current !== 'object' || current === null) {
      console.error(
        `setNestedProperty: Path "${path}" is not an object path at key "${key}". Cannot set property.`
      );
      pathValid = false;
      break; // Ieși din buclă dacă calea este invalidă
    }

    // Dacă cheia nu există la nivelul curent, creează un obiect gol
    if (
      !(key in current) ||
      current[key] === null ||
      typeof current[key] !== 'object'
    ) {
      current[key] = {}; // Presupunem că nivelurile intermediare sunt obiecte
    }

    current = current[key];
  }

  // Setează valoarea proprietății finale dacă calea a fost validă
  if (pathValid) {
    const finalKey = keys[keys.length - 1];
    current[finalKey] = value;
    return { updatedObject: updatedObject, success: true };
  } else {
    // Dacă calea nu a fost validă, returnează obiectul original și indică eșec
    return { updatedObject: obj, success: false };
  }
};
