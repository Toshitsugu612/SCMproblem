import { Tabs, Tab, Box } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const getTabValue = () => {
    if (location.pathname === '/optimize') return 'optimize'
    if (location.pathname.startsWith('/route/')) return 'detail'
    return 'dashboard'
  }

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 'dashboard':
        navigate('/')
        break
      case 'optimize':
        navigate('/optimize')
        break
      default:
        break
    }
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={getTabValue()}
        onChange={handleTabChange}
        sx={{ px: 2 }}
      >
        <Tab label="ダッシュボード" value="dashboard" />
        <Tab label="ルート最適化" value="optimize" />
      </Tabs>
    </Box>
  )
}

export default Navigation
