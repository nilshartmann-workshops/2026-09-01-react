import { z } from "zod";

// 💬 Erzählen: Regeln und Typ an *einer* Stelle. Typ und Schema dürfen gleich
//    heißen, TypeScript verwaltet Typen und Werte getrennt.
export const PlantFormState = z.object({
  name: z.string().nonempty("Bitte gib den Namen deiner Pflanze ein"),
  location: z.string().nonempty("Bitte wähle den Standort deiner Pflanze aus"),
  wateringInterval: z
    .number("Bitte gib an, wie häufig die Pflanze gegossen werden muss")
    .min(1, "Bitte gib die Anzahl in Tagen ein, mindestens jeden Tag"),
  lastWatered: z.iso.date("Bitte gib ein gültiges Datum ein").optional(),
});
export type PlantFormState = z.infer<typeof PlantFormState>;
