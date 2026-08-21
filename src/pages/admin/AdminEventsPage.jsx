import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/admin/Modal";
import Badge from "../../components/admin/Badge";
import { supabase } from "../../lib/supabaseClient";
import eventImages from "../../data/eventImages";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-body text-sm text-white outline-none placeholder:text-white/30 focus:border-bs-pink focus:ring-2 focus:ring-bs-pink/30";
const labelClass = "mb-1 block font-body text-xs font-medium uppercase tracking-wide text-bs-white/60";

const emptyForm = {
  id: null,
  name: "",
  slug: "",
  description: "",
  guidelines: "",
  rules: "",
  category: "",
  image_url: "",
  contact_name: "",
  contact_phone: "",
  prize_pool: "",
  is_team_event: false,
  min_team_size: 1,
  max_team_size: 1,
  registration_open: true,
  registration_deadline: "",
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toDatetimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [detailEvent, setDetailEvent] = useState(null);

  async function loadEvents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setEvents(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(ev) {
    setForm({
      id: ev.id,
      name: ev.name,
      slug: ev.slug,
      description: ev.description ?? "",
      guidelines: (ev.guidelines ?? []).join("\n"),
      rules: (ev.rules ?? []).join("\n"),
      category: ev.category ?? "",
      image_url: ev.image_url ?? "",
      contact_name: ev.contact_name ?? "",
      contact_phone: ev.contact_phone ?? "",
      prize_pool: ev.prize_pool ?? "",
      is_team_event: ev.is_team_event,
      min_team_size: ev.min_team_size,
      max_team_size: ev.max_team_size,
      registration_open: ev.registration_open,
      registration_deadline: toDatetimeLocal(ev.registration_deadline),
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) return setFormError("Event name is required.");
    const slug = form.slug.trim() || slugify(form.name);
    const minSize = Number(form.min_team_size) || 1;
    const maxSize = Number(form.max_team_size) || 1;
    if (form.is_team_event && minSize > maxSize) {
      return setFormError("Min team size can't be greater than max team size.");
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      guidelines: form.guidelines.split("\n").map((s) => s.trim()).filter(Boolean),
      rules: form.rules.split("\n").map((s) => s.trim()).filter(Boolean),
      category: form.category.trim(),
      image_url: form.image_url || null,
      contact_name: form.contact_name.trim(),
      contact_phone: form.contact_phone.trim(),
      prize_pool: form.prize_pool.trim(),
      is_team_event: form.is_team_event,
      min_team_size: form.is_team_event ? minSize : 1,
      max_team_size: form.is_team_event ? maxSize : 1,
      registration_open: form.registration_open,
      registration_deadline: form.registration_deadline
        ? new Date(form.registration_deadline).toISOString()
        : null,
    };

    const query = form.id
      ? supabase.from("events").update(payload).eq("id", form.id)
      : supabase.from("events").insert(payload);

    let error;
    try {
      ({ error } = await query);
    } catch (err) {
      error = err;
    }
    setSaving(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    setModalOpen(false);
    loadEvents();
  }

  async function toggleOpen(ev) {
    await supabase.from("events").update({ registration_open: !ev.registration_open }).eq("id", ev.id);
    loadEvents();
  }

  async function toggleActive(ev) {
    await supabase.from("events").update({ is_active: !ev.is_active }).eq("id", ev.id);
    loadEvents();
  }

  async function hardDelete(ev) {
    const ok = window.confirm(
      `Permanently delete "${ev.name}"? This also deletes ALL its registrations, teams and team members. This cannot be undone.`
    );
    if (!ok) return;
    await supabase.from("events").delete().eq("id", ev.id);
    loadEvents();
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-body text-2xl font-bold text-white sm:text-3xl">Events</h1>
          <p className="mt-1 font-body text-sm text-bs-white/60">
            Add, edit and manage registration windows for every event.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="neon-border-pink rounded-lg px-5 py-2.5 font-body text-sm text-white transition hover:scale-105"
        >
          + Add Event
        </button>
      </div>

      <div className="glass-card mt-6 overflow-x-auto rounded-2xl p-2 sm:p-4">
        <table className="w-full min-w-[900px] text-left font-body text-sm">
          <thead>
            <tr className="border-b border-white/10 text-bs-white/50">
              <th className="p-3 font-medium">Event</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Deadline</th>
              <th className="p-3 font-medium">Registration</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-bs-white/50">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && events.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-bs-white/50">
                  No events yet. Click &ldquo;Add Event&rdquo; to create one.
                </td>
              </tr>
            )}
            {events.map((ev) => (
              <tr key={ev.id} className="border-b border-white/5 align-top text-white/90">
                <td className="p-3">
                  <p className="font-medium">{ev.name}</p>
                  <p className="text-xs text-bs-white/50">{ev.category || "—"}</p>
                </td>
                <td className="p-3">
                  {ev.is_team_event ? `Team (${ev.min_team_size}-${ev.max_team_size})` : "Individual"}
                </td>
                <td className="p-3 text-bs-white/70">
                  {ev.registration_deadline
                    ? new Date(ev.registration_deadline).toLocaleString()
                    : "No deadline"}
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => toggleOpen(ev)}
                    className="cursor-pointer"
                    title="Toggle registration open/closed"
                  >
                    <Badge color={ev.registration_open ? "green" : "red"}>
                      {ev.registration_open ? "Open" : "Closed"}
                    </Badge>
                  </button>
                </td>
                <td className="p-3">
                  <Badge color={ev.is_active ? "pink" : "gray"}>
                    {ev.is_active ? "Active" : "Deactivated"}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailEvent(ev)}
                      className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:border-bs-blue"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(ev)}
                      className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:border-bs-pink"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(ev)}
                      className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:border-yellow-400"
                    >
                      {ev.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => hardDelete(ev)}
                      className="rounded-md border border-red-400/40 px-2.5 py-1 text-xs text-red-300 hover:border-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? "Edit Event" : "Add Event"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                className={inputClass}
                value={form.slug}
                placeholder={slugify(form.name) || "auto-generated"}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Guidelines (one per line)</label>
              <textarea
                className={inputClass}
                rows={4}
                value={form.guidelines}
                onChange={(e) => setForm((f) => ({ ...f, guidelines: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Rules (one per line)</label>
              <textarea
                className={inputClass}
                rows={4}
                value={form.rules}
                onChange={(e) => setForm((f) => ({ ...f, rules: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Category</label>
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Prize Pool</label>
              <input
                className={inputClass}
                value={form.prize_pool}
                placeholder="Rs.2000"
                onChange={(e) => setForm((f) => ({ ...f, prize_pool: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Poster</label>
              <select
                className={inputClass}
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              >
                <option value="">None</option>
                {Object.keys(eventImages).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Contact Name</label>
              <input
                className={inputClass}
                value={form.contact_name}
                onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Contact Phone</label>
              <input
                className={inputClass}
                value={form.contact_phone}
                onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 font-body text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.is_team_event}
              onChange={(e) => setForm((f) => ({ ...f, is_team_event: e.target.checked }))}
            />
            This is a team event
          </label>

          {form.is_team_event && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Min Team Size</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.min_team_size}
                  onChange={(e) => setForm((f) => ({ ...f, min_team_size: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Max Team Size</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.max_team_size}
                  onChange={(e) => setForm((f) => ({ ...f, max_team_size: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 font-body text-sm text-white/80">
              <input
                type="checkbox"
                checked={form.registration_open}
                onChange={(e) => setForm((f) => ({ ...f, registration_open: e.target.checked }))}
              />
              Registration open
            </label>
            <div>
              <label className={labelClass}>Registration Deadline</label>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.registration_deadline}
                onChange={(e) => setForm((f) => ({ ...f, registration_deadline: e.target.value }))}
              />
            </div>
          </div>

          {formError && (
            <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 font-body text-sm text-red-300">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="neon-border-pink mt-2 rounded-lg py-2.5 font-body text-white transition hover:scale-[1.02] disabled:opacity-60"
          >
            {saving ? "Saving…" : form.id ? "Save Changes" : "Create Event"}
          </button>
        </form>
      </Modal>

      {/* View details modal */}
      <Modal
        open={!!detailEvent}
        onClose={() => setDetailEvent(null)}
        title={detailEvent?.name ?? ""}
      >
        {detailEvent && (
          <div className="flex flex-col gap-3 font-body text-sm text-white/90">
            <p>
              <span className="text-bs-white/50">Category:</span> {detailEvent.category || "—"}
            </p>
            <p>
              <span className="text-bs-white/50">Description:</span> {detailEvent.description || "—"}
            </p>
            <p>
              <span className="text-bs-white/50">Type:</span>{" "}
              {detailEvent.is_team_event
                ? `Team (${detailEvent.min_team_size}-${detailEvent.max_team_size} members)`
                : "Individual"}
            </p>
            <p>
              <span className="text-bs-white/50">Prize Pool:</span> {detailEvent.prize_pool || "—"}
            </p>
            <p>
              <span className="text-bs-white/50">Contact:</span> {detailEvent.contact_name}{" "}
              {detailEvent.contact_phone}
            </p>
            <p>
              <span className="text-bs-white/50">Deadline:</span>{" "}
              {detailEvent.registration_deadline
                ? new Date(detailEvent.registration_deadline).toLocaleString()
                : "No deadline"}
            </p>
            {detailEvent.guidelines?.length > 0 && (
              <div>
                <p className="text-bs-white/50">Guidelines:</p>
                <ul className="list-disc pl-5">
                  {detailEvent.guidelines.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
            {detailEvent.rules?.length > 0 && (
              <div>
                <p className="text-bs-white/50">Rules:</p>
                <ul className="list-disc pl-5">
                  {detailEvent.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
