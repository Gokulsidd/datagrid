import { create } from 'zustand'

type HeaderState = {
    isHeaderVisible: boolean
    showHeader: () => void
    hideHeader: () => void
    toggleHeader: () => void
}

export const useHeaderStore = create<HeaderState>((set) => ({
    isHeaderVisible: true,
    showHeader: () => set({ isHeaderVisible: true }),
    hideHeader: () => set({ isHeaderVisible: false }),
    toggleHeader: () =>
    set((state) => ({ isHeaderVisible: !state.isHeaderVisible })),

}))