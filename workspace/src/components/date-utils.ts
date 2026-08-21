/**
 * Berechnet, in wie vielen Tagen die Pflanze das nächste Mal gegossen werden
 * muss. Ein Wert kleiner oder gleich 0 heißt, dass sie überfällig ist.
 *
 * `lastWatered` muss im Format "YYYY-MM-DD" vorliegen.
 */
export function getDaysUntilWatering(
  lastWatered: string,
  wateringInterval: number,
) {
  const nextWatering = new Date(
    new Date(lastWatered).getTime() +
      (wateringInterval - 1) * 24 * 60 * 60 * 1000,
  );
  const today = new Date();
  const diffTime = nextWatering.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
