import React from 'react'
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core'
import { useConnectionById } from '@aries-framework/react-hooks'
import type { CredentialRecord } from '@aries-framework/core'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'

import Text from '../texts/Text'

import { borderRadius, disabledTextColor, mainColor } from '../../globalStyles'
import { parseSchema } from '../../helpers'

interface Props {
  notification: CredentialRecord
  pending: boolean
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius,
    paddingLeft: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  icon: { marginRight: 10 },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: disabledTextColor,
  },
  date: { fontSize: 10, alignSelf: 'flex-end', paddingRight: 15, paddingTop: 5 },
})

const NotificationCredentialListItem: React.FC<Props> = ({ notification, pending }) => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const { metadata, connectionId, id, createdAt } = notification

  const connection = useConnectionById(connectionId)

  const handlePress = () => {
    pending
      ? navigation.navigate('Credential Offer', { credentialId: id })
      : navigation.navigate('CredentialsTab', {
          screen: 'Credential Details',
          params: { credentialId: id },
          initial: false,
        })
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.icon}>
        <Image style={{ height: 50, width: 50 }} source={{ uri: connection?.imageUrl }} />
      </View>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>{parseSchema(metadata?.schemaId)}</Text>
          <Text style={{ fontSize: 12 }}>{connection?.alias || connection?.invitation?.label}</Text>
        </View>
        <View>
          <Text style={styles.date}>{DateTime.fromJSDate(createdAt).toFormat('LLL d, yyyy')}</Text>
          <Text style={styles.date}>{t('CredentialOffer.Credential')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default NotificationCredentialListItem
