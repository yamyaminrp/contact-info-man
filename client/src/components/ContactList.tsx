import type { Contact } from "../types/contact";

type Props = {
  contacts: Contact[] | null;
  loading: boolean;
  error: string | null;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onRetry: () => void;
};

function ContactList({ contacts, loading, error, onEdit, onDelete, onRetry }: Props) {
  if (error) {
    return (
      <div className="status status-error" role="alert">
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (loading && !contacts) {
    return <p className="status">Loading contacts...</p>;
  }

  if (!contacts || contacts.length === 0) {
    return <p className="status">No contacts found.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="contact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Category</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>
                {c.isFavorite && <span title="Favorite">★ </span>}
                {c.fullName}
              </td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>
                <span className="badge">{c.category}</span>
              </td>
              <td>{c.address}</td>
              <td className="row-actions">
                <button className="btn btn-secondary" onClick={() => onEdit(c)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => onDelete(c)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactList;