import { RouteProp } from '@react-navigation/native'
import type { AuthenticateStackParams } from 'navigators/AuthenticateStack'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, Image, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button } from 'components'

interface Props {
  route: RouteProp<AuthenticateStackParams, 'Landing Screen'>
}

const PinEnter: React.FC<Props> = ({ route }) => {
  const { t } = useTranslation()

  const setFirstLogin = async () => {
    await AsyncStorage.setItem('ExistingUser', 'true')
    // route.params?.setAuthenticated(true)
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 20, height: '100%', justifyContent: 'space-between' }}>
        <Image source={require('../assets/img/logo_luxembourg_1.png')} style={{ marginTop: 40 }} />
        <View style={{ width: '100%' }}>
          <Button title={t('Global.CreateIdentityWallet')} onPress={setFirstLogin} negative />
          <Button title={t('Global.MoreInformation')} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PinEnter
