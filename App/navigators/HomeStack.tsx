import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import CredentialOffer from '../screens/CredentialOffer'
import Home from '../screens/Home'
import ProofRequest from '../screens/ProofRequest'
import { useTranslation } from 'react-i18next'

import defaultStackOptions from './defaultStackOptions'

export type HomeStackParams = {
  Home: undefined
  'Credential Offer': { credentialId: string }
  'Proof Request': { proofId: string }
}

const Stack = createStackNavigator<HomeStackParams>()

function HomeStack() {
  const { t } = useTranslation()
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen name={t('TabStack.Inbox')} component={Home} />
      <Stack.Screen name="Credential Offer" component={CredentialOffer} />
      <Stack.Screen name="Proof Request" component={ProofRequest} />
    </Stack.Navigator>
  )
}

export default HomeStack
