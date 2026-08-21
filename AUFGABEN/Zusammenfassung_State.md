# Zusammenfassung: Welcher Zustand gehört wohin?

Keine Übung, sondern eine Runde am Whiteboard. Diese Datei ist die Mitschrift dazu und zum Nachschlagen gedacht.

## Was wir bisher gebaut haben

| Wo | Womit | Beispiel bei uns |
|---|---|---|
| in **einer** Komponente | `useState` | Text im Eingabefeld, Zähler auf der Spielwiese |
| in einem **Teilbaum** | Context | aktiver Tab in der `TabBar` |
| **global** | Zustand-Store | die Favoriten |
| auf dem **Server** | als Nächstes: Apollo | die Pflanzen selbst |
| in der **URL** | Router | haben wir nicht |
| im **Browser** | Cookies, Local/Session Storage | haben wir nicht |

Der Weg dahin war jedes Mal derselbe: erst das Problem (Prop Drilling,
unnötige Renderings), dann das Werkzeug. Nicht andersherum.

## Die Reihenfolge, in der man wählen sollte

1. **Lokal** (`useState`), solange es geht. Der Zustand steht da, wo er
   benutzt wird, und verschwindet mit der Komponente.
2. **Hochziehen** ("lifting state up"), wenn zwei Geschwister denselben Wert
   brauchen. Erst mal per Property durchreichen; über ein, zwei Ebenen ist das
   völlig in Ordnung.
3. **Context**, wenn viele, weit verstreute Stellen denselben Wert brauchen
   (Theme, Sprache, angemeldeter Benutzer, Zustand einer zusammengesetzten
   Komponente). Nicht vergessen: Context transportiert nur, er verwaltet nicht.
   - Zwei Fälle sind unproblematisch: ein Wert, der sich **selten** ändert
     (Theme, Sprache), und ein Wert, an dem **wenige** Komponenten hängen
     (unsere `TabBar`). Beides ist gängige Praxis.
   - Unangenehm ist nur die Kombination: ändert sich ständig **und** wird
     überall gelesen. Dann rendert bei jeder Änderung der ganze Teilbaum mit,
     und dagegen hilft weder `memo` noch `useMemo`.
4. **Store** (Zustand & Co.), wenn es wirklich global ist *und* Renderings
   gezielt gesteuert werden müssen (Selektoren). Also genau für das Feld, in
   dem Context aufgibt.
5. **Server** für alles, was länger leben soll als der Tab.

## Persistenz: Was überlebt was?

| | Reload (F5) | zweiter Tab | anderes Gerät |
|---|---|---|---|
| `useState` / Context | ✗ | ✗ | ✗ |
| Zustand-Store | ✗ | ✗ | ✗ |
| URL | ✓ | ✓ (wenn man sie kopiert) | ✓ (wenn man sie verschickt) |
| Cookie / Local Storage | ✓ | ✓ | ✗ |
| Server | ✓ | ✓ | ✓ |

Der Satz dazu: **Nur serverseitiger Zustand ist verlässlich dauerhaft.** Alles
andere ist eine Kopie auf Zeit.

Zur URL nur so viel: Wer einen Router einsetzt, hat in der Adresszeile einen Zustands-Container, den viele übersehen (Suchbegriff, Filter, Seitenzahl, offener Dialog). Das Schöne daran: Er ist teilbar und der Zurück-Button funktioniert. Wir haben in diesem Workshop keinen Router, deshalb bleibt es bei der Erwähnung.

## Am Whiteboard einsortieren

Wo würdet ihr das jeweils hinlegen, und warum?

- der aktive Tab
- die Favoriten
- Sortier- und Filterkriterien einer Liste
- der Suchbegriff in einem Suchfeld
- Theme (hell/dunkel), Sprache, Zeitzone
- die Pflanzen selbst
- "Formular wurde gerade erfolgreich abgeschickt"

Für die Favoriten lohnt sich die Nachfrage: Wir haben sie in einen Store gelegt, weil es hier um State-Management ging. In einer echten Anwendung wären sie vermutlich Server-Zustand, denn Favoriten sollen auch nach dem Schließen des Browsers und auf dem Handy noch da sein.

## Brücke zum nächsten Teil

Serverseitiger Zustand ist die größte und am häufigsten falsch behandelte Kategorie. Der Reflex ist, ihn in eine der oberen Zeilen zu kopieren: Daten mit `useEffect` laden, in `useState` legen, per Context verteilen. Ab da hat man zwei Wahrheiten, die auseinanderlaufen können. Wann wird nachgeladen? Was passiert bei einem Fehler? Wer weiß, dass die Daten veraltet sind?

Genau diese Fragen übernimmt als Nächstes Apollo. Der Zustand bleibt dann da, wo er hingehört: auf dem Server. Im Client liegt nur noch ein Cache, und der weiß, dass er einer ist.
