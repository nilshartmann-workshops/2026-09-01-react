import { useCallback, useMemo, useState } from "react";

import {Child} from "./Child.tsx";
import MemoChild from "./MemoChild.tsx";

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
export default function RenderSpielwiese(props: RenderSpielwieseProps) {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState("Abc");

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
