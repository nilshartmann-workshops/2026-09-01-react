/* eslint-disable react-hooks/refs --
 * Der Linter hat recht, und trotzdem schalten wir ihn hier ab. Die Regel
 * `react-hooks/refs` verbietet, ein Ref *während des Renderns* zu lesen oder
 * zu verändern, und genau das tut unser Render-Zähler unten. In normalem Code
 * ist das ein Fehler: React darf eine Komponente rendern, ohne das Ergebnis
 * anzuzeigen, dann stimmt der Zähler nicht mehr. Hier wollen wir aber gerade
 * jeden einzelnen Render sehen. Deshalb die Ausnahme, und deshalb nur für
 * diese eine Datei.
 */
import { memo, useRef } from "react";

type ChildProps = {
  name: string;
  value: number;
  tags: string[]
  onCounterClick: () => void
};

const Child = memo(function Child({ name, value, onCounterClick, tags }: ChildProps) {
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`${name} rendert (${renderCount.current}. Mal), value=${value}`);

  return (
    <div className={"space-y-2 rounded-lg bg-white p-4 shadow-md"}>
      <h3 className={"font-semibold"}>{name}</h3>
      <div>Tags: {tags.length}</div>
      <div className={"text-sm text-gray-600"}>value: {value}</div>
      <div className={"RenderCounter"}>{renderCount.current}× gerendert</div>
      <button className={"primary"} onClick={() => onCounterClick()}>Reset!</button>
    </div>
  );
})

export {Child}
