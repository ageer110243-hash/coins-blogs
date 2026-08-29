import { useRef, useState } from "react";
import { ImagePlus, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { SINDH_CITIES, POST_CATEGORIES } from "../constants/index.js";

const CITY_OPTIONS = SINDH_CITIES.filter((c) => c !== "All Cities");
const CATEGORY_OPTIONS = POST_CATEGORIES.filter((c) => c !== "All");

const emptyUniversity = {
  programs: "",
  eligibility: "",
  admissionStart: "",
  admissionDeadline: "",
  fee: "",
  requiredDocuments: "",
  howToApply: "",
  applicationLink: "",
};
const emptyAcademy = { courses: "", courseDuration: "", fee: "", timings: "", admissionInfo: "" };
const emptyBusiness = { businessCategory: "", services: "", openingHours: "" };

const emptyContact = { phone: "", email: "", address: "", website: "" };

// Turns a Date/ISO-string/null into the "YYYY-MM-DD" shape <input type="date">
// expects. Anything unparseable just becomes an empty string.
function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// Builds the form's initial state from an existing post (edit mode) or
// empty defaults (create mode).
function buildInitialState(post) {
  if (!post) {
    return {
      title: "",
      description: "",
      category: "General",
      city: CITY_OPTIONS[0],
      organizationName: "",
      imagePreview: "",
      contact: emptyContact,
      university: emptyUniversity,
      academy: emptyAcademy,
      business: emptyBusiness,
    };
  }
  return {
    title: post.title || "",
    description: post.description || "",
    category: post.category || "General",
    city: post.city || CITY_OPTIONS[0],
    organizationName: post.organizationName || "",
    imagePreview: post.image || "",
    contact: { ...emptyContact, ...post.contact },
    university: {
      ...emptyUniversity,
      ...post.university,
      admissionStart: toDateInputValue(post.university?.admissionStart),
      admissionDeadline: toDateInputValue(post.university?.admissionDeadline),
    },
    academy: { ...emptyAcademy, ...post.academy },
    business: { ...emptyBusiness, ...post.business },
  };
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal-soft"
      />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <textarea
        {...props}
        className="mt-1 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal-soft"
      />
    </label>
  );
}

// Shared by /create-post (regular users), the admin panel's "Create Post"
// tab, and the admin panel's "Edit Post" flow (pass the existing post as
// `initialPost` to prefill every field, including its current image).
// onSubmit receives the same payload shape the /api/posts endpoint
// expects; the caller decides what happens after (navigate, refresh a
// list, close a modal, etc).
function PostForm({ onSubmit, isSaving, submitLabel = "Publish Post", initialPost = null }) {
  const fileInputRef = useRef(null);
  const initial = buildInitialState(initialPost);

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [category, setCategory] = useState(initial.category);
  const [city, setCity] = useState(initial.city);
  const [organizationName, setOrganizationName] = useState(initial.organizationName);
  const [imagePreview, setImagePreview] = useState(initial.imagePreview);
  const [imageData, setImageData] = useState(""); // only set when a NEW file is picked

  const [contact, setContact] = useState(initial.contact);
  const [university, setUniversity] = useState(initial.university);
  const [academy, setAcademy] = useState(initial.academy);
  const [business, setBusiness] = useState(initial.business);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    const fresh = buildInitialState(null);
    setTitle(fresh.title);
    setDescription(fresh.description);
    setCategory(fresh.category);
    setCity(fresh.city);
    setOrganizationName(fresh.organizationName);
    setImagePreview(fresh.imagePreview);
    setImageData("");
    setContact(fresh.contact);
    setUniversity(fresh.university);
    setAcademy(fresh.academy);
    setBusiness(fresh.business);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !city) {
      toast.error("Title, description and city are required");
      return;
    }

    const payload = {
      title,
      description,
      category,
      city,
      organizationName,
      image: imageData || undefined, // omit unless a new image was picked — edit mode keeps the existing one
      contact,
    };
    if (category === "University" || category === "Admission") payload.university = university;
    if (category === "Academy") payload.academy = academy;
    if (category === "Business") payload.business = business;

    const result = await onSubmit(payload);
    // Only clear the form back to blank in "create" mode — an edit should
    // leave the (now-saved) values visible rather than wiping them.
    if (result && !initialPost) resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image */}
      <div>
        <span className="text-sm font-medium text-ink-soft">Image</span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-1 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-panel-soft transition hover:border-signal hover:bg-signal-soft/40"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1.5 text-ink-faint">
              <ImagePlus size={22} />
              <span className="text-xs">Click to upload an image</span>
            </span>
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
      </div>

      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Admissions Open at XYZ University" required />
      <Textarea label="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short summary of the post" required />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink-soft">Category / Type</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal-soft">
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-soft">City</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal-soft">
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <Input label="Organization Name (optional)" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="e.g. XYZ University" />

      {/* Category-specific fields */}
      {(category === "University" || category === "Admission") && (
        <div className="animate-fade-in-up space-y-4 rounded-xl border border-line bg-panel-soft p-4">
          <p className="text-sm font-semibold text-ink">
            {category === "Admission" ? "Admission Details" : "University Details"}
          </p>
          <Textarea label="Programs" rows={2} value={university.programs} onChange={(e) => setUniversity({ ...university, programs: e.target.value })} placeholder="e.g. BS Computer Science, BBA" />
          <Textarea label="Eligibility" rows={2} value={university.eligibility} onChange={(e) => setUniversity({ ...university, eligibility: e.target.value })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Admission Start Date" type="date" value={university.admissionStart} onChange={(e) => setUniversity({ ...university, admissionStart: e.target.value })} />
            <Input label="Admission Deadline" type="date" value={university.admissionDeadline} onChange={(e) => setUniversity({ ...university, admissionDeadline: e.target.value })} />
          </div>
          <Input label="Fee" value={university.fee} onChange={(e) => setUniversity({ ...university, fee: e.target.value })} placeholder="e.g. PKR 60,000/semester" />
          <Textarea label="Required Documents" rows={2} value={university.requiredDocuments} onChange={(e) => setUniversity({ ...university, requiredDocuments: e.target.value })} />
          <Textarea label="How to Apply (one step per line)" rows={4} value={university.howToApply} onChange={(e) => setUniversity({ ...university, howToApply: e.target.value })} placeholder={"Visit application website\nCreate account\nFill application form\nUpload documents\nSubmit application"} />
          <Input label="Application Link" type="url" value={university.applicationLink} onChange={(e) => setUniversity({ ...university, applicationLink: e.target.value })} placeholder="https://" />
        </div>
      )}

      {category === "Academy" && (
        <div className="animate-fade-in-up space-y-4 rounded-xl border border-line bg-panel-soft p-4">
          <p className="text-sm font-semibold text-ink">Academy Details</p>
          <Textarea label="Courses" rows={2} value={academy.courses} onChange={(e) => setAcademy({ ...academy, courses: e.target.value })} />
          <Input label="Course Duration" value={academy.courseDuration} onChange={(e) => setAcademy({ ...academy, courseDuration: e.target.value })} placeholder="e.g. 6 months" />
          <Input label="Fee" value={academy.fee} onChange={(e) => setAcademy({ ...academy, fee: e.target.value })} />
          <Input label="Timings" value={academy.timings} onChange={(e) => setAcademy({ ...academy, timings: e.target.value })} placeholder="e.g. Mon–Fri, 5–7 PM" />
          <Textarea label="Admission / Enrollment Info" rows={2} value={academy.admissionInfo} onChange={(e) => setAcademy({ ...academy, admissionInfo: e.target.value })} />
        </div>
      )}

      {category === "Business" && (
        <div className="animate-fade-in-up space-y-4 rounded-xl border border-line bg-panel-soft p-4">
          <p className="text-sm font-semibold text-ink">Business Details</p>
          <Input label="Business Category" value={business.businessCategory} onChange={(e) => setBusiness({ ...business, businessCategory: e.target.value })} placeholder="e.g. Restaurant, Electronics" />
          <Textarea label="Services" rows={2} value={business.services} onChange={(e) => setBusiness({ ...business, services: e.target.value })} />
          <Input label="Opening Hours" value={business.openingHours} onChange={(e) => setBusiness({ ...business, openingHours: e.target.value })} placeholder="e.g. 9 AM – 10 PM" />
        </div>
      )}

      {/* Contact */}
      <div className="space-y-4 rounded-xl border border-line bg-panel-soft p-4">
        <p className="text-sm font-semibold text-ink">Contact Information (optional)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          <Input label="Email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
        </div>
        <Input label="Address" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
        <Input label="Website" type="url" value={contact.website} onChange={(e) => setContact({ ...contact, website: e.target.value })} placeholder="https://" />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="btn-press brand-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md disabled:opacity-60"
      >
        {isSaving ? <Loader size={16} className="animate-spin" /> : null}
        {isSaving ? "Publishing..." : submitLabel}
      </button>
    </form>
  );
}

export default PostForm;
