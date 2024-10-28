import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../apis/apiSlice";
import { Note, NotePayload } from "@/models/Note";
import {
  _retrieveToken,
  _retrieveUsername,
  _storeIds,
} from "@/lib/async-storage";
import store from "../store";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const NOTES_LIMIT = process.env.EXPO_PUBLIC_NOTES_LIMIT;

// Adapter to manage normalized state
const noteAdapter = createEntityAdapter({
  selectId: (note: Note) => String(note.id),
});

const initialState = noteAdapter.getInitialState();

// Inject RTK Query API endpoints
export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNote: builder.mutation({
      query: (note) => ({
        url: ``,
        method: "POST",
        body: JSON.stringify(note),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Meta", { type: "Note", id: "LIST" }],
    }),
    editNote: builder.mutation({
      query: (note: NotePayload) => ({
        url: `?id=${note.note_id}`,
        method: "PUT",
        body: JSON.stringify(note),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        "Meta",
        { type: "Note", id: arg.note_id },
      ],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `?id=${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        "Meta",
        { type: "Note", id: arg.note_id },
      ],
    }),
    getAllNotes: builder.query({
      query: (key = null) => ({
        url: key
          ? `/all_notes?limit=${NOTES_LIMIT}&key=${key}`
          : `/all_notes?limit=${NOTES_LIMIT}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: any, meta: any, arg: any) => {
        let loadedNotes = [];
        if ("body" in response && Array.isArray(response.body)) {
          loadedNotes = response.body.map((note: any) => ({
            id: note.note_id,
            title: note.note_details.title,
            desc: note.note_details.desc,
            createdAt: new Date(note.created_at).toISOString(),
            color: note.note_details.color,
          }));
        }

        let currentState: any = initialState;

        if (arg) {
          const providedArray = [...store?.getState()?.api?.provided.Note.LIST];
          const name = providedArray.pop();
          if (name) currentState = store?.getState()?.api.queries[name]?.data;
        }

        return {
          ...noteAdapter.addMany(currentState, loadedNotes),
          lastEvaluatedKey: response.LastEvaluatedKey || null,
        };
      },
      providesTags: (result: any, error, arg) =>
        result && result.ids && Array.isArray(result.ids)
          ? [
              { type: "Note", id: "LIST" },
              ...result?.ids?.map(
                (id: string) => ({ type: "Note", id } as const)
              ),
            ]
          : [{ type: "Note", id: "LIST" }],
    }),
    getAllIds: builder.query({
      query: () => ({
        url: `/meta`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: async (response: any, meta: any, arg: any) => {
        if (response.statusCode === 200) {
          const ids = response.body.map((item: any) => item.note_id);
          _storeIds(JSON.stringify(ids));
        }
        return response;
      },
      providesTags: ["Meta"],
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useAddNoteMutation,
  useEditNoteMutation,
  useDeleteNoteMutation,
  useGetAllIdsQuery,
} = noteApiSlice;
