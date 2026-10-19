import { useState, type ChangeEvent } from "react";
import api, { getErrorMessage } from "./api/axios";
import { useFetch } from "./hooks/useFetch";
import { useToast } from "./context/ToastContext";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import SearchFilter from "./components/SearchFilter";
import type { Contact, Filters } from "./types/contact";

function App() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<Filters>({ search: "", category: "" });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Loads on page open, and again whenever the filters change
  const { data: contacts, setData, loading, error, refetch } = useFetch<Contact[]>("/contacts", filters);

  function handleFilterChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleSaved() {
    setEditingContact(null);
    refetch();
  }

  function handleEdit(contact: Contact) {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(contact: Contact) {
    if (!window.confirm(`Delete ${contact.fullName}?`)) return;

    try {
      await api.delete(`/contacts/${contact.id}`);
      setData((prev) => (prev ? prev.filter((c) => c.id !== contact.id) : prev));
      if (editingContact?.id === contact.id) setEditingContact(null);
      showToast("Contact deleted.");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Contact Information Manager</h1>
        <p>Save, search, edit, and remove your contacts.</p>
      </header>

      <main className="layout">
        <section className="card">
          <h2>{editingContact ? "Edit Contact" : "Add Contact"}</h2>
          <ContactForm
            key={editingContact?.id ?? "new"}
            editingContact={editingContact}
            onSaved={handleSaved}
            onCancelEdit={() => setEditingContact(null)}
          />
        </section>

        <section className="card">
          <h2>Contacts{contacts ? ` (${contacts.length})` : ""}</h2>
          <SearchFilter filters={filters} onChange={handleFilterChange} />
          <ContactList
            contacts={contacts}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRetry={refetch}
          />
        </section>
      </main>
    </div>
  );
}

export default App;