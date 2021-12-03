import { createStackNavigator } from '@react-navigation/stack'
import React, { useState, useEffect } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import AuthenticateStack from './AuthenticateStack'
import ScanStack from './ScanStack'
import TabStack from './TabStack'
import defaultStackOptions from './defaultStackOptions'
import { ConnectionEventTypes, ConnectionState, ConnectionStateChangedEvent } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'
import { useAgent } from '@aries-framework/react-hooks'

const Stack = createStackNavigator()

function RootStack() {
  const [authenticated, setAuthenticated] = useState(false)
  const { t } = useTranslation()
  const { agent } = useAgent()

  const authenticate = async () => {
    try {
      const existingUser = await AsyncStorage.getItem('ExistingUser')
      if (existingUser) {
        const auth = await LocalAuthentication.authenticateAsync()
        if (auth) {
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
            {() => <AuthenticateStack setAuthenticated={setAuthenticated} />}
          </Stack.Screen>
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}

export default RootStack
