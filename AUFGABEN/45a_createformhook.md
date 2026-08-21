# Nebenbei: der Blick in den Quelltext von createFormHook

Keine Übung, ein Angebot zum Weiterlesen.

Das ist `createFormHook` aus `node_modules`, nur zum Lesen etwas geglättet. Es ist kein einziges Konzept darin, das wir nicht selbst schon gebaut haben:

```tsx
function createFormHookContexts() {
  function useFieldContext() {
    const field = useContext(fieldContext);
    if (!field) { throw new Error("`fieldContext` only works when …"); }
    return field;
  }
  return { fieldContext, useFieldContext, useFormContext, formContext };
}

function createFormHook({ fieldComponents, fieldContext, … }) {
  function useAppForm(props) {
    const form = useForm(props);

    const AppField = useMemo(() => ({ children, ...props }) => (
      <form.Field {...props}>
        {(field) => (
          <fieldContext.Provider value={field}>
            {children(Object.assign(field, fieldComponents))}
          </fieldContext.Provider>
        )}
      </form.Field>
    ), [form]);

    return useMemo(() => Object.assign(form, { AppField, … }), [form, …]);
  }
}
```

Vier Dinge zum Wiedererkennen, der Reihe nach:

1. **`createContext(null)` und ein Hook, der bei `null` einen Fehler wirft.**
   Genau das Paar, das wir für die `TabBar` von Hand geschrieben haben; unseres
   hieß `useTabBarContext`. Dass es hier aus einer *Funktion* herausfällt, hat
   einen Grund: Eine Bibliothek kennt die Komponenten ihrer Anwender nicht und
   muss das Paar deshalb zur Laufzeit herstellen.
2. **`Object.assign(field, fieldComponents)`** hängt die registrierten
   Komponenten an das `field`-Objekt. Deshalb kannst du `field.TextField`
   schreiben, obwohl `field` ein Feld ist und keine Komponentensammlung.
3. **`children(…)`**, also eine Funktion als children. Die Bibliothek weiß nicht,
   was wir rendern wollen, also fragt sie uns.
4. **`useMemo(…, [form])` um `AppField` herum.** Ohne das wäre `AppField` bei
   jedem Render eine *neue* Funktion, also für React ein anderer
   Komponententyp. Er würde das Feld nicht neu rendern, sondern wegwerfen und
   neu aufbauen, und die Eingabe wäre bei jedem Tastendruck weg. Dasselbe Prinzip
   wie beim Dependency-Array eines Effekts, nur mit einer weit unangenehmeren
   Folge.

Die Pointe zum Mitnehmen: Wer diese vier Dinge kann, kann so eine Bibliothek lesen. Das ist kein Framework-Wissen, das sind React-Bausteine.
