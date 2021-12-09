import { CredentialRecord } from '@aries-framework/core'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'

import CredentialDetails from '../screens/CredentialDetails'
import ListCredentials from '../screens/ListCredentials'

import defaultStackOptions from './defaultStackOptions'

export type CredentialStackParams = {
  Credentials: undefined
  'Credential Details': { credentialId: string }
}

const Stack = createStackNavigator<CredentialStackParams>()

function CredentialStack() {
  const { t } = useTranslation()
  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions }}>
      <Stack.Screen name={t('TabStack.Credentials')} component={ListCredentials} />
      <Stack.Screen name="Credential Details" component={CredentialDetails} />
    </Stack.Navigator>
  )
}

export default CredentialStack
