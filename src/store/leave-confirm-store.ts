import { create } from "zustand";

interface PendingLeave {
  chapterTitle: string;
  resolve: (confirmed: boolean) => void;
}

interface LeaveConfirmState {
  pending: PendingLeave | null;
  requestLeave: (chapterTitle: string) => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
}

export const useLeaveConfirmStore = create<LeaveConfirmState>((set, get) => ({
  pending: null,

  requestLeave: (chapterTitle) =>
    new Promise((resolve) => {
      const existing = get().pending;
      if (existing) existing.resolve(false);
      set({ pending: { chapterTitle, resolve } });
    }),

  confirm: () => {
    const pending = get().pending;
    if (!pending) return;
    pending.resolve(true);
    set({ pending: null });
  },

  cancel: () => {
    const pending = get().pending;
    if (!pending) return;
    pending.resolve(false);
    set({ pending: null });
  },
}));

/** Non-hook API for event handlers */
export function requestLeaveChapterConfirm(chapterTitle: string) {
  return useLeaveConfirmStore.getState().requestLeave(chapterTitle);
}
