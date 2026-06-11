import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Box } from '@mui/material'

// デフォルトマーカーアイコンの設定
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function RouteMap({ routes = [], stops = [] }) {
  // 地図の中心座標を計算
  const getCenter = () => {
    if (stops.length === 0) return [35.6762, 139.6503] // デフォルト: 東京
    const lats = stops.map((s) => s.lat)
    const lngs = stops.map((s) => s.lng)
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
    return [centerLat, centerLng]
  }

  // ルートのポリラインを作成
  const getPolylines = () => {
    return routes.flatMap((route) => {
      if (!route.polyline) return []
      // 簡単な例として、配送地点を順番に繋ぐ
      const coordinates = route.stops?.map((stop) => [stop.latitude, stop.longitude]) || []
      return coordinates.length > 0
        ? [<Polyline key={route.id} positions={coordinates} color="blue" />]
        : []
    })
  }

  return (
    <Box sx={{ width: '100%', height: 400, borderRadius: 1, overflow: 'hidden' }}>
      <MapContainer
        center={getCenter()}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {stops.map((stop) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]}>
            <Popup>
              {stop.address}
              <br />
              ({stop.lat.toFixed(4)}, {stop.lng.toFixed(4)})
            </Popup>
          </Marker>
        ))}
        {getPolylines()}
      </MapContainer>
    </Box>
  )
}

export default RouteMap
