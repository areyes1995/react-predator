import { useAuth } from '../../../context/AuthContext'
import StandsView from './components/StandsView'
import type { StandRole } from './types'

export default function StandsPage() {
  const { user } = useAuth()

  const role = (user?.role?.toLowerCase() === 'admin' ? 'admin' : 'presentador') as StandRole

  return <StandsView role={role} />
}
