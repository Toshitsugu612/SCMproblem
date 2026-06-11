import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { routeApi } from '../services/api'
import RouteMap from '../components/RouteMap'

function RouteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await routeApi.getRoute(id)
        setRoute(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRoute()
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!route) {
    return <Alert severity="warning">ルートが見つかりません</Alert>
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        戻る
      </Button>

      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        ルート詳細: {route.id}
      </Typography>

      <Card>
        <CardContent>
          <RouteMap routes={[route]} stops={route.stops} />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">統計情報</Typography>
            <Typography variant="body2">
              総距離: {route.distance?.toFixed(2)} km
            </Typography>
            <Typography variant="body2">
              総時間: {Math.round(route.duration / 60)} 分
            </Typography>
            <Typography variant="body2">
              コスト: ¥{route.cost?.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RouteDetail
