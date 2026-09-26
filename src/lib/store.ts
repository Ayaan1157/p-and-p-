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

export type RegisteredUser = {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
};

export type CollageTile = {
  id: string; // Unique ID for keying
  src: string;
  title: string;
  discipline: Discipline;
  color: string;
  location: string;
  year: number;
};

export type DisciplinesData = typeof defaultDisciplines;

const STORAGE_KEYS = {
  DISCIPLINES: "pap_disciplines_v6",
  ENQUIRIES: "pap_enquiries_v1",
  REVIEWS: "pap_reviews_v1",
  ADMIN_AUTH: "pap_admin_auth_v1",
  USER_AUTH: "pap_user_auth_v1",
  REGISTERED_USERS: "pap_registered_users_v1",
  COLLAGE: "pap_collage_v2",
};

// Seed admin accounts — these are always present
const SEED_ADMIN_ACCOUNTS: RegisteredUser[] = [
  { name: "Studio Admin", email: "studio.paperandpencil@gmail.com", password: "Studio@374", isAdmin: true, createdAt: new Date().toISOString() },
  { name: "Admin", email: "admin@paperandpencil.com", password: "admin123", isAdmin: true, createdAt: new Date().toISOString() },
  { name: "Shwetha", email: "shwetha@paperandpencil.com", password: "admin123", isAdmin: true, createdAt: new Date().toISOString() },
  { name: "Sharath", email: "sharath@paperandpencil.com", password: "admin123", isAdmin: true, createdAt: new Date().toISOString() },
  { name: "Ayaan", email: "ayaanwann@gmail.com", password: "123456789", isAdmin: true, createdAt: new Date().toISOString() },
];

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

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const currentSession = getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null);
    const seedAdminEmails = new Set(SEED_ADMIN_ACCOUNTS.map((a) => a.email.toLowerCase()));
    if (currentSession && seedAdminEmails.has(currentSession.email.toLowerCase())) {
      return true;
    }
    return getStored<boolean>(STORAGE_KEYS.ADMIN_AUTH, false);
  });

  const [userSession, setUserSession] = useState<UserSession | null>(() =>
    getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null)
  );

  const [customCollage, setCustomCollageState] = useState<CollageTile[] | null>(() =>
    getStored<CollageTile[] | null>(STORAGE_KEYS.COLLAGE, null)
  );

  useEffect(() => {
    // If current session belongs to a seed admin, ensure admin privileges are active
    const seedAdminEmails = new Set(SEED_ADMIN_ACCOUNTS.map((a) => a.email.toLowerCase()));
    const currentSession = getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null);
    if (currentSession && seedAdminEmails.has(currentSession.email.toLowerCase())) {
      if (!getStored<boolean>(STORAGE_KEYS.ADMIN_AUTH, false)) {
        setStored(STORAGE_KEYS.ADMIN_AUTH, true);
        setIsAdmin(true);
      }
    }

    const handleUpdate = () => {
      setDisciplines(getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines));
      setEnquiries(getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries));
      setReviews(getStored<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews));
      setIsAdmin(getStored<boolean>(STORAGE_KEYS.ADMIN_AUTH, false));
      setUserSession(getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null));
      setCustomCollageState(getStored<CollageTile[] | null>(STORAGE_KEYS.COLLAGE, null));
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

  // ── Auth Actions ──

  // Get all registered users (seed admins take precedence + user-registered accounts)
  const getAllUsers = (): RegisteredUser[] => {
    const stored = getStored<RegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    const seedEmails = new Set(SEED_ADMIN_ACCOUNTS.map((a) => a.email.toLowerCase()));
    const nonSeedStored = stored.filter((u) => !seedEmails.has(u.email.toLowerCase()));
    return [...SEED_ADMIN_ACCOUNTS, ...nonSeedStored];
  };

  const registerUser = (
    email: string,
    password: string,
    name: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = getAllUsers();

    // Check if email already exists
    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: "An account with this email already exists. Please sign in." };
    }

    const newUser: RegisteredUser = {
      name: name.trim(),
      email: cleanEmail,
      password,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };

    const stored = getStored<RegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    setStored(STORAGE_KEYS.REGISTERED_USERS, [newUser, ...stored]);

    // Auto sign in after registration
    const session: UserSession = {
      name: newUser.name,
      email: cleanEmail,
      roleCompany: "Client",
    };
    setStored(STORAGE_KEYS.ADMIN_AUTH, false);
    setStored(STORAGE_KEYS.USER_AUTH, session);
    return { success: true };
  };

  const signInUser = (
    email: string,
    password: string
  ): { success: boolean; isAdmin: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = getAllUsers();
    const user = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, isAdmin: false, error: "No account found with this email. Please sign up first." };
    }

    const isStudioEmail = cleanEmail === "studio.paperandpencil@gmail.com";
    const passwordValid =
      user.password === password ||
      (isStudioEmail && (password === "Studio@374" || password === "admin123"));

    if (!passwordValid) {
      return { success: false, isAdmin: false, error: "Incorrect password. Please try again." };
    }

    // Successful login
    const session: UserSession = {
      name: user.name,
      email: cleanEmail,
      roleCompany: user.isAdmin ? "Studio Administrator" : "Client",
    };
    setStored(STORAGE_KEYS.ADMIN_AUTH, user.isAdmin);
    setStored(STORAGE_KEYS.USER_AUTH, session);
    return { success: true, isAdmin: user.isAdmin };
  };

  // Legacy compat — kept for any code that still calls it
  const loginWithEmailPassword = (email: string, password?: string, name?: string) => {
    if (password) {
      const result = signInUser(email, password);
      if (result.success) return { success: true, isAdmin: result.isAdmin };
    }
    // Fallback for no-password logins
    const cleanEmail = email.trim().toLowerCase();
    setStored(STORAGE_KEYS.ADMIN_AUTH, false);
    const session: UserSession = {
      name: name?.trim() || cleanEmail.split("@")[0],
      email: cleanEmail,
      roleCompany: "Client",
    };
    setStored(STORAGE_KEYS.USER_AUTH, session);
    return { success: true, isAdmin: false };
  };

  const loginAdmin = (password: string): boolean => {
    if (
      password === "Studio@374" ||
      password === "admin123" ||
      password === "admin" ||
      password === "123456789"
    ) {
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

  const setCustomCollage = (tiles: CollageTile[] | null) => {
    setStored(STORAGE_KEYS.COLLAGE, tiles);
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
    registerUser,
    signInUser,
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
    customCollage,
    setCustomCollage,
    resetToDefaults,
  };
}
