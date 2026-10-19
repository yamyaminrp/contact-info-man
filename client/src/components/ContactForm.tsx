import { useState, type ChangeEvent, type FormEvent } from "react";
import api, { getErrorMessage, getFieldErrors } from "../api/axios";
import { useToast } from "../context/ToastContext";
import {
  CATEGORIES,
  emptyForm,
  type Contact,
  type ContactFormData,
  type FormErrors,
} from "../types/contact";
import { validateContact } from "../utils/validateContact";

type Props = {
  editingContact: Contact | null;
  onSaved: () => void;
  onCancelEdit: () => void;
};

function toFormData(contact: Contact): ContactFormData {
  return {
    fullName: contact.fullName,
    phone: contact.phone,
    email: contact.email,
    address: contact.address,
    category: contact.category,
    isFavorite: contact.isFavorite,
  };
}

function ContactForm({ editingContact, onSaved, onCancelEdit }: Props) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>(
    editingContact ? toFormData(editingContact) : emptyForm
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // One handler for every field (text, tel, email, textarea, select, checkbox)
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validateContact(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (editingContact) {
        await api.put(`/contacts/${editingContact.id}`, formData);
        showToast("Contact updated.");
      } else {
        await api.post("/contacts", formData);
        showToast("Contact saved.");
      }
      setFormData(emptyForm); // reset after a successful save
      onSaved();
    } catch (err) {
      const fieldErrors = getFieldErrors(err); // server-side validation messages
      if (fieldErrors) setErrors(fieldErrors as FormErrors);
      showToast(getErrorMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="fullName">Full Name</label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={handleChange}
        aria-invalid={Boolean(errors.fullName)}
      />
      {errors.fullName && <p className="error">{errors.fullName}</p>}

      <label htmlFor="phone">Phone</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        aria-invalid={Boolean(errors.phone)}
      />
      {errors.phone && <p className="error">{errors.phone}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        aria-invalid={Boolean(errors.email)}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <label htmlFor="address">Address</label>
      <textarea
        id="address"
        name="address"
        rows={3}
        value={formData.address}
        onChange={handleChange}
        aria-invalid={Boolean(errors.address)}
      />
      {errors.address && <p className="error">{errors.address}</p>}

      <label htmlFor="category">Category</label>
      <select
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        aria-invalid={Boolean(errors.category)}
      >
        <option value="">Select a category</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      <label className="checkbox-row" htmlFor="isFavorite">
        <input
          id="isFavorite"
          name="isFavorite"
          type="checkbox"
          checked={formData.isFavorite}
          onChange={handleChange}
        />
        Mark as favorite
      </label>

      <div className="actions">
        {editingContact && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : editingContact ? "Update Contact" : "Save Contact"}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;