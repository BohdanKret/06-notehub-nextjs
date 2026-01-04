import axios from "axios";
import { type Note } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const apiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number = 1,
  search: string = ""
): Promise<FetchNotesResponse> => {
  const response = await apiClient.get<FetchNotesResponse>("/notes", {
    params: {
      search: search || undefined,
      page,
      perPage: 12,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await apiClient.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response = await apiClient.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await apiClient.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
