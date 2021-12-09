import React from 'react'
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useConnectionById } from '@aries-framework/react-hooks'
import { ProofRecord } from '@aries-framework/core'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'

import Text from '../texts/Text'

import { borderRadius, disabledTextColor } from '../../globalStyles'

interface Props {
  notification: ProofRecord
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

const NotificationProofListItem: React.FC<Props> = ({ notification, pending }) => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const { connectionId, requestMessage, id, createdAt } = notification

  const connection = useConnectionById(connectionId)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Proof Request', { proofId: id })}
      disabled={!pending}
    >
      <View style={styles.icon}>
        <Image style={{ height: 50, width: 50 }} source={{ uri: connection?.imageUrl }} />
      </View>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>{requestMessage?.indyProofRequest?.name}</Text>
          <Text style={{ fontSize: 12 }}>{connection?.alias || connection?.invitation?.label}</Text>
        </View>
        <View>
          <Text style={styles.date}>{DateTime.fromJSDate(createdAt).toFormat('LLL d, yyyy')}</Text>
          <Text style={styles.date}>{t('ProofRequest.Proof')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default NotificationProofListItem
