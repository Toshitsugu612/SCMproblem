import { useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useRouteStore from '../store/routeStore'
import RouteCard from '../components/RouteCard'

function Dashboard() {
  const navigate = useNavigate()
  const { routes, loading, error, fetchRoutes } = useRouteStore()

  useEffect(() => {
    fetchRoutes()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          ダッシュボード
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/optimize')}
        >
          新しいルートを最適化
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {routes.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="textSecondary">
              最適化されたルートがまだありません。
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {routes.map((route) => (
            <Grid item xs={12} sm={6} md={4} key={route.id}>
              <RouteCard
                route={route}
                onClick={() => navigate(`/route/${route.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default Dashboard
