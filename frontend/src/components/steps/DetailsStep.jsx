"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORY_STEPS, buildDefaults } from "@/lib/categoryConfig";
import { useFormStore } from "@/store/useFormStore";
import { Field, inputCls } from "@/components/ui";

const choiceCls =
  "cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:border-indigo-300 " +
  "has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700 " +
  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-300";

function Group({ f, reg, error }) {
  const type = f.type === "radio" ? "radio" : "checkbox";
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gray-700">{f.label}</legend>
      <div className="flex flex-wrap gap-2">
        {f.options.map((o) => (
          <label key={o.value} className={choiceCls}>
            <input type={type} value={o.value} {...reg} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}

function Control({ f, register, error }) {
  const invalid = !!error;

  if (f.type === "checkboxes" || f.type === "radio") {
    return <Group f={f} reg={register(f.name)} error={error} />;
  }

  if (f.type === "toggle") {
    return (
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" {...register(f.name)} className="h-4 w-4 rounded border-gray-300 accent-indigo-600" />
        {f.label}
      </label>
    );
  }

  let input;
  if (f.type === "select") {
    input = (
      <select {...register(f.name)} className={inputCls} aria-invalid={invalid}>
        <option value="">Select</option>
        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (f.type === "textarea") {
    input = (
      <textarea {...register(f.name)} rows={3} maxLength={1000} placeholder={f.placeholder}
        className={inputCls} aria-invalid={invalid} />
    );
  } else if (f.type === "number") {
    input = (
      <input type="number" inputMode="numeric" min={f.min} max={f.max} placeholder={f.placeholder}
        {...register(f.name, { valueAsNumber: true })} className={inputCls} aria-invalid={invalid} />
    );
  } else {
    input = (
      <input {...register(f.name)} placeholder={f.placeholder} className={inputCls} aria-invalid={invalid} />
    );
  }

  return <Field label={f.label} optional={f.optional} error={error}>{input}</Field>;
}

export default function DetailsStep({ index }) {
  const category = useFormStore((s) => s.basics?.category);
  const details = useFormStore((s) => s.details);
  const saveDetails = useFormStore((s) => s.saveDetails);
  const back = useFormStore((s) => s.back);

  const { schema, fields } = CATEGORY_STEPS[category][index];
  const isLast = index === CATEGORY_STEPS[category].length - 1;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(fields, details),
    mode: "onTouched",
  });

  return (
    <form onSubmit={handleSubmit(saveDetails)} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
          <Control f={f} register={register} error={errors[f.name]?.message} />
        </div>
      ))}

      <div className="flex gap-3 sm:col-span-2">
        <button type="button" onClick={back}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
          Back
        </button>
        <button type="submit"
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          {isLast ? "Review" : "Continue"}
        </button>
      </div>
    </form>
  );
}