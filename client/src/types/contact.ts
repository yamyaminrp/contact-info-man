export const CATEGORIES = [
  { value: "family", label: "Family" },
  { value: "friend", label: "Friend" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
] as const;

export type Contact = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  isFavorite: boolean;
};

export type ContactFormData = Omit<Contact, "id">;

export type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export type Filters = {
  search: string;
  category: string;
};

export const emptyForm: ContactFormData = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  category: "",
  isFavorite: false,
};