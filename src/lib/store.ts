import { useState, useEffect, useMemo } from "react";
import { disciplines as defaultDisciplines, type Discipline, type Project } from "@/data/work";
import { getIdb, setIdb, clearIdb } from "./idb";

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

export const STORAGE_KEYS = {
  DISCIPLINES: "pap_disciplines_v7",
  ENQUIRIES: "pap_enquiries_v1",
  REVIEWS: "pap_reviews_v1",
  ADMIN_AUTH: "pap_admin_auth_v1",
  USER_AUTH: "pap_user_auth_v1",
  REGISTERED_USERS: "pap_registered_users_v1",
  COLLAGE: "pap_collage_v2",
};

// Seed admin accounts — these are always present
export const SEED_ADMIN_ACCOUNTS: RegisteredUser[] = [
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

// Cross-tab broadcast channel for instant multi-window synchronization
const syncChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("pap_store_sync_channel")
    : null;

// Helper to safely load JSON synchronously from localStorage
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

// Dual persistence: IndexedDB (authoritative, limitless) + localStorage (fast mirror)
async function setStored<T>(key: string, value: T): Promise<void> {
  if (typeof window === "undefined") return;

  // 1. Persist to IndexedDB (supports multi-megabyte renders with no 5MB quota limit)
  await setIdb(key, value);

  // 2. Best-effort mirror to localStorage
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If localStorage quota is exceeded due to large base64 images, IndexedDB handles it safely
  }

  // 3. Dispatch local event for same-tab instant reactivity
  window.dispatchEvent(new CustomEvent("pap_store_update", { detail: { key } }));

  // 4. Broadcast across tabs so all open windows update in real-time
  try {
    syncChannel?.postMessage({ key });
  } catch {}
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

  // Hydrate from IndexedDB on component mount and subscribe to updates
  useEffect(() => {
    let isMounted = true;

    // Check if session is admin
    const seedAdminEmails = new Set(SEED_ADMIN_ACCOUNTS.map((a) => a.email.toLowerCase()));
    const currentSession = getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null);
    if (currentSession && seedAdminEmails.has(currentSession.email.toLowerCase())) {
      if (!getStored<boolean>(STORAGE_KEYS.ADMIN_AUTH, false)) {
        setStored(STORAGE_KEYS.ADMIN_AUTH, true);
        setIsAdmin(true);
      }
    }

    // Hydrate authoritative data from IndexedDB
    async function hydrateAuthoritative() {
      try {
        const [idbDisciplines, idbCollage, idbEnquiries, idbReviews] = await Promise.all([
          getIdb<DisciplinesData>(STORAGE_KEYS.DISCIPLINES),
          getIdb<CollageTile[] | null>(STORAGE_KEYS.COLLAGE),
          getIdb<Enquiry[]>(STORAGE_KEYS.ENQUIRIES),
          getIdb<Review[]>(STORAGE_KEYS.REVIEWS),
        ]);

        if (!isMounted) return;

        if (idbDisciplines) {
          setDisciplines(idbDisciplines);
        }
        if (idbCollage !== null && idbCollage !== undefined) {
          setCustomCollageState(idbCollage);
        }
        if (idbEnquiries) {
          setEnquiries(idbEnquiries);
        }
        if (idbReviews) {
          setReviews(idbReviews);
        }
      } catch (err) {
        console.warn("[Store] Initial hydration from IndexedDB failed:", err);
      }
    }

    hydrateAuthoritative();

    const handleUpdate = async () => {
      // Refresh state from IndexedDB first, then fallback to localStorage
      const idbDisc = await getIdb<DisciplinesData>(STORAGE_KEYS.DISCIPLINES);
      if (!isMounted) return;
      setDisciplines(idbDisc || getStored<DisciplinesData>(STORAGE_KEYS.DISCIPLINES, defaultDisciplines));

      const idbCol = await getIdb<CollageTile[] | null>(STORAGE_KEYS.COLLAGE);
      if (!isMounted) return;
      setCustomCollageState(
        idbCol !== null && idbCol !== undefined ? idbCol : getStored<CollageTile[] | null>(STORAGE_KEYS.COLLAGE, null)
      );

      const idbEnq = await getIdb<Enquiry[]>(STORAGE_KEYS.ENQUIRIES);
      if (!isMounted) return;
      setEnquiries(idbEnq || getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries));

      const idbRev = await getIdb<Review[]>(STORAGE_KEYS.REVIEWS);
      if (!isMounted) return;
      setReviews(idbRev || getStored<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews));

      setIsAdmin(getStored<boolean>(STORAGE_KEYS.ADMIN_AUTH, false));
      setUserSession(getStored<UserSession | null>(STORAGE_KEYS.USER_AUTH, null));
    };

    window.addEventListener("pap_store_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const handleSyncMessage = () => {
      handleUpdate();
    };
    syncChannel?.addEventListener("message", handleSyncMessage);

    return () => {
      isMounted = false;
      window.removeEventListener("pap_store_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      syncChannel?.removeEventListener("message", handleSyncMessage);
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

    const session: UserSession = {
      name: user.name,
      email: cleanEmail,
      roleCompany: user.isAdmin ? "Studio Administrator" : "Client",
    };
    setStored(STORAGE_KEYS.ADMIN_AUTH, user.isAdmin);
    setStored(STORAGE_KEYS.USER_AUTH, session);
    return { success: true, isAdmin: user.isAdmin };
  };

  const loginWithEmailPassword = (email: string, password?: string, name?: string) => {
    if (password) {
      const result = signInUser(email, password);
      if (result.success) return { success: true, isAdmin: result.isAdmin };
    }
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
    const current = enquiries;
    const newEnq: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    const updated = [newEnq, ...current];
    setEnquiries(updated);
    setStored(STORAGE_KEYS.ENQUIRIES, updated);
  };

  const updateEnquiryStatus = (id: string, status: Enquiry["status"]) => {
    const updated = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
    setEnquiries(updated);
    setStored(STORAGE_KEYS.ENQUIRIES, updated);
  };

  const deleteEnquiry = (id: string) => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    setStored(STORAGE_KEYS.ENQUIRIES, updated);
  };

  const addReview = (review: Omit<Review, "id" | "createdAt" | "status">) => {
    const current = reviews;
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    const updated = [newRev, ...current];
    setReviews(updated);
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  const updateReviewStatus = (id: string, status: Review["status"]) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r));
    setReviews(updated);
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    setStored(STORAGE_KEYS.REVIEWS, updated);
  };

  const updatePractice = (
    key: Discipline,
    data: { label?: string; tagline?: string; code?: string; color?: string }
  ) => {
    const updated = {
      ...disciplines,
      [key]: {
        ...disciplines[key],
        ...data,
      },
    };
    setDisciplines(updated);
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const addProject = (disciplineKey: Discipline, project: Project) => {
    const updated = {
      ...disciplines,
      [disciplineKey]: {
        ...disciplines[disciplineKey],
        projects: [project, ...disciplines[disciplineKey].projects],
      },
    };
    setDisciplines(updated);
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const updateProject = (disciplineKey: Discipline, index: number, project: Project) => {
    const projects = [...disciplines[disciplineKey].projects];
    projects[index] = project;
    const updated = {
      ...disciplines,
      [disciplineKey]: {
        ...disciplines[disciplineKey],
        projects,
      },
    };
    setDisciplines(updated);
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const deleteProject = (disciplineKey: Discipline, index: number) => {
    const projects = disciplines[disciplineKey].projects.filter((_, i) => i !== index);
    const updated = {
      ...disciplines,
      [disciplineKey]: {
        ...disciplines[disciplineKey],
        projects,
      },
    };
    setDisciplines(updated);
    setStored(STORAGE_KEYS.DISCIPLINES, updated);
  };

  const setCustomCollage = (tiles: CollageTile[] | null) => {
    setCustomCollageState(tiles);
    setStored(STORAGE_KEYS.COLLAGE, tiles);
  };

  const resetToDefaults = async () => {
    setDisciplines(defaultDisciplines);
    setReviews(initialReviews);
    setEnquiries(initialEnquiries);
    setCustomCollageState(null);
    await clearIdb();
    try {
      localStorage.removeItem(STORAGE_KEYS.DISCIPLINES);
      localStorage.removeItem(STORAGE_KEYS.COLLAGE);
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    } catch {}
    window.dispatchEvent(new CustomEvent("pap_store_update"));
    syncChannel?.postMessage({ action: "reset" });
  };

  const exportPortfolioData = (): string => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      disciplines,
      customCollage,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importPortfolioData = async (jsonString: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") {
        return { success: false, error: "Invalid backup file format." };
      }
      if (parsed.disciplines) {
        setDisciplines(parsed.disciplines);
        await setStored(STORAGE_KEYS.DISCIPLINES, parsed.disciplines);
      }
      if (parsed.customCollage !== undefined) {
        setCustomCollageState(parsed.customCollage);
        await setStored(STORAGE_KEYS.COLLAGE, parsed.customCollage);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to parse JSON backup file." };
    }
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
    exportPortfolioData,
    importPortfolioData,
  };
}
