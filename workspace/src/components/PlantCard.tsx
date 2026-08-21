import { selectIsFavorite, useFavoritesStore } from "./useFavoritesStore.ts";

type PlantCardProps = {
  id: string;
  name: string;
  location: string;
  wateringInterval: number;
  lastWatered?: string;
};

export default function PlantCard({
  id,
  name,
  location,
  wateringInterval,
  lastWatered,
}: PlantCardProps) {
  // 💬 Erzählen: zwei Selektoren statt einem Store-Zugriff
  const isFavorite = useFavoritesStore(selectIsFavorite(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const wateringInfo =
    wateringInterval === 1
      ? "Jeden Tag gießen!"
      : `Alle ${wateringInterval} Tage gießen`;

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>{name}</h2>
        <div>📍{location}</div>
        <button onClick={() => toggleFavorite(id)}>
          {isFavorite ? "💚 Favorit" : "🤍 Favorit"}
        </button>
      </header>
      <section>
        <div>{wateringInfo}</div>
        {lastWatered ? <div>Zuletzt: {lastWatered}</div> : null}
      </section>
    </div>
  );
}
