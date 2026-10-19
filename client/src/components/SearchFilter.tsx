import type { ChangeEvent } from "react";
import { CATEGORIES, type Filters } from "../types/contact";

type Props = {
  filters: Filters;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

function SearchFilter({ filters, onChange }: Props) {
  return (
    <div className="filters">
      <input
        name="search"
        type="search"
        placeholder="Search name, email, or phone..."
        value={filters.search}
        onChange={onChange}
        aria-label="Search contacts"
      />
      <select name="category" value={filters.category} onChange={onChange} aria-label="Filter by category">
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchFilter;