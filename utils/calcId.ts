type Id = {
  pk: string;
  sk: string;
  note_id: string;
};

export const calcId = (ids: Id[]) => {
  if (ids.length === 0) {
    return "001";
  }
  if (ids.length >= 50) return null;
  if (parseInt(ids[0].note_id) > 1) {
    return "001";
  }
  for (let i = 1; i < ids.length; i++) {
    if (parseInt(ids[i].note_id) - parseInt(ids[i - 1].note_id) > 1) {
      return String(parseInt(ids[i - 1].note_id) + 1).padStart(3, "0");
    }
  }

  return String(parseInt(ids[ids.length - 1].note_id) + 1).padStart(3, "0");
};
