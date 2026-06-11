import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardActionArea,
} from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { jaJP } from 'date-fns/locale'

function RouteCard({ route, onClick }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick} sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            ルート {route.id}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {formatDistanceToNow(new Date(route.createdAt), {
              addSuffix: true,
              locale: jaJP,
            })}
          </Typography>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">
              📍 距離: {route.distance?.toFixed(2)} km
            </Typography>
            <Typography variant="body2">
              ⏱ 時間: {Math.round(route.duration / 60)} 分
            </Typography>
            <Typography variant="body2">
              💰 コスト: ¥{route.cost?.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 1 }}>
        <Button size="small" fullWidth onClick={onClick}>
          詳細を見る
        </Button>
      </Box>
    </Card>
  )
}

export default RouteCard
