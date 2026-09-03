/**
 * Künstliche Verzögerung einzelner GraphQL-Operationen.
 *
 * Damit können wir im Workshop so tun, als wäre das Backend langsam.
 *
 * Der Schlüssel ist der **Name der Operation**, also z.B. bei
 *
 *     query GetPlants { ... }
 *
 * der Name `GetPlants`. Schreibt man ihn falsch, passiert einfach nichts.
 *
 * Der Wert ist die Wartezeit in Millisekunden (0 = keine Verzögerung).
 *
 * In einer echten Anwendung gibt es so etwas natürlich nicht 🙂
 */
export const delayConfig: Record<string, number> = {
  GetPlants: 2400,
  CreatePlant: 0,
};
