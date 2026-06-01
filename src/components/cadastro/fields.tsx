import * as React from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

const inputBase =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-[var(--brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/20";

const labelBase = "block text-xs font-semibold uppercase tracking-wide text-slate-700";

export function FieldShell({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelBase}>{label}</label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
      {error && <p className="mt-1 text-xs text-[var(--brand-red)]">{error}</p>}
    </div>
  );
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  hint,
  maxLength,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  hint?: string;
  maxLength?: number;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell label={label} hint={hint} error={fieldState.error?.message}>
          <input
            {...field}
            type={type}
            value={(field.value as string | number | undefined) ?? ""}
            maxLength={maxLength}
            placeholder={placeholder}
            className={inputBase}
          />
        </FieldShell>
      )}
    />
  );
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  min,
  max,
  rows = 4,
  hint,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  rows?: number;
  hint?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = (field.value as string) ?? "";
        const len = value.length;
        const tooShort = min !== undefined && len > 0 && len < min;
        const counter = (
          <span className={tooShort ? "text-[var(--brand-yellow)]" : "text-slate-500"}>
            {len}
            {max ? `/${max}` : ""}
            {min ? ` · mín. ${min}` : ""}
          </span>
        );
        return (
          <FieldShell
            label={label}
            hint={
              <div className="flex items-center justify-between gap-2">
                <span>{hint}</span>
                {counter}
              </div>
            }
            error={fieldState.error?.message}
          >
            <textarea
              {...field}
              value={value}
              rows={rows}
              maxLength={max}
              placeholder={placeholder}
              className={`${inputBase} resize-y leading-relaxed`}
            />
          </FieldShell>
        );
      }}
    />
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Selecione…",
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: readonly string[] | readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell label={label} error={fieldState.error?.message}>
          <select {...field} value={(field.value as string) ?? ""} className={inputBase}>
            <option value="">{placeholder}</option>
            {options.map((o) => {
              const value = typeof o === "string" ? o : o.value;
              const lbl = typeof o === "string" ? o : o.label;
              return (
                <option key={value} value={value}>
                  {lbl}
                </option>
              );
            })}
          </select>
        </FieldShell>
      )}
    />
  );
}

export function RadioField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  description,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  description?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell label={label} hint={description} error={fieldState.error?.message}>
          <div className="flex flex-wrap gap-3">
            {options.map((o) => {
              const checked = field.value === o.value;
              return (
                <label
                  key={o.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
                    checked
                      ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] font-semibold"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={o.value}
                    checked={checked}
                    onChange={() => field.onChange(o.value)}
                    className="sr-only"
                  />
                  {o.label}
                </label>
              );
            })}
          </div>
        </FieldShell>
      )}
    />
  );
}

export function YesNoField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  includeMaybe = false,
  tristate = false,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  includeMaybe?: boolean;
  tristate?: boolean;
}) {
  const opts: { value: string; label: string }[] = tristate
    ? [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
        { value: "indefinido", label: "Ainda não definido" },
      ]
    : includeMaybe
    ? [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
        { value: "talvez", label: "Talvez" },
      ]
    : [
        { value: "true", label: "Sim" },
        { value: "false", label: "Não" },
      ];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const current =
          tristate || includeMaybe
            ? (field.value as string | null) ?? ""
            : field.value === true
            ? "true"
            : field.value === false
            ? "false"
            : "";
        return (
          <FieldShell label={label} hint={description} error={fieldState.error?.message}>
            <div className="flex flex-wrap gap-3">
              {opts.map((o) => {
                const checked = current === o.value;
                return (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
                      checked
                        ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] font-semibold"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={o.value}
                      checked={checked}
                      onChange={() => {
                        if (tristate || includeMaybe) field.onChange(o.value);
                        else field.onChange(o.value === "true");
                      }}
                      className="sr-only"
                    />
                    {o.label}
                  </label>
                );
              })}
            </div>
          </FieldShell>
        );
      }}
    />
  );
}
