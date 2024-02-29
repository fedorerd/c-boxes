import { AlertPopup, AlertPopupBase, AlertPopupBaseWithId } from '../components'
import { createContext, FC, PropsWithChildren, useContext, useReducer } from 'react'

type RemoveAlert = {
    action: AlertAction.Remove,
    id: number
}

type AddAlert = {
    action: AlertAction.Add,
    item: AlertPopupBase,
    id: number
}

enum AlertAction {
    Add = 'add',
    Remove = 'remove'
}

type AlertsContextProps = {
    alerts: AlertPopupBaseWithId[],
    sendAlert: (item: AlertPopupBase) => number,
    removeAlert: (id: number) => void
}

const AlertsContext = createContext<AlertsContextProps>({
    alerts: [],
    sendAlert: () => 0,
    removeAlert: () => null
})

export const useAlerts = () => useContext(AlertsContext)

export const AlertsProvider: FC<PropsWithChildren> = ({children}) => {

    const [alerts, manageAlerts] = useReducer((
        alerts: AlertPopupBaseWithId[], manageAlerts: AddAlert | RemoveAlert
    ) => {
        if (manageAlerts.action === AlertAction.Add) return [...alerts, {...manageAlerts.item, id: manageAlerts.id }]
        else return alerts.filter(n => n.id !== manageAlerts.id)
    }, [])

    const removeAlert = (id: number) => manageAlerts({
        action: AlertAction.Remove,
        id
    })

    const sendAlert = (item: AlertPopupBase) => {
        const id = Date.now()
        manageAlerts({
            action: AlertAction.Add,
            item,
            id
        })
        return id
    }

    return (
        <AlertsContext.Provider
            value={{
                alerts,
                sendAlert,
                removeAlert
            }}
        >
            {children}
        </AlertsContext.Provider>
    )
}

export const AlertsConsumer: FC = () => {
    return (
        <AlertsContext.Consumer>
            {
                ({ alerts, removeAlert }) => <>
                    {
                        alerts.length > 0
                        ?
                        <div className='alerts'>
                            {alerts.map(a => <AlertPopup {...a} key={a.id} remove={removeAlert}/>)}
                        </div>
                        : null
                    }
                </>
            }
        </AlertsContext.Consumer>
    )
}