import { createStackNavigator } from '@react-navigation/stack'
import React, { useState, useEffect } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Linking } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import AuthenticateStack from './AuthenticateStack'
import ScanStack from './ScanStack'
import TabStack from './TabStack'
import defaultStackOptions from './defaultStackOptions'
import useDidCommDeepLink from '../linking'
import { ConnectionEventTypes, ConnectionState, ConnectionStateChangedEvent } from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'

const Stack = createStackNavigator()

function RootStack() {
  const [authenticated, setAuthenticated] = useState(false)
  const [existingUser, setExistingUser] = useState(false)
  const [invitationToProcess, setInvitationToProcess] = useState<string | null>(null)
  const { t } = useTranslation()
  const { agent } = useAgent()
  const navigation = useNavigation()

  useDidCommDeepLink((url: string, initialUrl: boolean) => {
    // const nav = handleUrl(url)
    // console.log(nav)
    console.log(`Recieved Deeplink ${url}, initialUrl: ${initialUrl}`)
    setInvitationToProcess(url)
  })

  useEffect(() => {
    const connect = async () => {
      if (authenticated && invitationToProcess) {
        Toast.show({
          type: 'info',
          text1: t('Scan.AcceptingConnection'),
        })
        try {
          const connectionRecord = await agent?.connections.receiveInvitationFromUrl(invitationToProcess, {
            autoAcceptConnection: true,
          })
          if (!connectionRecord?.id) {
            Toast.show({
              type: 'error',
              text1: t('Scan.ConnectionRecordIdNotFound'),
            })
            throw new Error('Connection record ID not found')
          }
          navigation.navigate('HomeTab')
        } catch {
          Toast.show({
            type: 'error',
            text1: t('Global.Failure'),
          })
        }
        setInvitationToProcess(null)
      }
    }
    connect()
  }, [invitationToProcess, authenticated])

  const authenticate = async () => {
    try {
      const existingUser = await AsyncStorage.getItem('ExistingUser')
      if (existingUser) {
        setExistingUser(true)
        const auth = await LocalAuthentication.authenticateAsync()
        if (auth.success === true) {
          setAuthenticated(true)
        }
      } else {
      }
    } catch (e) {
      //TODO: error
    } finally {
      // hide splash
    }
  }

  useEffect(() => {
    const listener = (event: ConnectionStateChangedEvent) => {
      if (
        event.payload.connectionRecord.state === ConnectionState.Complete &&
        event.payload.previousState === ConnectionState.Responded
      ) {
        Toast.show({
          type: 'success',
          text1: t('Scan.SuccessfullyAcceptedConnection'),
        })
      }
    }
    agent?.events.on(ConnectionEventTypes.ConnectionStateChanged, listener)
    return () => {
      agent?.events.off(ConnectionEventTypes.ConnectionStateChanged, listener)
    }
  }, [agent])

  useEffect(() => {
    authenticate()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions, headerShown: false }}>
      {authenticated ? (
        <Stack.Group>
          <Stack.Screen name="Tabs">{() => <TabStack />}</Stack.Screen>
          <Stack.Screen name="Connect" options={{ presentation: 'modal' }}>
            {() => <ScanStack />}
          </Stack.Screen>
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Authenticate" options={{ presentation: 'modal' }}>
            {() => <AuthenticateStack setAuthenticated={setAuthenticated} existingUser={existingUser} />}
          </Stack.Screen>
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}

export default RootStack
