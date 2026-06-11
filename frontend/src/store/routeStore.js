import { create } from 'zustand'

const useRouteStore = create((set) => ({
  routes: [],
  loading: false,
  error: null,
  selectedRoute: null,

  // ルート一覧を取得
  fetchRoutes: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/routes')
      if (!response.ok) throw new Error('Failed to fetch routes')
      const data = await response.json()
      set({ routes: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // ルート最適化を実行
  optimizeRoute: async (stops, vehicles, options) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/routes/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stops, vehicles, options }),
      })
      if (!response.ok) throw new Error('Failed to optimize route')
      const data = await response.json()
      set((state) => ({
        routes: [...state.routes, ...data.routes],
        loading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // ルートを選択
  selectRoute: (route) => set({ selectedRoute: route }),

  // ルートをクリア
  clearRoutes: () => set({ routes: [], selectedRoute: null }),
}))

export default useRouteStore
