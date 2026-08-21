# Rendern und Virtual DOM

**Keine Übung**, das schauen wir uns gemeinsam an. Diese Datei ist die Mitschrift dazu; nachspielen kannst du alles jederzeit selbst, es ist ja schon alles da.

## Dateien

- `src/components/App.tsx` (bekommt einen Tab dazu)

Angeschaut werden:

- `src/spielwiese/RenderSpielwiese.tsx` (ein Elternteil mit zwei States)
- `src/spielwiese/Child.tsx` (ein Kind, das mitzählt, wie oft es gerendert wird)
- `src/spielwiese/MemoChild.tsx` (dasselbe Kind, aber in `memo()` eingepackt)

## Vorbereitung

- Installiere die **React Developer Tools** in deinem Browser, falls du sie noch
  nicht hast (Link unten unter "Material").
- Öffne die Browser-Konsole und lass sie geöffnet.

## Aufgabe

Ein mentales Modell davon aufbauen, was beim Rendern eigentlich passiert: Die Funktion einer Komponente läuft erneut, React vergleicht das Ergebnis mit dem vorherigen, und nur der Unterschied landet im echten DOM des Browsers. Der erste Teil ist billig, der zweite teuer, und diese beiden Dinge auseinanderzuhalten ist die halbe Miete.

Danach die Anschlussfrage: Kann man ein einzelnes Kind vom Mitrendern ausnehmen? Ja, das geht, man braucht es nur viel seltener, als man denkt.

## Teil 1: Was beim Rendern passiert

1. Zuerst geben wir der Spielwiese einen Platz in der Anwendung. Sie hat nichts
   mit Pflanzenpflege zu tun, deshalb bekommt sie einen eigenen Reiter.
   - In `src/components/App.tsx` ein drittes `Tab` mit der Beschriftung
     "Rendern (Spielwiese)" und das passende `Panel` dazu, genau wie bei den
     beiden davor und mit einer eigenen `tabId`.
   - Ins Panel kommt die `RenderSpielwiese` (Default-Export aus
     `src/spielwiese/RenderSpielwiese.tsx`). Die Dateien liegen fertig im
     Projekt.
2. Wir lesen `RenderSpielwiese.tsx` und `Child.tsx` durch. Drei Dinge lohnen
   einen zweiten Blick:
   - Die `RenderSpielwiese` hat zwei States, einen Zähler und einen Text. Der **Text wird nirgends verwendet**, er ist nur da, damit wir ein Rendern auslösen können, das die Kinder gar nichts angeht.
   - `Child` zählt mit, wie oft es gerendert wurde, und schreibt das zusätzlich
     auf die Konsole. Der Zähler steckt in einem `useRef` und nicht in einem
     `useState`: Ein Ref überlebt das Rendern, aber es zu ändern löst **kein**
     neues Rendern aus. Mit `useState` wäre das hier eine Endlosschleife.
   - Ganz oben in `Child.tsx` steht ein `/* eslint-disable react-hooks/refs */`. Die Regel verbietet zu Recht, was wir hier tun, denn Refs während des Renderns zu lesen oder zu verändern ist normalerweise ein Fehler. Für einen Render-Zähler ist es genau das, was wir wollen.
3. Dann beobachten wir. Auf die Render-Zähler **und** auf die Konsole schauen:
   - Klick auf den Zähler-Button: Welche Komponenten rendern? (Beide `Child`, auch "Kind B", dessen `value` fest verdrahtet ist.)
   - Etwas ins Textfeld tippen: Welche Komponenten rendern? Der Text wird doch
     nirgends benutzt.
   - Auf einen anderen Tab wechseln und zurück: Was zeigen die Render-Zähler
     jetzt an? Warum fangen sie wieder bei 1 an?
4. In den React Developer Tools schalten wir unter ⚙️ die Option **"Highlight
   updates when components render"** ein und machen dasselbe noch einmal. Jetzt
   ist direkt im Browser zu sehen, was rendert.
5. Und jetzt der entscheidende Unterschied: Wir wechseln in den
   **Elements**-Tab, stellen ihn auf die Spielwiese ein und klicken mehrfach auf
   den Zähler-Button.
   - Der Browser markiert kurz, was sich im DOM geändert hat.
   - Beide Kinder haben gerendert. Wird deshalb auch beide Male das `div` neu gebaut? Oder blinkt nur der eine Textknoten mit der Zahl?

## Teil 2: Ein Kind vom Rendern ausnehmen

6. Das dritte Kind auf der Spielwiese heißt **Memo-Kind** und sieht fast aus wie
   die anderen. Der Unterschied steht ganz unten in `MemoChild.tsx`: Beim Export
   ist die Komponente in `memo(...)` eingepackt.
   - Tipp im Textfeld, klick auf den Zähler: Die beiden `Child` zählen hoch, das
     **Memo-Kind nicht**. 🎉
   - Was `memo` macht: Bevor React die Komponente rendert, vergleicht es die
     neuen Properties mit den alten. Sind alle gleich, bleibt das Ergebnis vom
     letzten Mal stehen.
7. 🧐 Und damit die Frage, die wichtiger ist als das Werkzeug: Wir haben hier
   ein zusätzliches Konzept im Code, damit eine Komponente nicht rendert, deren
   Rendern ungefähr nichts kostet.
   - Hat sich das gelohnt? Woran würdest du festmachen, ob es sich lohnt?
   - Und wie viele Stellen in einer normalen Anwendung fallen dir ein, an denen
     das Rendern wirklich teuer ist?
   - Die Bedingungen, unter denen `memo` überhaupt etwas bewirkt, stehen unten im Hintergrund. Es sind mehr, als man denkt, und eine davon wird uns später in unserer eigenen Anwendung begegnen.

## Material

- React Developer Tools:
  https://react.dev/learn/react-developer-tools
- Render und Commit, also was React beim Rendern tut:
  https://react.dev/learn/render-and-commit
- `useRef`: https://react.dev/reference/react/useRef
- `memo`: https://react.dev/reference/react/memo
  - insbesondere "Should you add memo everywhere?":
    https://react.dev/reference/react/memo#should-you-add-memo-everywhere

## Hintergrund: Was ist eigentlich ein "Render"?

Wenn React eine Komponente rendert, ruft es schlicht **die Funktion noch einmal auf**. Heraus kommt eine Beschreibung dessen, was auf dem Bildschirm stehen soll: eine Baumstruktur aus einfachen JavaScript-Objekten. Diese Beschreibung nennt man den **Virtual DOM**.

React vergleicht die neue Beschreibung mit der vorherigen und ändert im echten DOM des Browsers nur das, was tatsächlich anders ist. Deshalb rendern beim Klick auf den Zähler-Button beide Kinder (React ruft ihre Funktionen auf), aber im DOM ändert sich nur eine einzige Zahl.

Zwei Sätze, die man auseinanderhalten sollte:

- **"Eine Komponente rendert"** heißt: Ihre Funktion läuft erneut. Das ist
  normalerweise billig.
- **"Das DOM wird aktualisiert"** heißt: Der Browser muss Layout und Anzeige neu
  berechnen. Das ist teuer.

React rendert eine Komponente immer dann neu, wenn sich ihr eigener State ändert, **und alle Komponenten darunter gleich mit**, ganz unabhängig davon, ob sich deren Properties geändert haben. Das ist Absicht und meistens völlig in Ordnung.

## Hintergrund: Wann `memo` überhaupt etwas bringt

`memo` hilft nur, wenn **alle drei** Bedingungen erfüllt sind:

1. Der Elternteil rendert neu **und** erzeugt dabei ein neues Element für dieses
   Kind. Rendert der Elternteil gar nicht, überspringt React das Kind ohnehin, und dann braucht es kein `memo`. Auf der Spielwiese ist die Bedingung erfüllt, weil dort ein State im Elternteil liegt, den wir ständig ändern.
2. Die Properties sind wirklich unverändert, und zwar im Sinne von `===`. Eine
   Inline-Funktion oder ein Objekt- oder Array-Literal als Property macht `memo`
   auf der Stelle wirkungslos, auch wenn inhaltlich dasselbe drinsteht. In
   `RenderSpielwiese.tsx` stehen genau deshalb zwei Zeilenpaare mit einer
   auskommentierten Gegenprobe; warum das so ist, sehen wir uns später an.
3. Die Komponente bezieht ihre Daten über **Properties**. Es gibt einen zweiten
   Weg, auf dem Daten in eine Komponente kommen, und der geht an `memo` vorbei.
   Auch dazu später mehr.

In einer typischen Anwendung ist schon Bedingung 1 seltener erfüllt, als man denkt. Deshalb steht `memo` in vielen Projekten an Stellen, an denen es nichts tut außer Rechenzeit zu kosten.

## Hintergrund: Wann optimiert man, und wann nicht?

**React ist meistens schnell genug**, denn ein Render ist ein Funktionsaufruf. Teuer wird es erst, wenn sehr viele Komponenten gleichzeitig rendern oder eine einzelne Komponente wirklich rechnet. **Optimier deshalb nicht auf Vorrat**: `memo` macht den Code umständlicher, und es kostet selbst etwas, weil React sich die alten Properties merken und bei jedem Render vergleichen muss. **Erst messen, dann optimieren** ist die Reihenfolge, und messen kannst du mit dem Profiler in den React DevTools.

Und wenn dich jemand fragt: Ja, es gibt inzwischen einen **React Compiler**, der diese Memoisierung automatisch einbaut, sodass man sie meistens gar nicht mehr von Hand schreiben muss. Der ist hier nicht Thema, aber es lohnt sich, ihn im Blick zu behalten.
