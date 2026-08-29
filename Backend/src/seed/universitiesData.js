// Seed data for University-category posts across five Sindh cities, plus a
// small set of Admission-category posts for cycles that were verifiably
// open at the time this was written (late August 2026).
//
// Every entry below is limited to facts that are stable and easy to verify
// independently (institution name, city, public/private status, broad
// field of study, and the institution's own website) — deliberately
// nothing about fees, exact eligibility percentages, or addresses, since
// those change often and stating them without a fresh, confirmed source
// would risk publishing wrong information on a live site.
//
// `applicationLink` points at each university's own site/admissions page,
// not a third-party aggregator — so whoever reads the post always lands
// on the authoritative source for anything time-sensitive.

export const UNIVERSITIES = [
  // ---------------------------------------------------------------- Karachi
  {
    title: "University of Karachi (UoK)",
    city: "Karachi",
    organizationName: "University of Karachi",
    description:
      "One of Pakistan's largest public universities, offering undergraduate, graduate and postgraduate programs across sciences, arts, business, law and pharmacy.",
    programs: "Sciences, Arts & Humanities, Business Administration, Law, Pharmacy, Social Sciences",
    website: "https://uok.edu.pk",
  },
  {
    title: "NED University of Engineering & Technology",
    city: "Karachi",
    organizationName: "NED University of Engineering & Technology",
    description:
      "A public-sector engineering university and one of the oldest engineering institutions in Pakistan, known for its Civil, Electrical, Mechanical and Computer Science programs.",
    programs: "Civil, Electrical, Mechanical, Computer Science & Software Engineering",
    website: "https://neduet.edu.pk",
  },
  {
    title: "Dow University of Health Sciences (DUHS)",
    city: "Karachi",
    organizationName: "Dow University of Health Sciences",
    description:
      "A public medical university offering MBBS, BDS and a wide range of allied health sciences, nursing and postgraduate medical programs.",
    programs: "MBBS, BDS, Pharm-D, Nursing, Allied Health Sciences",
    website: "https://www.duhs.edu.pk",
  },
  {
    title: "Sindh Madressatul Islam University (SMIU)",
    city: "Karachi",
    organizationName: "Sindh Madressatul Islam University",
    description:
      "A historic public university in Karachi with programs in business, computer science, media studies and the humanities.",
    programs: "Business Administration, Computer Science, Media Studies, Humanities",
    website: "https://smiu.edu.pk",
  },
  {
    title: "Jinnah Sindh Medical University (JSMU)",
    city: "Karachi",
    organizationName: "Jinnah Sindh Medical University",
    description:
      "A public medical university affiliated with Jinnah Postgraduate Medical Centre, offering MBBS, BDS and postgraduate medical education.",
    programs: "MBBS, BDS, Postgraduate Medical Programs",
    website: "https://jsmu.edu.pk",
  },
  {
    title: "Institute of Business Administration (IBA), Karachi",
    city: "Karachi",
    organizationName: "Institute of Business Administration, Karachi",
    description:
      "One of Pakistan's oldest and most respected business schools, offering undergraduate and graduate programs in business, economics, computer science and social sciences.",
    programs: "BBA, MBA, Economics, Computer Science, Social Sciences",
    website: "https://www.iba.edu.pk",
  },
  {
    title: "FAST – National University of Computer & Emerging Sciences, Karachi",
    city: "Karachi",
    organizationName: "FAST-NUCES, Karachi Campus",
    description:
      "A private, federally chartered university known for computer science, software and electrical engineering, and business programs.",
    programs: "Computer Science, Software Engineering, Electrical Engineering, Business",
    website: "https://nu.edu.pk",
  },
  {
    title: "Bahria University, Karachi Campus",
    city: "Karachi",
    organizationName: "Bahria University, Karachi Campus",
    description:
      "A well-established university offering programs in engineering, computer science, management and social sciences.",
    programs: "Engineering, Computer Science, Management Sciences, Social Sciences",
    website: "https://www.bahria.edu.pk",
  },
  {
    title: "SZABIST, Karachi Campus",
    city: "Karachi",
    organizationName: "Shaheed Zulfiqar Ali Bhutto Institute of Science & Technology",
    description:
      "A private university offering programs in management sciences, computer science, media sciences, and social sciences.",
    programs: "Management Sciences, Computer Science, Media Sciences, Social Sciences",
    website: "https://karachi.szabist.edu.pk",
  },
  {
    title: "Iqra University",
    city: "Karachi",
    organizationName: "Iqra University",
    description:
      "A private university offering business, computing and media programs, recognized internationally in QS rankings.",
    programs: "Business, Computing, Media Sciences",
    website: "https://www.iqra.edu.pk",
  },
  {
    title: "Hamdard University",
    city: "Karachi",
    organizationName: "Hamdard University",
    description:
      "A private university with a strong focus on Eastern medicine, pharmacy, and health sciences, alongside engineering and business programs.",
    programs: "Eastern Medicine, Pharmacy, Health Sciences, Engineering, Business",
    website: "https://hamdard.edu.pk",
  },
  {
    title: "Aga Khan University (AKU)",
    city: "Karachi",
    organizationName: "Aga Khan University",
    description:
      "An internationally recognized private university known for its medical college, school of nursing & midwifery, and health sciences research.",
    programs: "Medicine (MBBS), Nursing & Midwifery, Health Sciences",
    website: "https://www.aku.edu",
  },
  {
    title: "DHA Suffa University",
    city: "Karachi",
    organizationName: "DHA Suffa University",
    description:
      "A private university offering programs in engineering, computer science, business and social sciences.",
    programs: "Engineering, Computer Science, Business Administration",
    website: "https://dsu.edu.pk",
  },
  {
    title: "Muhammad Ali Jinnah University (MAJU)",
    city: "Karachi",
    organizationName: "Muhammad Ali Jinnah University",
    description:
      "A private university offering computer science, engineering, business and media sciences programs.",
    programs: "Computer Science, Engineering, Business, Media Sciences",
    website: "https://jinnah.edu.pk",
  },
  {
    title: "PAF-Karachi Institute of Economics & Technology (PAF-KIET)",
    city: "Karachi",
    organizationName: "PAF-Karachi Institute of Economics & Technology",
    description:
      "A private university offering engineering, computer science and business programs.",
    programs: "Engineering, Computer Science, Business Administration",
    website: "https://www.pafkiet.edu.pk",
  },
  {
    title: "Sir Syed University of Engineering & Technology",
    city: "Karachi",
    organizationName: "Sir Syed University of Engineering & Technology",
    description:
      "A private engineering university offering programs in civil, electrical, computer, and telecommunication engineering.",
    programs: "Civil, Electrical, Computer & Telecommunication Engineering",
    website: "https://ssuet.edu.pk",
  },

  // -------------------------------------------------------------- Hyderabad
  {
    title: "Government College University, Hyderabad (GCUH)",
    city: "Hyderabad",
    organizationName: "Government College University, Hyderabad",
    description:
      "A public university in Hyderabad offering undergraduate and graduate programs across sciences, arts and commerce.",
    programs: "Sciences, Arts, Commerce",
    website: "",
  },
  {
    title: "Isra University",
    city: "Hyderabad",
    organizationName: "Isra University",
    description:
      "A private university in Hyderabad known for its medical college and programs in health sciences, engineering and management.",
    programs: "Medicine (MBBS), Health Sciences, Engineering, Management",
    website: "https://isra.edu.pk",
  },
  {
    title: "University of Sindh, Elsa Kazi Campus, Hyderabad",
    city: "Hyderabad",
    organizationName: "University of Sindh – Elsa Kazi Campus",
    description:
      "The Hyderabad campus of the public University of Sindh, offering programs including Law and English Language & Literature.",
    programs: "LL.B. (Honours), BS English Language & Literature",
    website: "https://usindh.edu.pk",
  },
  {
    title: "Sindh Agriculture University, Tandojam (Hyderabad)",
    city: "Hyderabad",
    organizationName: "Sindh Agriculture University",
    description:
      "A public agricultural university serving the Hyderabad region, offering programs in agriculture, veterinary sciences and related fields.",
    programs: "Agriculture, Veterinary Sciences, Agricultural Engineering",
    website: "https://sau.edu.pk",
  },
  {
    title: "SZABIST, Hyderabad Campus",
    city: "Hyderabad",
    organizationName: "SZABIST, Hyderabad Campus",
    description:
      "A branch campus of SZABIST offering management sciences and computer science programs in Hyderabad.",
    programs: "Management Sciences, Computer Science",
    website: "https://karachi.szabist.edu.pk",
  },
  {
    title: "National University of Modern Languages (NUML), Hyderabad Campus",
    city: "Hyderabad",
    organizationName: "NUML, Hyderabad Campus",
    description:
      "A branch campus of the public National University of Modern Languages, offering programs in languages, management and computer science.",
    programs: "Languages, Business Administration, Computer Science",
    website: "https://numl.edu.pk",
  },

  // ---------------------------------------------------------------- Jamshoro
  {
    title: "University of Sindh, Jamshoro",
    city: "Jamshoro",
    organizationName: "University of Sindh",
    description:
      "The oldest university in Pakistan (established 1947), offering a wide range of Bachelor's, Master's and PhD programs across faculties of Arts, Sciences, Commerce, Law, Social Sciences and more.",
    programs: "Arts & Humanities, Natural Sciences, Commerce, Law, Social Sciences, Engineering & Technology",
    website: "https://usindh.edu.pk",
  },
  {
    title: "Mehran University of Engineering & Technology (MUET)",
    city: "Jamshoro",
    organizationName: "Mehran University of Engineering & Technology",
    description:
      "The premier public engineering university of Sindh, offering undergraduate and postgraduate programs across multiple engineering, architecture and computing disciplines.",
    programs: "Civil, Mechanical, Electrical, Software & Computer Engineering, Architecture",
    website: "https://www.muet.edu.pk",
  },
  {
    title: "Liaquat University of Medical & Health Sciences (LUMHS)",
    city: "Jamshoro",
    organizationName: "Liaquat University of Medical & Health Sciences",
    description:
      "A public medical university offering MBBS, BDS, and a range of allied health sciences and postgraduate medical programs.",
    programs: "MBBS, BDS, Pharm-D, Nursing, Allied Health Sciences",
    website: "https://www.lumhs.edu.pk",
  },
  {
    title: "Shaheed Allah Bux Soomro University of Art, Design & Heritages",
    city: "Jamshoro",
    organizationName: "Shaheed Allah Bux Soomro University of Art, Design & Heritages",
    description:
      "A public university in Jamshoro focused on fine arts, design and the preservation of Sindh's cultural heritage.",
    programs: "Fine Arts, Design, Cultural Heritage Studies",
    website: "",
  },

  // --------------------------------------------------------------- Nawabshah
  {
    title: "Shaheed Benazir Bhutto University, Shaheed Benazirabad (SBBU)",
    city: "Shaheed Benazirabad / Nawabshah",
    organizationName: "Shaheed Benazir Bhutto University, Shaheed Benazirabad",
    description:
      "A public-sector university in Nawabshah offering undergraduate and graduate programs across sciences, IT, business and social sciences, with additional campuses in Sanghar and Naushahro Feroze.",
    programs: "Computer Science & IT, Business Administration, Natural Sciences, Social Sciences",
    website: "https://www.sbbusba.edu.pk",
  },
  {
    title: "People's University of Medical & Health Sciences for Women (PUMHSW)",
    city: "Shaheed Benazirabad / Nawabshah",
    organizationName: "People's University of Medical & Health Sciences for Women",
    description:
      "A public medical university dedicated to women's medical education, offering MBBS and allied health sciences programs.",
    programs: "MBBS, Allied Health Sciences",
    website: "https://pumhs.edu.pk",
  },
  {
    title: "Shaheed Benazir Bhutto University of Veterinary & Animal Sciences",
    city: "Shaheed Benazirabad / Nawabshah",
    organizationName: "Shaheed Benazir Bhutto University of Veterinary & Animal Sciences",
    description:
      "A public university near Nawabshah dedicated to veterinary and animal sciences education.",
    programs: "Veterinary Sciences, Animal Sciences",
    website: "",
  },

  // ------------------------------------------------------------------ Sukkur
  {
    title: "Sukkur IBA University",
    city: "Sukkur",
    organizationName: "Sukkur IBA University",
    description:
      "A public-sector university chartered by the Government of Sindh, well regarded for business administration, computer science and engineering programs, with a network of community college campuses across upper Sindh.",
    programs: "BBA, Computer Science, Software & Electrical Engineering, Mathematics, Education",
    website: "https://www.iba-suk.edu.pk",
  },
  {
    title: "The Begum Nusrat Bhutto Women University, Sukkur",
    city: "Sukkur",
    organizationName: "The Begum Nusrat Bhutto Women University",
    description:
      "A public women's university in Sukkur offering undergraduate and graduate programs across sciences, arts and business.",
    programs: "Sciences, Arts, Business Administration",
    website: "",
  },
  {
    title: "Ziauddin University, Sukkur Campus",
    city: "Sukkur",
    organizationName: "Ziauddin University, Sukkur Campus",
    description:
      "A branch campus of the private Ziauddin University, offering health sciences and other professional programs in Sukkur.",
    programs: "Health Sciences",
    website: "https://zu.edu.pk",
  },
];

// Admission-category posts — kept intentionally short. Each one here was
// checked directly against the university's own admissions site/PDF at
// the time of writing (late August 2026), not a third-party aggregator.
export const ADMISSIONS = [
  {
    title: "Admissions Open 2027 — University of Sindh (Bachelor's, BS 3rd Year & Master's)",
    city: "Jamshoro",
    organizationName: "University of Sindh",
    description:
      "The University of Sindh has opened online registration for Bachelor's, BS (3rd Year/5th Semester) and Master's degree programs for the 2027 academic session, across its Jamshoro main campus, Elsa Kazi Campus (Hyderabad), and other constituent campuses. A pre-entry test is mandatory for Bachelor's degree programs. Always confirm the latest schedule on the official admissions portal before applying, as dates can be revised.",
    programs:
      "Bachelor's & Master's programs across Arts, Commerce & Business Administration, Education, Engineering & Technology, Islamic Studies, Natural Sciences, Pharmacy, Social Sciences, and Law (LL.B. Honours at Jamshoro & Elsa Kazi Campus Hyderabad)",
    eligibility:
      "As per each program's HEC/university criteria — see the official prospectus for exact requirements per faculty.",
    admissionStart: "2026-08-10",
    admissionDeadline: "2026-09-11",
    requiredDocuments:
      "Matric/Intermediate (or equivalent) certificates, CNIC/B-Form, recent photographs — full list in the official prospectus.",
    howToApply:
      "Register at the University of Sindh Admissions Portal (admission.usindh.edu.pk)\nDownload the Rs. 3,000 application processing fee challan\nPay the fee at any HBL branch or a supported digital wallet\nComplete and submit your online application before the last date\nAppear in the Pre-Entry Test (Bachelor's: 4 & 11 Oct 2026; LL.M: 1 Nov 2026)",
    applicationLink: "https://admission.usindh.edu.pk/admission/",
  },
];
