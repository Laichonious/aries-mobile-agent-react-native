import { useCredentialById, useConnectionById } from '@aries-framework/react-hooks'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CredentialStackParams } from 'navigators/CredentialStack'

import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { FlatList, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { secondaryTextColor, borderRadius } from '../globalStyles'
import { parseSchema } from '../helpers'
import { ModularView, Label, SafeAreaScrollView } from 'components'
interface ICredentialDetailsProps {
  navigation: StackNavigationProp<CredentialStackParams, 'Credential Details'>
  route: RouteProp<CredentialStackParams, 'Credential Details'>
}

const CredentialDetails: React.FC<ICredentialDetailsProps> = ({ route }) => {
  const credential = useCredentialById(route?.params?.credentialId)
  const connection = useConnectionById(credential?.connectionId)
  console.log(JSON.stringify(connection))
  const { t } = useTranslation()

  return (
    <SafeAreaScrollView>
      <View style={{ marginHorizontal: 15 }}>
        <ModularView
          title={parseSchema(credential?.metadata.schemaId)}
          subtitle={connection?.alias || connection?.invitation?.label}
          content={
            <FlatList
              ItemSeparatorComponent={() => (
                <View style={{ width: '100%', borderBottomWidth: 0.5, borderColor: secondaryTextColor }}></View>
              )}
              data={credential?.credentialAttributes}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Label
                  title={item.name
                    .split('_')
                    .map((word) => (word === 'of' ? word : word[0].toUpperCase() + word.slice(1)))
                    .join(' ')}
                  subtitle={item.value}
                />
              )}
            />
          }
        />
      </View>
    </SafeAreaScrollView>
  )
}

export default CredentialDetails
