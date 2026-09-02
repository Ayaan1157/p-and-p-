import { useState, useEffect, useMemo } from "react";
import { disciplines as defaultDisciplines, type Discipline, type Project } from "@/data/work";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  project: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "archived";
};

export type Review = {
  id: string;
  by: string;
  roleCompany?: string;
  email?: string;
  rating: number; // 1 to 5
  testimonial: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
};

export type UserSession = {
  name: string;
  email: string;
  roleCompany?: string;
};

export type DisciplinesData = typeof defaultDisciplines;

const STORAGE_KEYS = {
  DISCIPLINES: "pap_disciplines_v1",
  ENQUIRIES: "pap_enquiries_v1",
  REVIEWS: "pap_reviews_v1",
  ADMIN_AUTH: "pap_admin_auth_v1",
  USER_AUTH: "pap_user_auth_v1",
};

const initialReviews: Review[] = [
  {
    id: "rev-1",
    by: "Rahul Joshi",
    roleCompany: "Google Review",
    rating: 5,
    testimonial:
      "We had an amazing experience working with Sharath. His creativity, attention to detail, and ability to understand our vision were truly exceptional. Sharath and his team transformed our house into a beautiful, functional, and personalized home.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-2",
    by: "Shwetha Rao",
    roleCompany: "Local Guide",
    rating: 5,
    testimonial:
      "Highly appreciate Sharath's exceptional design skills. His team is efficient in executing the project. They made the process smooth and stress-free, considering my requirement.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-3",
    by: "Anandkumar Venkataraman",
    roleCompany: "Google Review",
    rating: 5,
    testimonial:
      "Sharath and his team did an excellent, awesome job. On time delivery as promised and thereby exceeding customer expectations. Kudos, will definitely recommend.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-4",
    by: "Shruthi Iyer",
    roleCompany: "Google Review",
    rating: 5,
    testimonial:
      "One of the best architects you can find in Bengaluru. Very nice and interesting designs.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-5",
    by: "Shekar",
    roleCompany: "Google Review",
    rating: 5,
    testimonial: "Good and finest architect with great sense of detailing.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-6",
    by: "Sachin Ravikumar",
    roleCompany: "Google Review",
    rating: 5,
    testimonial: "Simply superb.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
];

const initialEnquiries: Enquiry[] = [
  {
    id: "enq-1",
    name: "Vikram Malhotra",
    email: "vikram@example.com",
    project: "Commercial / Boutique Office",
    message: "Looking for an interior architecture consultation for our 3,000 sq ft workspace in Indiranagar.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "new",
  },
];

// Helper to safely load JSON from localStorage
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

// Helper to safely save JSON to localStorage
function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("pap_store_update"));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// React Hook to subscribe to app store state changes
export function useAppStore() {
  const [disciplines, setDisciplines] = useState<DisciplinesData>(() =>
    getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines)
  );

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() =>
    getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries)
  );

  const [reviews, setReviews] = useState<Review[]>(() =>
    getStored<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews)
  );

  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    getStored<boolean>(STORAGE_KEYS.ADMIN_AUTH, false)
  );

  const [userSession, setUserSession] = useState<UserSession | null>(() =>
    getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setDisciplines(getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines));
      setEnquiries(getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries));
      setReviews(getStored<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews));
      setIsAdmin(getStored<boolean>(STORAGE_KEYS.ADMIN_AUTH, false));
      setUserSession(getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null));
    };

    window.addEventListener("pap_store_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("pap_store_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const approvedReviews = useMemo(
    () => reviews.filter((r) => r.status === "approved"),
    [reviews]
  );

  const pendingReviews = useMemo(
    () => reviews.filter((r) => r.status === "pending"),
    [reviews]
  );

  // Actions
  const ADMIN_EMAILS = [
    "studio.paperandpencil@gmail.com",
    "admin@paperandpencil.com",
    "admin",
    "shwetha@paperandpencil.com",
    "sharath@paperandpencil.com",
    "ayaanwann@gmail.com",
  ];

  const loginWithEmailPassword = (email: string, password?: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if the email matches admin credentials
    const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.startsWith("admin");
    const isCorrectPassword = !password || password === "admin123" || password === "admin" || password === "123456789";

    if (isAdminEmail && isCorrectPassword) {
      setStored(STORAGE_KEYS.ADMIN_AUTH, true);
      const session: UserSession = {
        name: name?.trim() || "Paper & Pencil Admin",
        email: cleanEmail,
        roleCompany: "Studio Administrator",
      };
      setStored(STORAGE_KEYS.USER_AUTH, session);
      return { success: true, isAdmin: true };
    } else {
      // Normal user sign in
      setStored(STORAGE_KEYS.ADMIN_AUTH, false);
      const session: UserSession = {
        name: name?.trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        roleCompany: "Client Reviewer",
      };
      setStored(STORAGE_KEYS.USER_AUTH, session);
      return { success: true, isAdmin: false };
    }
  };

  const loginAdmin = (password: string): boolean => {
    if (password === "admin123" || password === "admin" || password === "123456789") {
      setStored(STORAGE_KEYS.ADMIN_AUTH, true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setStored(STORAGE_KEYS.ADMIN_AUTH, false);
  };

  const loginUser = (session: UserSession) => {
    setStored(STORAGE_KEYS.USER_AUTH, session);
  };

  const logoutUser = () => {
    setStored(STORAGE_KEYS.ADMIN_AUTH, false);
    setStored(STORAGE_KEYS.USER_AUTH, null);
  };

  const addEnquiry = (enquiry: Omit<Enquiry, "id" | "createdAt" | "status">) => {
    const current = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries);
    const newEnq: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    setStored(STORAGE_KEYS.ENQUIRIES, [newEnq, ...current]);
  };

  const updateEnquiryStatus = (id: string, status: Enquiry["status"]) => {
    const current = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries);
    const updated = current.map((e) => (e.id === id ? { ...e, status } : e));
    setStored(STORAGE_KEYS.ENQUIRIES, updated);
  };

  const deleteEnquiry = (id: string) => {
    const current = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries);
    const updated = current.filter((e) => e.id !== id);
    setStored(STORAGE_KEYS.ENQUIRIES, updated);
  };

  const addReview = (review: Omit<Review, "id" | "createdAt" | "status">) => {
    const current = getStored<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews);
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending", // Starts in pending moderation state
    };
    setStored(STORAGE_KEYS.REVIEWS, [newRev, ...current]);
  };

  const updateReviewStatus = (id: string, status: Review["status"]) => {
    const current = getStored<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews);
    const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  const deleteReview = (id: string) => {
    const current = getStored<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews);
    const updated = current.filter((r) => r.id !== id);
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  const updatePractice = (
    key: Discipline,
    data: { label?: string; tagline?: string; code?: string; color?: string }
  ) => {
    const current = getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines);
    const updated = {
      ...current,
      [key]: {
        ...current[key],
        ...data,
      },
    };
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const addProject = (disciplineKey: Discipline, project: Project) => {
    const current = getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines);
    const updated = {
      ...current,
      [disciplineKey]: {
        ...current[disciplineKey],
        projects: [project, ...current[disciplineKey].projects],
      },
    };
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const updateProject = (disciplineKey: Discipline, index: number, project: Project) => {
    const current = getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines);
    const projects = [...current[disciplineKey].projects];
    projects[index] = project;
    const updated = {
      ...current,
      [disciplineKey]: {
        ...current[disciplineKey],
        projects,
      },
    };
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const deleteProject = (disciplineKey: Discipline, index: number) => {
    const current = getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines);
    const projects = current[disciplineKey].projects.filter((_, i) => i !== index);
    const updated = {
      ...current,
      [disciplineKey]: {
        ...current[disciplineKey],
        projects,
      },
    };
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const resetToDefaults = () => {
    setStored(STORAGE_KEYS.DISCIPLINES, defaultDisciplines);
    setStored(STORAGE_KEYS.REVIEWS, initialReviews);
    setStored(STORAGE_KEYS.ENQUIRIES, initialEnquiries);
  };

  return {
    disciplines,
    enquiries,
    reviews,
    approvedReviews,
    pendingReviews,
    isAdmin,
    userSession,
    loginWithEmailPassword,
    loginAdmin,
    logoutAdmin,
    loginUser,
    logoutUser,
    addEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    addReview,
    updateReviewStatus,
    deleteReview,
    updatePractice,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
  };
}
