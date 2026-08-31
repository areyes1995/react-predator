import { createContext, useContext, useCallback, useState } from 'react'

interface ReloadNotificationState {
  visible: boolean
}

interface ReloadNotificationContextValue {
  state: ReloadNotificationState
  showReloadNotification: () => void
  dismissReloadNotification: () => void
  reloadPage: () => void
}

const ReloadNotificationContext = createContext<ReloadNotificationContextValue>({
  state: { visible: false },
  showReloadNotification: () => {},
  dismissReloadNotification: () => {},
  reloadPage: () => {},
})

export function ReloadNotificationProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState<boolean>(false)

  const showReloadNotification = useCallback(() => {
    setVisible(true)
  }, [])

  const dismissReloadNotification = useCallback(() => {
    setVisible(false)
  }, [])

  const reloadPage = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <ReloadNotificationContext.Provider value={{ state: { visible }, showReloadNotification, dismissReloadNotification, reloadPage }}>
      {children}
    </ReloadNotificationContext.Provider>
  )
}

export const useReloadNotification = () => useContext(ReloadNotificationContext)
