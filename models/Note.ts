interface Note {
  id: string | number;
  title: string;
  desc: string;
  color: string;
  createdAt: string;
}

interface NotePayload {
  note_id: string;
  note_details: {
    color: string;
    desc: string;
    title: string;
  };
}

export { Note, NotePayload };
