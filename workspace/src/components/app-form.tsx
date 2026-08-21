/* eslint-disable react-refresh/only-export-components --
 * Contexts, Feld-Komponenten und der Hook stehen hier zusammen in einer Datei.
 * In einem echten Projekt lägen die Feld-Komponenten in eigenen Dateien, und
 * dann gäbe es die Warnung nicht.
 */
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import IntervalSelector from "./IntervalSelector.tsx";

// 💬 Erzählen: createContext plus ein Hook, der einen Fehler wirft, genau das
//    Paar, das wir für die TabBar von Hand gebaut haben
const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

type FormError = { message: string } | undefined;

function ErrorMessage({ errors }: { errors: FormError[] }) {
  const error = errors[0];

  if (!error) {
    return null;
  }

  return <span className={"error-message"}>{error.message}</span>;
}

// 💬 Erzählen: kein `field` als Property mehr, es kommt aus dem Context. Der
//    Typparameter sagt, welchen Werttyp diese Komponente erwartet.
function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <div className={"FormControl"}>
      <label>{label}</label>
      <input
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={field.state.meta.errors.length > 0 ? "error" : undefined}
      />
      <ErrorMessage errors={field.state.meta.errors} />
    </div>
  );
}

function SelectField({
  label,
  placeholder,
  options,
}: {
  label: string;
  placeholder: string;
  options: string[];
}) {
  const field = useFieldContext<string>();

  return (
    <div className={"FormControl"}>
      <label>{label}</label>
      <select
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={field.state.meta.errors.length > 0 ? "error" : undefined}
      >
        <option value={""}>{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ErrorMessage errors={field.state.meta.errors} />
    </div>
  );
}

function DateField({ label }: { label: string }) {
  const field = useFieldContext<string | undefined>();

  return (
    <div className={"FormControl"}>
      <label>{label}</label>
      <input
        type={"date"}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) =>
          field.handleChange(e.target.value === "" ? undefined : e.target.value)
        }
        className={field.state.meta.errors.length > 0 ? "error" : undefined}
      />
      <ErrorMessage errors={field.state.meta.errors} />
    </div>
  );
}

function IntervalField() {
  const field = useFieldContext<number>();

  return (
    <div className={"FormControl"}>
      <IntervalSelector
        interval={field.state.value}
        onIntervalChange={field.handleChange}
        error={field.state.meta.errors.length > 0}
      />
      <ErrorMessage errors={field.state.meta.errors} />
    </div>
  );
}

// 💬 Erzählen: einmal registrieren, heraus kommt useAppForm. `withForm`
//    brauchen wir gleich noch nicht.
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, SelectField, DateField, IntervalField },
  formComponents: {},
});
