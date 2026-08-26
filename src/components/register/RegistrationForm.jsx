import { useEffect, useState } from "react";
import NeonButton from "../NeonButton";
import qrImage from "../../assets/QrPic.jpeg";

const PAYMENT_IMAGES = [qrImage];

const STEPS = ["Basic Info", "Payment"];

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black/30 px-4 py-2.5 font-body text-sm text-white placeholder:text-white/30 outline-none transition focus:border-bs-pink focus:shadow-[0_0_0_3px_rgba(209,58,170,0.25)] sm:text-base 4xl:rounded-xl 4xl:px-6 4xl:py-4 4xl:text-lg 6xl:text-xl";

const labelClass = "mb-1.5 block font-body text-xs tracking-[0.1em] text-bs-white/70 sm:text-sm 4xl:text-base 6xl:text-lg";

const STORAGE_KEY = "bs_registration_draft";

function loadDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export default function RegistrationForm() {
  const draft = loadDraft();
  const [step, setStep] = useState(draft?.step ?? 1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fee, setFee] = useState(null);
  const [data, setData] = useState(
    draft?.data ?? {
      name: "",
      email: "",
      phone: "",
      collegeName: "",
      collegeCity: "",
      attendingDrama: false,
      dramaLeaderName: "",
      dramaCollegeName: "",
      joinedWhatsapp: false,
      timestamp: "",
      transactionId: "",
    }
  );

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  useEffect(() => {
    fetch("/api/registration-fee")
      .then((res) => res.json())
      .then((body) => setFee(body.amount))
      .catch(() => {});
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
  }, [step, data]);

  function handleStep1Submit(e) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setStep(2);
  }

  async function handleStep2Submit(e) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      sessionStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="glass-card rounded-[35px] p-8 text-center shadow-[4px_4px_10px_rgba(0,0,0,0.25)] sm:p-14 4xl:max-w-3xl 4xl:mx-auto 4xl:rounded-[48px] 4xl:p-20">
        <h2 className="font-script text-glow-white text-5xl text-white sm:text-6xl 4xl:text-8xl">Thank You!</h2>
        <p className="mt-4 font-body text-bs-white/80 4xl:text-xl">
          Your registration has been received.
        </p>

        <span className="text-glow-orange mt-5 inline-flex items-center gap-2 rounded-full border border-bs-orange/40 bg-bs-orange/10 px-4 py-1.5 font-body text-xs font-semibold tracking-[0.15em] text-bs-orange 4xl:px-6 4xl:py-2 4xl:text-base">
          ● PENDING VERIFICATION
        </span>

        <p className="mx-auto mt-4 max-w-sm font-body text-sm text-bs-white/70 4xl:max-w-md 4xl:text-lg">
          After your payment is verified, you&apos;ll receive a confirmation email.
        </p>

        <div className="mx-auto mt-8 max-w-sm border-t border-white/10 pt-6 4xl:max-w-md 4xl:mt-12 4xl:pt-9">
          <h3 className="text-glow-pink font-body text-xs tracking-[0.2em] text-bs-pink 4xl:text-base">
            QUERIES?
          </h3>
          <div className="mt-3 flex flex-col gap-1 font-body text-sm text-bs-white/80 4xl:text-lg">
            <p>
              Saravanavel C ·{" "}
              <a href="tel:+919171098222" className="hover:text-bs-pink">
                9171098222
              </a>
            </p>
            <p>
              Janani S ·{" "}
              <a href="tel:+916381067709" className="hover:text-bs-pink">
                6381067709
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[35px] p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] sm:p-12 4xl:rounded-[48px] 4xl:p-16">
      <div className="mb-8 flex items-center justify-center gap-3 4xl:mb-12 4xl:gap-5">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-body text-xs transition ${
                    active
                      ? "border-bs-pink bg-bs-pink/20 text-white shadow-[0_0_10px_rgba(209,58,170,0.6)]"
                      : done
                        ? "border-bs-blue bg-bs-blue/20 text-white"
                        : "border-white/20 text-white/40"
                  }`}
                >
                  {done ? "✓" : n}
                </span>
                <span
                  className={`font-body text-xs tracking-wide sm:text-sm ${
                    active ? "text-white" : "text-white/40"
                  }`}
                >
                  {label.toUpperCase()}
                </span>
              </div>
              {n < STEPS.length && <span className="h-px w-6 bg-white/20 sm:w-10" />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1Submit} noValidate className="space-y-5">
          <Field label="NAME">
            <input
              type="text"
              required
              className={inputClass}
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your full name"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="EMAIL ID">
              <input
                type="email"
                required
                className={inputClass}
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="PHONE NO">
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                title="Enter a 10-digit phone number"
                className={inputClass}
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="9876543210"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="COLLEGE NAME">
              <input
                type="text"
                required
                className={inputClass}
                value={data.collegeName}
                onChange={(e) => update("collegeName", e.target.value)}
                placeholder="Your college"
              />
            </Field>
            <Field label="COLLEGE CITY">
              <input
                type="text"
                required
                className={inputClass}
                value={data.collegeCity}
                onChange={(e) => update("collegeCity", e.target.value)}
                placeholder="City"
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={data.attendingDrama}
                onChange={(e) => update("attendingDrama", e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 bg-black/30 accent-bs-pink"
              />
              <span className="font-body text-sm text-bs-white/80">
                Are you attending the Drama event?
              </span>
            </label>

            {data.attendingDrama && (
              <div className="space-y-4 pl-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="DRAMA TEAM LEADER NAME">
                    <input
                      type="text"
                      required
                      className={inputClass}
                      value={data.dramaLeaderName}
                      onChange={(e) => update("dramaLeaderName", e.target.value)}
                      placeholder="Team leader's full name"
                    />
                  </Field>
                  <Field label="DRAMA TEAM COLLEGE NAME">
                    <input
                      type="text"
                      required
                      className={inputClass}
                      value={data.dramaCollegeName}
                      onChange={(e) => update("dramaCollegeName", e.target.value)}
                      placeholder="Team's college"
                    />
                  </Field>
                </div>
                <p className="text-glow-orange font-body text-xs font-semibold tracking-wide text-bs-orange">
                  Submit your PPT before 31 August 2026.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                checked={data.joinedWhatsapp}
                onChange={(e) => update("joinedWhatsapp", e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 bg-black/30 accent-bs-pink"
              />
              <span className="font-body text-sm text-bs-white/80">
                I&apos;ve joined the Brainstrain &lsquo;26 WhatsApp group
              </span>
            </label>
            <a
              href="https://chat.whatsapp.com/IWitiLLFtFxE0RzafjJe2X?s=cl&p=a&ilr=0"
              target="_blank"
              rel="noreferrer"
              className="font-body text-xs font-semibold tracking-wide text-bs-blue underline-offset-4 transition hover:text-bs-pink hover:underline"
            >
              JOIN WHATSAPP GROUP →
            </a>
          </div>

          <div className="pt-4 text-center">
            <NeonButton type="submit" color="pink">
              NEXT: PAYMENT
            </NeonButton>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2Submit} noValidate className="space-y-6">
          <div className="text-center">
            <h3 className="text-glow-pink font-body text-sm tracking-[0.2em] text-bs-pink">
              SCAN & PAY THE REGISTRATION FEE
            </h3>
            <div className="mx-auto mt-4 flex max-w-xs flex-col gap-4">
              {PAYMENT_IMAGES.length > 0 ? (
                PAYMENT_IMAGES.map((src, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-white/15 bg-black/30 p-4"
                  >
                    <img src={src} alt={`Payment info ${i + 1}`} className="w-full rounded-lg" />
                  </div>
                ))
              ) : (
                <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/30 p-6 text-center">
                  <p className="font-body text-sm font-semibold text-white/60">Payment QR</p>
                  <p className="font-body text-xs text-white/40">
                    The QR code / payment details image will appear here once it&apos;s added.
                  </p>
                </div>
              )}
            </div>
            {fee != null && (
              <p className="mt-4 font-body text-base text-white">
                Registration fee is{" "}
                <span className="text-glow-blue font-semibold text-bs-blue">₹{fee}</span>
              </p>
            )}
            <p className="mt-3 font-body text-xs text-bs-white/60">
              After paying, enter the transaction details below.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="PAYMENT TIMESTAMP">
              <input
                type="datetime-local"
                required
                className={inputClass}
                value={data.timestamp}
                onChange={(e) => update("timestamp", e.target.value)}
              />
            </Field>
            <Field label="TRANSACTION ID">
              <input
                type="text"
                required
                className={inputClass}
                value={data.transactionId}
                onChange={(e) => update("transactionId", e.target.value)}
                placeholder="e.g. T2609261234567890"
              />
            </Field>
          </div>

          {submitError && (
            <p className="text-center font-body text-sm text-red-400">{submitError}</p>
          )}

          <div className="flex flex-col-reverse items-center justify-center gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="font-body text-sm tracking-wide text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              BACK
            </button>
            <NeonButton type="submit" color="blue" disabled={submitting}>
              {submitting ? "SUBMITTING…" : "SUBMIT REGISTRATION"}
            </NeonButton>
          </div>
        </form>
      )}
    </div>
  );
}
