import { $authStore } from '../store'
import { useStore } from 'virtual:astro/use-store'

export function User() {
  const auth = useStore($authStore)

  return (
    <div>
      <h1>User</h1>
      <p>id: {auth?.userId}</p>
      <p>username: {auth?.username}</p>
    </div>
  )
}
