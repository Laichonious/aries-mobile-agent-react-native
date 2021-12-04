import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
// eslint-disable-next-line import/namespace
import * as Keychain from 'react-native-keychain'

import PinCreate from '../screens/PinCreate'
import PinEnter from '../screens/PinEnter'
import Terms from '../screens/Terms'
import LandingScreen from '../screens/LandingScreen'

import defaultStackOptions from './defaultStackOptions'

export type AuthenticateStackParams = {
  // 'Terms & Conditions': undefined
  'Landing Screen': { setAuthenticated: (auth: boolean) => void }
  'Create 6-Digit Pin': { setAuthenticated: (auth: boolean) => void } | undefined
  'Enter Pin': { setAuthenticated: (auth: boolean) => void }
}

const Stack = createStackNavigator<AuthenticateStackParams>()

interface Props {
  setAuthenticated: (auth: boolean) => void
  existingUser?: boolean
}

const AuthenticateStack: React.FC<Props> = ({ setAuthenticated, existingUser }) => {
  return existingUser ? (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions, presentation: 'transparentModal', headerShown: false }}>
      <Stack.Screen name="Enter Pin" component={PinEnter} initialParams={{ setAuthenticated }} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions, presentation: 'transparentModal', headerShown: false }}>
      <Stack.Screen
        name="Landing Screen"
        component={LandingScreen}
        // initialParams={{ setAuthenticated }}
      />
      <Stack.Screen name="Create 6-Digit Pin" component={PinCreate} initialParams={{ setAuthenticated }} />
    </Stack.Navigator>
  )
}

export default AuthenticateStack
