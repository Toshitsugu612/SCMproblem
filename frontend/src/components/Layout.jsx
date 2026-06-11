import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import Navigation from './Navigation'

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              🚚 SCM Problem - Route Optimizer
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Navigation />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4, overflow: 'auto' }}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout
