"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import css from "./notes.module.css";

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main>
      <div className={css.container}>
        <div className={css.toolbar}>
          <SearchBox value={search} onChange={handleSearchChange} />
          <button
            className={css.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            Create note +
          </button>
        </div>

        {data && data.notes.length > 0 ? (
          <>
            <NoteList notes={data.notes} />
            {data.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        ) : (
          <p className={css.noNotes}>No notes found.</p>
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onSuccess={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    </main>
  );
}
