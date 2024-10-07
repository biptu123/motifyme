import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../apis/apiSlice";
import { Note } from "@/models/Note";
import { RootState } from "../store";
import { useSelector } from "react-redux";

// Adapter to manage normalized state
const noteAdapter = createEntityAdapter({
  selectId: (note: Note) => String(note.id),
  // sortComparer: (a, b) => b.created_at.localCompare(a.created_at),
});

// Initial state for the adapter
const initialState = noteAdapter.getInitialState();

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = noteAdapter.getSelectors((state: any) => initialState);

// Inject RTK Query API endpoints
export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNote: builder.mutation({
      query: ({ username, note, token }) => ({
        url: `/${username}`,
        method: "POST",
        body: JSON.stringify(note),
        headers: {
          authorizationToken: token,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Meta", { type: "Note", id: "LIST" }],
    }),
    editNote: builder.mutation({
      query: ({ username, id, token, note }) => ({
        url: `/${username}?id=${id}`,
        method: "PUT",
        body: JSON.stringify(note),
        headers: {
          authorizationToken: token,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        "Meta",
        { type: "Note", id: arg.id },
      ],
    }),
    deleteNote: builder.mutation({
      query: ({ username, id, token }) => ({
        url: `/${username}?id=${id}`,
        method: "DELETE",
        headers: {
          authorizationToken: token,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, arg) => [
        "Meta",
        { type: "Note", id: arg.id },
      ],
    }),
    getAllNotes: builder.query({
      query: ({ username, key, limit, token }) => ({
        url: key
          ? `/${username}/all_notes?limit=${limit}&key=${key}`
          : `/${username}/all_notes?limit=${limit}`,
        method: "GET",
        headers: {
          authorizationToken: token,
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

        // Otherwise, replace current state
        noteAdapter.setMany(initialState, loadedNotes);
        return {
          ...noteAdapter.setMany(initialState, loadedNotes),
          lastEvaluatedKey: response.LastEvaluatedKey || null,
        };
      },
      // async onQueryStarted(
      //   { username, key, limit, token },
      //   { queryFulfilled, dispatch, getState }
      // ) {
      //   console.log("here");
      //   // const state = getState();
      //   // await queryFulfilled;
      //   if (key) {
      //     console.log("looking for key");
      //     const data = useSelector(selectNoteIds);
      //     // const existingNotes = noteAdapter.getSelectors().selectAll(state.api)

      //     console.log("state", data);
      //   }
      // },
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
      query: ({ username, token }) => ({
        url: `/${username}/meta`,
        method: "GET",
        headers: {
          authorizationToken: token,
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Meta"],
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useGetAllIdsQuery,
  useAddNoteMutation,
  useEditNoteMutation,
  useDeleteNoteMutation,
} = noteApiSlice;

// Selector to extract the query result (entire query response)
export const selectNotesResult = (queryArgs: {
  username: string;
  key?: string;
  limit: number;
  token: string;
}) => noteApiSlice.endpoints.getAllNotes.select(queryArgs);

// Selector to extract the actual data from the query result
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult: any) => {
    console.log("notes result ============", notesResult);
    return notesResult?.data || initialState;
  }
);

// Entity adapter selectors
// export const {
//   selectAll: selectAllNotes,
//   selectById: selectNoteById,
//   selectIds: selectNoteIds,
// } = noteAdapter.getSelectors(
//   (state: any) => selectNotesData(state) ?? initialState
// );
