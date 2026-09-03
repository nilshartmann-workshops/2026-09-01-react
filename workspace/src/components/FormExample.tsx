/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable react-hooks/set-state-in-effect
import { useEffect, useState } from "react";


function getFehlerMessage(vermoegen: number, anlageBetrag: number) {
  return vermoegen < anlageBetrag ? "Vermögen muss größer als der Anlagebetrag sein"
    : null;
}

// function useExample() {
//   const [firstname, setFirstname] = useState("...");
//
//   return firstname;
// }


// Hook Funktionen
// useState
// useCallback, useMemo
// useContext
// useEffect
// "Custom" Hook Funktion
// useSuspenseQuery
// useTabBarContext

export default function FormExample() {
  const [name, setName] = useState("");
  const [vermoegen, setVermoegen] = useState(1200);
  const [anlageBetrag, setAnlageBetrag] = useState(100);

  // const [fehler, setFehler] = useState<string|null>(null)

  // const fehler = vermoegen < anlageBetrag ? "Vermögen muss größer als der Anlagebetrag sein"
  //   : null;

  const fehler = getFehlerMessage(vermoegen, anlageBetrag);


  // const handleVermoegenChange = (newVermoegen: number) => {
  //   if (newVermoegen < anlageBetrag) {
  //     setFehler("Vermögen muss größer als der Anlagebetrag sein")
  //   } else {
  //     setFehler(null);
  //   }
  //   setVermoegen(newVermoegen)
  // }
  //
  // useEffect(() => {
  //   if (vermoegen < anlageBetrag) {
  //     setFehler("Vermögen muss größer als der Anlagebetrag sein")
  //   } else {
  //     setFehler(null);
  //   }
  // }, [vermoegen, anlageBetrag]);

  return (
    <form>
      <div className={"FormControl"}>
        <label>Dein Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className={"FormControl"}>
        <label>Vermögen</label>
        <input
          type={"number"}
          value={vermoegen} onChange={(e) => setVermoegen(parseInt(e.target.value))} />
      </div>

      <div className={"FormControl"}>
        <label>Anlagebetrag</label>
        <input
          type={"number"}
          value={anlageBetrag}
          onChange={(e) => setAnlageBetrag(parseInt(e.target.value))}
        />
      </div>

      <div className={"error-message"}>{fehler}</div>

      <div className={"FormButtons"}>
        <button
          type={"button"}
          className={"primary"}
        >
          Speichern
        </button>
      </div>
    </form>
  );
}
