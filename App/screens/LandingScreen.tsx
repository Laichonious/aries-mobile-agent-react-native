import { RouteProp } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { AuthenticateStackParams } from 'navigators/AuthenticateStack'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, Image, ImageBackground, View } from 'react-native'

import { Button } from 'components'

interface Props {
  route: RouteProp<AuthenticateStackParams, 'Landing Screen'>
  navigation: StackNavigationProp<AuthenticateStackParams, 'Landing Screen'>
}

const PinEnter: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation()

  return (
    <SafeAreaView>
      <View style={{ padding: 20, height: '100%', justifyContent: 'space-between' }}>
        <Image source={require('../assets/img/logo_luxembourg_1.png')} style={{ marginTop: 40 }} />
        <View style={{ width: '100%' }}>
          <Button
            title={t('Global.CreateIdentityWallet')}
            onPress={() => navigation.navigate('Create 6-Digit Pin')}
            negative
          />
          <Button title={t('Global.MoreInformation')} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PinEnter
