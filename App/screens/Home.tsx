import React, { useState, useEffect, useContext } from 'react'
import { FlatList } from 'react-native'
import { CredentialEventType, CredentialState } from 'aries-framework'

import AgentContext from '../contexts/AgentProvider'

import { Button, SafeAreaScrollView, AppHeaderLarge, ModularView, NotificationListItem } from 'components'

interface Props {
  navigation: any
}

const Home: React.FC<Props> = ({ navigation }) => {
  const agentContext = useContext<any>(AgentContext)

  const [notifications, setNotifications] = useState<any>([])

  const getNotifications = async () => {
    const credentials = await agentContext.agent.credentials.getAll()
    const credentialsToDisplay: any = []

    credentials.forEach((c: any) => {
      if (c.state !== CredentialState.Done) {
        credentialsToDisplay.push(c)
      }
    })

    setNotifications(credentialsToDisplay)
  }

  const handleCredentialStateChange = async (event: any) => {
    console.info(`Credentials State Change, new state: "${event.credentialRecord.state}"`, event)

    switch (event.credentialRecord.state) {
      case CredentialState.OfferReceived:
        setNotifications([...notifications, event.credentialRecord])
        break
      case CredentialState.CredentialReceived:
        await agentContext.agent.credentials.acceptCredential(event.credentialRecord.id)
        break
      case CredentialState.Done:
        setNotifications(notifications.filter((c: any) => c.id !== event.credentialRecord.id))
        break
      default:
        break
    }
  }

  // useEffect(() => {
  //   if (!agentContext.loading) {
  //     getNotifications()
  //   }
  // }, [agentContext.loading])

  // useEffect(() => {
  //   if (!agentContext.loading) {
  //     agentContext.agent.credentials.events.on(CredentialEventType.StateChanged, handleCredentialStateChange)
  //   }

  //   return () =>
  //     agentContext.agent.credentials.events.removeListener(
  //       CredentialEventType.StateChanged,
  //       handleCredentialStateChange
  //     )
  // })

  return (
    <SafeAreaScrollView>
      <AppHeaderLarge />
      <Button title="Scanner" onPress={() => navigation.jumpTo('Scan')} />
      <ModularView
        title="Notifications"
        content={
          notifications.length ? (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <NotificationListItem notification={item} />}
            />
          ) : (
            "Here you'll get notified about stuff"
          )
        }
      />
    </SafeAreaScrollView>
  )
}

export default Home
