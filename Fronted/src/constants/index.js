// Sindh cities shown in the Explore page's city filter and the Create
// Post form. "All Cities" is the default/no-filter option.
export const SINDH_CITIES = [
  "All Cities",
  "Karachi",
  "Hyderabad",
  "Shaheed Benazirabad / Nawabshah",
  "Sukkur",
  "Larkana",
  "Mirpurkhas",
  "Jamshoro",
  "Matiari",
  "Tando Allahyar",
  "Tando Adam",
  "Sanghar",
  "Dadu",
  "Thatta",
  "Badin",
  "Khairpur",
  "Ghotki",
  "Jacobabad",
  "Shikarpur",
  "Umerkot",
  "Tharparkar",
];

// Post category / type — used for the Explore filter bar and as the
// discriminator that decides which extra detail block (university /
// academy / business) a post's form and detail page show.
export const POST_CATEGORIES = [
  "All",
  "University",
  "Academy",
  "Business",
  "Admission",
  "Jobs",
  "Events",
  "General",
];

// Categories that get their own dedicated "organization" detail block on
// the post form and detail page. Everything else in POST_CATEGORIES is a
// plain post (title/description/image/contact only).
export const ORG_CATEGORIES = ["University", "Academy", "Business"];

// Temporary front-end-only data. Replace with real API responses once
// Backend/src/controllers + Backend/src/models are implemented.

export const DUMMY_CONTACTS = [
  {
    _id: "1",
    fullName: "Areeba Khan",
    profilePic: "",
    online: true,
  },
  {
    _id: "2",
    fullName: "Hamza Sheikh",
    profilePic: "",
    online: true,
  },
  {
    _id: "3",
    fullName: "Wania Baig",
    profilePic: "",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 42),
  },
  {
    _id: "4",
    fullName: "Talha Rasheed",
    profilePic: "",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    _id: "5",
    fullName: "Sana Iqbal",
    profilePic: "",
    online: true,
  },
];

// Extra profile fields used only by the admin dashboard demo below.
export const DUMMY_USERS = DUMMY_CONTACTS.map((c, i) => ({
  ...c,
  email: `${c.fullName.split(" ")[0].toLowerCase()}@chatwithme.app`,
  role: i === 0 ? "admin" : "member",
  status: i === 3 ? "suspended" : "active",
  joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (30 + i * 17)),
  messagesSent: [42, 128, 17, 5, 63][i] ?? 20,
}));

// Messages sent per day, last 7 days — feeds the dashboard mini bar chart.
export const WEEKLY_MESSAGE_ACTIVITY = [
  { label: "Mon", value: 38 },
  { label: "Tue", value: 52 },
  { label: "Wed", value: 41 },
  { label: "Thu", value: 67 },
  { label: "Fri", value: 74 },
  { label: "Sat", value: 30 },
  { label: "Sun", value: 45 },
];

export const DUMMY_MESSAGES = {
  1: [
    {
      _id: "m1",
      senderId: "1",
      text: "Salam! AU.SHOP ka deployment fix ho gaya?",
      createdAt: new Date(Date.now() - 1000 * 60 * 40),
    },
    {
      _id: "m2",
      senderId: "me",
      text: "Ho gaya bhai, Railway pe chal raha hai ab smoothly.",
      createdAt: new Date(Date.now() - 1000 * 60 * 38),
    },
    {
      _id: "m3",
      senderId: "1",
      text: "Zabardast! Demo kab dena hai professor ko?",
      createdAt: new Date(Date.now() - 1000 * 60 * 35),
    },
  ],
  2: [
    {
      _id: "m4",
      senderId: "2",
      text: "Code Sikho ka naya video dekha maine, mast tha.",
      createdAt: new Date(Date.now() - 1000 * 60 * 120),
    },
  ],
};
