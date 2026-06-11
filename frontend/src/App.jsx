import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Dashboard from './pages/Dashboard'
import RouteOptimization from './pages/RouteOptimization'
import RouteDetail from './pages/RouteDetail'
import Layout from './components/Layout'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/optimize" element={<RouteOptimization />} />
          <Route path="/route/:id" element={<RouteDetail />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
