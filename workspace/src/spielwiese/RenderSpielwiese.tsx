import { useCallback, useMemo, useState } from "react";

import {Child} from "./Child.tsx";
import MemoChild from "./MemoChild.tsx";
import { produce } from "immer";

/**
 * Spielwiese zum Rendern
 *
 * Hier probieren wir Dinge aus, die nichts mit unserer Pflanzen-App zu tun
 * haben. Die Frage dieser Spielwiese: Wann rendert eigentlich welche
 * Komponente?
 *
 * Sie bekommt einen eigenen Tab und stört den Rest der Anwendung nicht. Sie
 * hat zwei States, die nichts miteinander zu tun haben: einen Zähler und einen
 * Text. Der Text wird nirgends verwendet, er ist nur da, damit wir ein Rendern
 * auslösen können, das die Kinder gar nichts angeht.
 *
 * ⚠️ Diese Datei ist fertig, du musst hier nichts implementieren. Wir schauen
 *    sie uns später gemeinsam an.
 */

type RenderSpielwieseProps = {
  allTags?: string[]
}

type Person = {
  firstname: string;
  lastname: string;
}

// // Team A
// function createPerson(): Person {
//   return {
//     firstname: "Klaus",
//     lastname: "Müller"
//   }
// }
//
// // Team B
// const p: Person = createPerson();

export default function RenderSpielwiese(props: RenderSpielwieseProps) {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState("Abc");
  const [person, setPerson] = useState<Person>({
        firstname: "Klaus",
    lastname: "Müller"
  })

  function onFirstnameChange(newFirstname: string) {
    // GEHT NICHT, VERBOTEN!
    // person.firstname = newFirstname;
    // setPerson(person);

    // Variante 1: "Manuelles" neuanlegen
    // setPerson({
    //   firstname: newFirstname,
    //   lastname: person.lastname
    // })

    // Variante 2: Spread-Operator ...
    setPerson({
      ...person,
      firstname: newFirstname
    })

    // Variante 3: immer-Bibliothek
    // const newPerson = produce(person, draftPerson => {
    //   draftPerson.firstname = newFirstname;
    //   draftPerson.city.plz = "97079"
    // });
    // setPerson(newPerson);





  }




  const a = 42;

  const tags = props.allTags !== undefined ? props.allTags : []
  // function handleCounterClick() {
  //   setCounter(0)
  // }


  const handleCounterClick = useCallback(
    function handleCounterClick() {
      setCounter(0)
      console.log(text);
    },
    [text]
  )



  return (
    <div className={"space-y-4"}>
      <button className={"primary"} onClick={() => setCounter(counter + 1)}>
        Zähler erhöhen (aktuell: {counter})
      </button>

      <div className={"FormControl"}>
        <label>Ein Textfeld (der Text wird sonst nirgends benutzt)</label>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className={"flex gap-x-4"}>
        <Child tags={tags} name={"Kind A"} value={counter} onCounterClick={handleCounterClick}/>
        <Child tags={tags} name={"Kind B"} value={a} onCounterClick={handleCounterClick}/>
      </div>
    </div>
  );
}
