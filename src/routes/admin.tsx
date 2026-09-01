import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore, type Enquiry, type Review } from "@/lib/store";
import { type Discipline, type Project } from "@/data/work";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Check, X, Trash2, Plus, Image as ImageIcon, Mail, Star, Lock, LogOut, RefreshCw, Edit3 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    title: "Admin Control Panel — Paper & Pencil",
    meta: [{ name: "description", content: "Admin management dashboard for Paper & Pencil." }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const {
    disciplines,
    enquiries,
    reviews,
    isAdmin,
    userSession,
    loginWithEmailPassword,
    logoutAdmin,
    logoutUser,
    updateEnquiryStatus,
    deleteEnquiry,
    updateReviewStatus,
    deleteReview,
    updatePractice,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
  } = useAppStore();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "practices" | "enquiries" | "reviews">("projects");

  // Project Editor state
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>("industrial");
  const [editingProjectIdx, setEditingProjectIdx] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<Project>({
    title: "",
    location: "",
    year: new Date().getFullYear(),
    size: "",
    note: "",
    images: [],
  });
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Practice Editor state
  const [practiceEditingKey, setPracticeEditingKey] = useState<Discipline | null>(null);
  const [practiceForm, setPracticeForm] = useState({ label: "", tagline: "", code: "", color: "" });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    loginWithEmailPassword(emailInput, passwordInput, nameInput);
    setPasswordInput("");
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen relative flex flex-col justify-between" style={{ background: "var(--ink)" }}>
        <CustomCursor />
        <Nav />

        <div className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-6 py-32">
          <div className="w-full rounded-sm border border-gold/40 bg-ink-soft p-8 md:p-10 shadow-2xl">
            {userSession ? (
              <div className="space-y-6 text-center py-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-2xl text-gold">
                  ✓
                </div>
                <div>
                  <h1 className="font-serif text-2xl text-cream">Welcome, {userSession.name}</h1>
                  <p className="mt-2 text-xs text-grey-soft">
                    Signed in as <span className="text-gold font-mono">{userSession.email}</span>
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  <a
                    href="/#testimonials"
                    className="border border-gold bg-gold px-6 py-3 text-xs uppercase tracking-[0.28em] text-black font-semibold hover:bg-gold/90 text-center"
                  >
                    Write a Review →
                  </a>
                  <button
                    onClick={logoutUser}
                    className="border border-border/60 bg-ink p-3 text-xs uppercase tracking-[0.25em] text-grey-soft hover:text-cream hover:border-gold"
                  >
                    Sign Out / Switch Account
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-gold">
                  <Lock size={22} />
                  <h1 className="font-serif text-2xl text-cream">Sign In</h1>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-grey-soft">
                  Enter your email and password to sign in.
                </p>

                <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Full Name (Optional)</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Your Name"
                      className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full border border-gold bg-gold/10 py-3 text-xs uppercase tracking-[0.32em] text-gold transition-colors hover:bg-gold hover:text-black font-medium mt-2"
                  >
                    Sign In
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-between" style={{ background: "var(--ink)" }}>
      <CustomCursor />
      <Nav />

      <div className="mx-auto w-full max-w-[1600px] px-6 pt-36 pb-24 md:px-12">
        {/* Header toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded bg-gold/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-gold border border-gold/40">
                Authenticated Admin
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-cream">Control Panel</h1>
            </div>
            <p className="mt-2 text-xs text-grey-soft">
              Manage website content, images, practice details, contact enquiries, and user reviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Reset all stored projects, practice taglines, enquiries, and reviews to original defaults?")) {
                  resetToDefaults();
                }
              }}
              className="flex items-center gap-2 border border-border/60 bg-ink-soft px-4 py-2 text-xs uppercase tracking-[0.2em] text-grey-soft hover:text-cream hover:border-gold"
            >
              <RefreshCw size={14} /> Reset Defaults
            </button>
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-black"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex border-b border-border/60 space-x-2 overflow-x-auto">
          {[
            { id: "projects", label: "Projects & Images", count: Object.values(disciplines).reduce((acc, d) => acc + d.projects.length, 0) },
            { id: "practices", label: "Practices", count: Object.keys(disciplines).length },
            { id: "enquiries", label: "Enquiries Inbox", count: enquiries.filter((e) => e.status === "new").length },
            { id: "reviews", label: "Review Approvals", count: reviews.filter((r) => r.status === "pending").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 border-b-2 px-6 py-4 text-xs uppercase tracking-[0.25em] transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-gold text-gold font-medium"
                  : "border-transparent text-grey-soft hover:text-cream"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[9px] ${activeTab === tab.id ? "bg-gold text-black font-bold" : "bg-border text-grey-soft"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: PROJECTS & IMAGES MANAGER */}
        {activeTab === "projects" && (
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: Discipline & Projects List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-cream">Select Discipline</h2>
                <button
                  onClick={() => {
                    setEditingProjectIdx(null);
                    setProjectForm({
                      title: "",
                      location: "",
                      year: new Date().getFullYear(),
                      size: "",
                      note: "",
                      images: [],
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold hover:underline"
                >
                  <Plus size={14} /> New Project
                </button>
              </div>

              {/* Discipline Pill Selectors */}
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(disciplines) as Discipline[]).map((key) => {
                  const d = disciplines[key];
                  const isSelected = selectedDiscipline === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedDiscipline(key);
                        setEditingProjectIdx(null);
                      }}
                      className={`flex flex-col p-4 text-left border rounded-sm transition-all ${
                        isSelected ? "border-gold bg-gold/10" : "border-border/60 bg-ink-soft opacity-70 hover:opacity-100"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: d.color }}>{d.code}</span>
                      <span className="font-serif text-base text-cream mt-1">{d.label}</span>
                      <span className="text-[10px] text-grey-soft mt-2">{d.projects.length} projects</span>
                    </button>
                  );
                })}
              </div>

              {/* Project Cards List for Selected Discipline */}
              <div className="space-y-3 pt-4">
                <h3 className="text-xs uppercase tracking-[0.25em] text-grey-soft">
                  {disciplines[selectedDiscipline].label} Projects ({disciplines[selectedDiscipline].projects.length})
                </h3>

                {disciplines[selectedDiscipline].projects.map((p, idx) => {
                  const isEditing = editingProjectIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 border rounded-sm transition-colors ${
                        isEditing ? "border-gold bg-gold/10" : "border-border/60 bg-ink-soft hover:border-gold/40"
                      }`}
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gold font-mono">#{String(idx + 1).padStart(2, "0")}</span>
                          <h4 className="font-serif text-base text-cream truncate">{p.title}</h4>
                        </div>
                        <p className="text-[11px] text-grey-soft">
                          {p.location} · {p.year} · {p.images.length} images
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditProject(idx, p)}
                          className="p-2 text-grey-soft hover:text-gold"
                          title="Edit project"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${p.title}"?`)) {
                              deleteProject(selectedDiscipline, idx);
                              if (editingProjectIdx === idx) setEditingProjectIdx(null);
                            }
                          }}
                          className="p-2 text-grey-soft hover:text-red-400"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Project Form & Images Manager */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSaveProject} className="border border-border/60 bg-ink-soft p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h3 className="font-serif text-2xl text-cream">
                    {editingProjectIdx !== null ? `Edit Project #${editingProjectIdx + 1}` : "Add New Project"}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.25em] text-gold">
                    Discipline: {disciplines[selectedDiscipline].label}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Modern Villa Residence"
                      className="w-full border border-border bg-ink p-3 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      placeholder="e.g. Indiranagar, Bengaluru"
                      className="w-full border border-border bg-ink p-3 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Year</label>
                    <input
                      type="number"
                      required
                      value={projectForm.year}
                      onChange={(e) => setProjectForm({ ...projectForm, year: Number(e.target.value) })}
                      className="w-full border border-border bg-ink p-3 text-sm text-cream focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Size / Footprint</label>
                    <input
                      type="text"
                      value={projectForm.size}
                      onChange={(e) => setProjectForm({ ...projectForm, size: e.target.value })}
                      placeholder="e.g. 4,500 sqm"
                      className="w-full border border-border bg-ink p-3 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Architectural Note (Optional)</label>
                    <input
                      type="text"
                      value={projectForm.note || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, note: e.target.value })}
                      placeholder="e.g. Double height living with court"
                      className="w-full border border-border bg-ink p-3 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Images Upload & Gallery Section */}
                <div className="border-t border-border/60 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-gold">Project Images ({projectForm.images.length})</label>
                  </div>

                  {/* Add Image Inputs */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* File Upload Button */}
                    <label className="flex items-center justify-center gap-2 border border-dashed border-gold/60 bg-gold/5 p-3 cursor-pointer text-xs uppercase tracking-wider text-gold hover:bg-gold/10">
                      <ImageIcon size={16} /> Upload Image File(s)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </label>

                    {/* Image URL Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 border border-border bg-ink p-2.5 text-xs text-cream focus:border-gold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="border border-gold/60 px-3 py-2.5 text-xs text-gold hover:bg-gold hover:text-black"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Image Thumbnails List */}
                  {projectForm.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {projectForm.images.map((imgSrc, imgIdx) => (
                        <div key={imgIdx} className="group relative aspect-video border border-border bg-ink overflow-hidden">
                          <img src={imgSrc} alt={`Preview ${imgIdx + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setProjectForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== imgIdx),
                              }));
                            }}
                            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded bg-black/80 text-xs text-red-400 hover:bg-red-500 hover:text-white"
                            title="Remove image"
                          >
                            ✕
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 text-[9px] text-gold font-mono">
                            #{imgIdx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-4">
                  {editingProjectIdx !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectIdx(null);
                        setProjectForm({
                          title: "",
                          location: "",
                          year: new Date().getFullYear(),
                          size: "",
                          note: "",
                          images: [],
                        });
                      }}
                      className="px-4 py-2 text-xs uppercase tracking-wider text-grey-soft hover:text-cream"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="border border-gold bg-gold px-8 py-3 text-xs uppercase tracking-[0.28em] text-black font-semibold hover:bg-gold/90"
                  >
                    {editingProjectIdx !== null ? "Save Project Changes" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PRACTICES MANAGER */}
        {activeTab === "practices" && (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {(Object.keys(disciplines) as Discipline[]).map((key) => {
              const d = disciplines[key];
              const isEditing = practiceEditingKey === key;
              return (
                <div key={key} className="border border-border/60 bg-ink-soft p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm" style={{ color: d.color }}>{d.code}</span>
                      <h3 className="font-serif text-2xl text-cream">{d.label}</h3>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => startEditPractice(key)}
                        className="flex items-center gap-1 text-xs uppercase tracking-wider text-gold hover:underline"
                      >
                        <Edit3 size={14} /> Edit Practice
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSavePractice} className="space-y-4 pt-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Tagline / Description</label>
                        <textarea
                          rows={3}
                          value={practiceForm.tagline}
                          onChange={(e) => setPracticeForm({ ...practiceForm, tagline: e.target.value })}
                          className="w-full border border-border bg-ink p-3 text-xs text-cream focus:border-gold focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Short Code</label>
                          <input
                            type="text"
                            value={practiceForm.code}
                            onChange={(e) => setPracticeForm({ ...practiceForm, code: e.target.value })}
                            className="w-full border border-border bg-ink p-2.5 text-xs text-cream focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Color Code (Hex)</label>
                          <input
                            type="text"
                            value={practiceForm.color}
                            onChange={(e) => setPracticeForm({ ...practiceForm, color: e.target.value })}
                            className="w-full border border-border bg-ink p-2.5 text-xs text-cream focus:border-gold focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setPracticeEditingKey(null)}
                          className="px-3 py-1.5 text-xs text-grey-soft hover:text-cream"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="border border-gold bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-wider text-gold hover:bg-gold hover:text-black"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-light text-grey-soft leading-relaxed">{d.tagline}</p>
                      <div className="flex items-center gap-6 pt-2 text-xs text-grey">
                        <span>Projects Count: <strong className="text-cream">{d.projects.length}</strong></span>
                        <span>Theme Color: <span className="font-mono text-cream" style={{ color: d.color }}>{d.color}</span></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: ENQUIRIES INBOX */}
        {activeTab === "enquiries" && (
          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-cream">Client Enquiries ({enquiries.length})</h2>
            </div>

            {enquiries.length === 0 ? (
              <p className="text-sm text-grey-soft py-12 text-center border border-border/40 bg-ink-soft">
                No enquiries received yet.
              </p>
            ) : (
              <div className="space-y-4">
                {enquiries.map((e) => (
                  <div
                    key={e.id}
                    className={`border p-6 rounded-sm space-y-3 transition-colors ${
                      e.status === "new"
                        ? "border-gold/60 bg-gold/5"
                        : "border-border/60 bg-ink-soft opacity-85"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider ${e.status === "new" ? "bg-gold text-black font-bold" : "bg-border text-grey-soft"}`}>
                          {e.status}
                        </span>
                        <h3 className="font-serif text-lg text-cream">{e.name}</h3>
                        <span className="text-xs text-gold font-mono">{e.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {e.status === "new" && (
                          <button
                            onClick={() => updateEnquiryStatus(e.id, "read")}
                            className="px-3 py-1 text-xs border border-border text-grey-soft hover:text-cream hover:border-gold"
                          >
                            Mark Read
                          </button>
                        )}
                        <a
                          href={`mailto:${e.email}?subject=Re: Paper %26 Pencil Enquiry - ${encodeURIComponent(e.project)}`}
                          className="flex items-center gap-1.5 px-3 py-1 text-xs border border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-black"
                        >
                          <Mail size={12} /> Reply
                        </a>
                        <button
                          onClick={() => deleteEnquiry(e.id)}
                          className="p-1.5 text-grey-soft hover:text-red-400"
                          title="Delete enquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 text-xs text-grey-soft">
                      <p><strong>Project Type:</strong> {e.project || "General Enquiry"}</p>
                      <p className="text-right"><strong>Date:</strong> {new Date(e.createdAt).toLocaleString()}</p>
                    </div>

                    <p className="text-sm font-light leading-relaxed text-cream/90 bg-ink p-4 border border-border/40">
                      “{e.message}”
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === "reviews" && (
          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-cream">Review Approvals & Moderation ({reviews.length})</h2>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-grey-soft py-12 text-center border border-border/40 bg-ink-soft">
                No user reviews submitted yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className={`border p-6 rounded-sm space-y-4 flex flex-col justify-between ${
                      r.status === "pending"
                        ? "border-gold bg-gold/10"
                        : r.status === "approved"
                        ? "border-border/60 bg-ink-soft"
                        : "border-red-900/40 bg-red-950/20 opacity-60"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold ${
                            r.status === "approved"
                              ? "bg-green-950 text-green-400 border border-green-800"
                              : r.status === "pending"
                              ? "bg-gold text-black"
                              : "bg-red-950 text-red-400 border border-red-800"
                          }`}
                        >
                          {r.status}
                        </span>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= r.rating ? "fill-gold text-gold" : "text-grey-soft/30"}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="font-serif text-base text-cream leading-relaxed">“{r.testimonial}”</p>

                      <div className="text-xs text-grey-soft">
                        <p className="text-cream font-medium">— {r.by}</p>
                        {r.roleCompany && <p className="text-[10px] uppercase tracking-wider text-gold mt-0.5">{r.roleCompany}</p>}
                        {r.email && <p className="text-[10px] text-grey/60 mt-0.5">{r.email}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
                      {r.status !== "approved" && (
                        <button
                          onClick={() => updateReviewStatus(r.id, "approved")}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-700 text-white hover:bg-green-600 rounded-xs font-medium"
                        >
                          <Check size={14} /> Approve & Publish
                        </button>
                      )}

                      {r.status !== "rejected" && (
                        <button
                          onClick={() => updateReviewStatus(r.id, "rejected")}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border text-grey-soft hover:text-cream"
                        >
                          <X size={14} /> Reject
                        </button>
                      )}

                      <button
                        onClick={() => deleteReview(r.id)}
                        className="p-1.5 text-grey-soft hover:text-red-400"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
