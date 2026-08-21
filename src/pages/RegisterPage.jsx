import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import Reveal from "../components/Reveal";
import { supabase } from "../lib/supabaseClient";

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"];

const emptyMember = () => ({ name: "", email: "", phone: "", college: "" });

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white/95 px-4 py-3 font-body text-black placeholder:text-black/40 outline-none focus:border-bs-pink focus:ring-2 focus:ring-bs-pink/40";
const labelClass = "mb-1 block font-body text-sm font-medium text-black/70";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get("event");

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(preselect || "");

  const [leader, setLeader] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: "",
  });
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { ok: bool, message: string }

  useEffect(() => {
    let active = true;
    supabase
      .from("events")
      .select("id, name, slug, is_team_event, min_team_size, max_team_size, registration_open, registration_deadline")
      .eq("is_active", true)
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error) setEvents(data ?? []);
        setEventsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setEventsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedEvent = useMemo(
    () => events.find((e) => e.slug === selectedSlug) || null,
    [events, selectedSlug]
  );

  useEffect(() => {
    if (!selectedEvent) {
      setMembers([]);
      return;
    }
    if (selectedEvent.is_team_event) {
      const minExtra = Math.max(0, selectedEvent.min_team_size - 1);
      setMembers(Array.from({ length: minExtra }, emptyMember));
    } else {
      setMembers([]);
    }
  }, [selectedEvent?.id]);

  const deadlinePassed =
    selectedEvent?.registration_deadline &&
    new Date(selectedEvent.registration_deadline).getTime() < Date.now();
  const registrationClosed = selectedEvent && (!selectedEvent.registration_open || deadlinePassed);

  function updateLeader(field, value) {
    setLeader((l) => ({ ...l, [field]: value }));
  }

  function updateMember(index, field, value) {
    setMembers((list) => list.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function addMember() {
    if (!selectedEvent) return;
    const maxExtra = selectedEvent.max_team_size - 1;
    setMembers((list) => (list.length < maxExtra ? [...list, emptyMember()] : list));
  }

  function removeMember(index) {
    if (!selectedEvent) return;
    const minExtra = Math.max(0, selectedEvent.min_team_size - 1);
    setMembers((list) => (list.length > minExtra ? list.filter((_, i) => i !== index) : list));
  }

  function validate() {
    const errs = {};
    if (!selectedEvent) errs.event = "Please choose an event.";

    if (!leader.name.trim()) errs.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(leader.email)) errs.email = "Enter a valid email";
    if (!/^[0-9]{10}$/.test(leader.phone)) errs.phone = "Enter a valid 10-digit number";
    if (!leader.college.trim()) errs.college = "Required";

    if (selectedEvent?.is_team_event) {
      if (!teamName.trim()) errs.teamName = "Team name is required";
      members.forEach((m, i) => {
        if (!m.name.trim()) errs[`member-${i}-name`] = "Required";
        if (m.email && !/^\S+@\S+\.\S+$/.test(m.email)) errs[`member-${i}-email`] = "Invalid email";
        if (m.phone && !/^[0-9]{10}$/.test(m.phone)) errs[`member-${i}-phone`] = "Invalid number";
      });
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    if (registrationClosed) return;

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    let error;
    try {
      ({ error } = await supabase.rpc("register_for_event", {
        p_event_id: selectedEvent.id,
        p_team_name: selectedEvent.is_team_event ? teamName.trim() : null,
        p_leader: leader,
        p_members: selectedEvent.is_team_event ? members : [],
      }));
    } catch (err) {
      error = err;
    }
    setSubmitting(false);

    if (error) {
      setResult({ ok: false, message: error.message || "Something went wrong. Please try again." });
      return;
    }

    setResult({ ok: true, message: "You're registered! We'll see you at Brainstrain '26." });
    setLeader({ name: "", email: "", phone: "", college: "", department: "", year: "" });
    setTeamName("");
    setMembers(
      selectedEvent.is_team_event
        ? Array.from({ length: Math.max(0, selectedEvent.min_team_size - 1) }, emptyMember)
        : []
    );
  }

  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-16">
          <div className="glass-card rounded-[35px] px-4 py-10 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] sm:px-10 sm:py-14">
            <ScriptHeading as="h1" className="mb-10 text-center">
              Registration
            </ScriptHeading>

            <Reveal className="rounded-[20px] bg-[#ededed] p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] sm:p-10">
            {result?.ok ? (
              <div className="py-10 text-center">
                <p className="text-3xl">🎉</p>
                <p className="mt-4 font-body text-lg font-semibold text-black">{result.message}</p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link to="/events" className="font-body text-bs-pink underline">
                    Browse more events
                  </Link>
                  <button
                    type="button"
                    onClick={() => setResult(null)}
                    className="font-body text-bs-pink underline"
                  >
                    Register another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div>
                  <label className={labelClass}>Event *</label>
                  <select
                    className={inputClass}
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    disabled={eventsLoading}
                  >
                    <option value="">
                      {eventsLoading ? "Loading events…" : "Select an event"}
                    </option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.slug} disabled={!ev.registration_open}>
                        {ev.name}
                        {!ev.registration_open ? " (closed)" : ""}
                      </option>
                    ))}
                  </select>
                  {errors.event && <p className="mt-1 text-sm text-red-600">{errors.event}</p>}
                </div>

                {selectedEvent && registrationClosed && (
                  <p className="mt-4 rounded-lg bg-red-100 px-4 py-3 font-body text-sm text-red-700">
                    Registration for {selectedEvent.name} is currently closed.
                  </p>
                )}

                {selectedEvent && !registrationClosed && (
                  <>
                    {selectedEvent.is_team_event && (
                      <div className="mt-5">
                        <label className={labelClass}>Team Name *</label>
                        <input
                          className={inputClass}
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Enter your team name"
                        />
                        {errors.teamName && (
                          <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>
                        )}
                        <p className="mt-1 font-body text-xs text-black/50">
                          Team size: {selectedEvent.min_team_size}–{selectedEvent.max_team_size} members
                          (including you as leader).
                        </p>
                      </div>
                    )}

                    <fieldset className="m-0 mt-6 grid gap-5 border-0 p-0 sm:grid-cols-2">
                      <legend className="mb-1 w-full p-0 font-body text-sm font-semibold uppercase tracking-wide text-black/60 sm:col-span-2">
                        {selectedEvent.is_team_event ? "Team Leader Details" : "Your Details"}
                      </legend>

                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                          className={inputClass}
                          value={leader.name}
                          onChange={(e) => updateLeader("name", e.target.value)}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          className={inputClass}
                          value={leader.email}
                          onChange={(e) => updateLeader("email", e.target.value)}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Mobile Number *</label>
                        <input
                          className={inputClass}
                          value={leader.phone}
                          onChange={(e) => updateLeader("phone", e.target.value.replace(/\D/g, ""))}
                          maxLength={10}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>College *</label>
                        <input
                          className={inputClass}
                          value={leader.college}
                          onChange={(e) => updateLeader("college", e.target.value)}
                        />
                        {errors.college && <p className="mt-1 text-sm text-red-600">{errors.college}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Department</label>
                        <input
                          className={inputClass}
                          value={leader.department}
                          onChange={(e) => updateLeader("department", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Year of Study</label>
                        <select
                          className={inputClass}
                          value={leader.year}
                          onChange={(e) => updateLeader("year", e.target.value)}
                        >
                          <option value="">Select</option>
                          {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </fieldset>

                    {selectedEvent.is_team_event && (
                      <div className="mt-8">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-black/60">
                            Team Members
                          </h3>
                          <button
                            type="button"
                            onClick={addMember}
                            disabled={members.length >= selectedEvent.max_team_size - 1}
                            className="rounded-md border border-bs-pink px-3 py-1 font-body text-sm text-bs-pink transition disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            + Add member
                          </button>
                        </div>

                        <div className="flex flex-col gap-5">
                          {members.map((m, i) => (
                            <div key={i} className="rounded-xl border border-black/10 p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <p className="font-body text-sm font-medium text-black/70">
                                  Member {i + 2}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeMember(i)}
                                  disabled={members.length <= Math.max(0, selectedEvent.min_team_size - 1)}
                                  className="font-body text-xs text-red-500 underline disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label className={labelClass}>Full Name *</label>
                                  <input
                                    className={inputClass}
                                    value={m.name}
                                    onChange={(e) => updateMember(i, "name", e.target.value)}
                                  />
                                  {errors[`member-${i}-name`] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[`member-${i}-name`]}</p>
                                  )}
                                </div>
                                <div>
                                  <label className={labelClass}>Email</label>
                                  <input
                                    className={inputClass}
                                    value={m.email}
                                    onChange={(e) => updateMember(i, "email", e.target.value)}
                                  />
                                  {errors[`member-${i}-email`] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[`member-${i}-email`]}</p>
                                  )}
                                </div>
                                <div>
                                  <label className={labelClass}>Mobile Number</label>
                                  <input
                                    className={inputClass}
                                    value={m.phone}
                                    onChange={(e) =>
                                      updateMember(i, "phone", e.target.value.replace(/\D/g, ""))
                                    }
                                    maxLength={10}
                                  />
                                  {errors[`member-${i}-phone`] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[`member-${i}-phone`]}</p>
                                  )}
                                </div>
                                <div>
                                  <label className={labelClass}>College</label>
                                  <input
                                    className={inputClass}
                                    value={m.college}
                                    onChange={(e) => updateMember(i, "college", e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result?.ok === false && (
                      <p className="mt-6 rounded-lg bg-red-100 px-4 py-3 font-body text-sm text-red-700">
                        {result.message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-8 w-full rounded-lg bg-black py-3 font-body text-lg font-semibold text-white transition hover:bg-bs-pink disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Submitting…" : "Submit Registration"}
                    </button>
                  </>
                )}
              </form>
            )}
            </Reveal>
          </div>
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
