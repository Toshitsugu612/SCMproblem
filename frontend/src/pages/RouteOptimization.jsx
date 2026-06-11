import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import useRouteStore from '../store/routeStore'
import RouteMap from '../components/RouteMap'

function RouteOptimization() {
  const { optimizeRoute, loading, error } = useRouteStore()
  const [stops, setStops] = useState([
    { id: '1', lat: 35.6762, lng: 139.6503, address: '東京都渋谷区' },
    { id: '2', lat: 34.6937, lng: 135.5023, address: '大阪府大阪市' },
  ])
  const [vehicles, setVehicles] = useState([
    { id: 'v1', capacity: 1000, startLat: 35.6762, startLng: 139.6503 },
  ])
  const [optimizeOption, setOptimizeOption] = useState('distance')
  const [result, setResult] = useState(null)
  const [newStop, setNewStop] = useState({ address: '', lat: '', lng: '' })

  const handleAddStop = () => {
    if (newStop.address && newStop.lat && newStop.lng) {
      const stop = {
        id: `${stops.length + 1}`,
        address: newStop.address,
        lat: parseFloat(newStop.lat),
        lng: parseFloat(newStop.lng),
      }
      setStops([...stops, stop])
      setNewStop({ address: '', lat: '', lng: '' })
    }
  }

  const handleOptimize = async () => {
    try {
      const response = await optimizeRoute(stops, vehicles, {
        optimize: optimizeOption,
        timeWindow: false,
      })
      setResult(response)
    } catch (err) {
      console.error('Optimization failed:', err)
    }
  }

  const handleRemoveStop = (id) => {
    setStops(stops.filter((stop) => stop.id !== id))
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        ルート最適化
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* 左側：入力フォーム */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                配送地点
              </Typography>

              {/* 既存の配送地点 */}
              <Box sx={{ mb: 3, maxHeight: 300, overflow: 'auto' }}>
                {stops.map((stop) => (
                  <Card key={stop.id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">{stop.address}</Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveStop(stop.id)}
                      >
                        削除
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Box>

              {/* 新しい地点を追加 */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                新しい地点を追加
              </Typography>
              <TextField
                fullWidth
                label="住所"
                value={newStop.address}
                onChange={(e) =>
                  setNewStop({ ...newStop, address: e.target.value })
                }
                size="small"
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="緯度"
                type="number"
                value={newStop.lat}
                onChange={(e) => setNewStop({ ...newStop, lat: e.target.value })}
                size="small"
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="経度"
                type="number"
                value={newStop.lng}
                onChange={(e) => setNewStop({ ...newStop, lng: e.target.value })}
                size="small"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAddStop}
                sx={{ mb: 3 }}
              >
                地点を追加
              </Button>

              {/* 最適化オプション */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>最適化方法</InputLabel>
                <Select
                  value={optimizeOption}
                  label="最適化方法"
                  onChange={(e) => setOptimizeOption(e.target.value)}
                >
                  <MenuItem value="distance">距離最小</MenuItem>
                  <MenuItem value="time">時間最小</MenuItem>
                  <MenuItem value="cost">コスト最小</MenuItem>
                </Select>
              </FormControl>

              {/* 実行ボタン */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleOptimize}
                disabled={loading || stops.length < 2}
              >
                {loading ? <CircularProgress size={24} /> : 'ルートを最適化'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 右側：地図と結果 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              {result ? (
                <Box>
                  <RouteMap routes={result.routes} stops={stops} />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">
                      最適化結果
                    </Typography>
                    <Typography variant="body2">
                      総距離: {result.totalDistance?.toFixed(2)} km
                    </Typography>
                    <Typography variant="body2">
                      総時間: {Math.round(result.totalDuration / 60)} 分
                    </Typography>
                    <Typography variant="body2">
                      総コスト: ¥{result.totalCost?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography color="textSecondary">
                    ルート最適化を実行すると結果がここに表示されます
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RouteOptimization
