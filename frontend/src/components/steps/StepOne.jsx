"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema } from "@/lib/schemas";
import { CATEGORIES, EVENT_TYPES } from "@/lib/constants";
import { useFormStore } from "@/store/useFormStore";
import { Field, inputCls } from "@/components/ui";

const emptyValues = {
  eventName: "", eventType: "", startDate: "", endDate: "",
  location: "", venue: "", category: "",
};

export default function StepOne() {
  const basics = useFormStore((s) => s.basics);
  const saveBasics = useFormStore((s) => s.saveBasics);

  const {
    register, handleSubmit, watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: basics ?? emptyValues,
    mode: "onTouched",
  });

  const selected = watch("category");
  const minDate = new Date().toLocaleDateString("en-CA");

  return (
    <form onSubmit={handleSubmit(saveBasics)} noValidate className="space-y-5">
      <Field label="Event name" error={errors.eventName?.message}>
        <input {...register("eventName")} className={inputCls} placeholder="e.g. Sharma Wedding"
          aria-invalid={!!errors.eventName} />
      </Field>

      <Field label="Event type" error={errors.eventType?.message}>
        <select {...register("eventType")} className={inputCls} aria-invalid={!!errors.eventType}>
          <option value="">Select type</option>
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date" error={errors.startDate?.message}>
          <input type="date" min={minDate} {...register("startDate")} className={inputCls}
            aria-invalid={!!errors.startDate} />
        </Field>
        <Field label="End date" optional error={errors.endDate?.message}>
          <input type="date" min={minDate} {...register("endDate")} className={inputCls}
            aria-invalid={!!errors.endDate} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location" error={errors.location?.message}>
          <input {...register("location")} className={inputCls} placeholder="City"
            aria-invalid={!!errors.location} />
        </Field>
        <Field label="Venue" optional error={errors.venue?.message}>
          <input {...register("venue")} className={inputCls} placeholder="Venue name" />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-700">I am looking for</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={`cursor-pointer rounded-xl border p-4 transition ${
                selected === c.value
                  ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200"
                  : "border-gray-300 hover:border-indigo-300"
              }`}
            >
              <input type="radio" value={c.value} {...register("category")} className="sr-only" />
              <span className="block text-sm font-semibold text-gray-900">{c.label}</span>
              <span className="mt-1 block text-xs text-gray-500">{c.desc}</span>
            </label>
          ))}
        </div>
        {errors.category && (
          <p role="alert" className="mt-1 text-xs text-red-600">{errors.category.message}</p>
        )}
      </fieldset>

      <button type="submit"
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
        Continue
      </button>
    </form>
  );
}