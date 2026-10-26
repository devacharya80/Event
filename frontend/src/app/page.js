"use client";
import { useFormStore } from "@/store/useFormStore";
import { Stepper } from "@/components/ui";
import { STEPS } from "@/lib/constants";
import StepOne from "@/components/steps/StepOne";

export default function Page() {
  const step = useFormStore((s) => s.step);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Post a Requirement</h1>
      <p className="mb-6 text-sm text-gray-500">Tell us about your event and who you need.</p>

      <Stepper steps={STEPS} current={step} />

      {step === 1 && <StepOne />}
      {step > 1 && (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          Step {step} is coming in the next part.
        </p>
      )}
    </main>
  );
}