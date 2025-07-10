import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRooms } from '@/html/use-rooms'
import { dayjs } from '@/lib/dayjs'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function RoomList() {
  const { data, isLoading } = useRooms()

  return (
    <div>
      {isLoading && <p className="text-muted-foreground text-sm">Carregando Salas...</p>}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Salas recentes</CardTitle>
            <CardDescription>Acesso rápido para as salas mais recentes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data?.map(room => (
              <Link
                key={room.id}
                to={`/room/${room.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
              >
                <div className="flex-1 flex-col gap-1">
                  <h3 className="font-medium">{room.name}</h3>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {room.questionsCount} perguntas
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {dayjs(room.createdAt).toNow()}
                    </Badge>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-sm select-none">
                  Entrar <ArrowRight className="size-3" />
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
