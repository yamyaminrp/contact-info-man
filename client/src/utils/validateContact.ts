import { CATEGORIES, type ContactFormData, type FormErrors } from "../types/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export function validateContact(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  const name = data.fullName.trim();
  if (name.length < 2 || name.length > 100) {
    errors.fullName = "Full name must be 2-100 characters.";
  }

  if (!PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number (7-20 characters: digits, +, -, spaces, parentheses).";
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email) || email.length > 150) {
    errors.email = "Enter a valid email address.";
  }

  const address = data.address.trim();
  if (address.length < 5 || address.length > 255) {
    errors.address = "Address must be 5-255 characters.";
  }

  if (!CATEGORIES.some((c) => c.value === data.category)) {
    errors.category = "Please choose a category.";
  }

  return errors;
}