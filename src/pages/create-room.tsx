import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

type GetRoomsApiResponse = Array<{
  id: string
  name: string
}>

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: [`get-rooms`],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms')
      const result: GetRoomsApiResponse = await response.json()
      return result
    },
  })

  return (
    <div>
      {isLoading && <p>Carregando...</p>}

      <div>
        {data?.map(room => (
          <Link key={room.id} to={`/room/${room.id}`}>
            <p>{room.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
