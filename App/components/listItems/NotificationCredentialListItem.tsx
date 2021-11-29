import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useConnectionById } from '@aries-framework/react-hooks'
import type { CredentialRecord } from '@aries-framework/core'
import { DateTime } from 'luxon'

import Icon from 'react-native-vector-icons/MaterialIcons'

import Text from '../texts/Text'

import { backgroundColor, borderRadius, disabledTextColor, mainColor, shadow } from '../../globalStyles'
import { parseSchema } from '../../helpers'

interface Props {
  notification: CredentialRecord
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
  icon: { backgroundColor: mainColor, borderRadius: 100, padding: 10, marginRight: 10 },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: disabledTextColor,
  },
  date: { fontSize: 10, alignSelf: 'flex-start', paddingRight: 15, paddingTop: 5 },
})

const NotificationCredentialListItem: React.FC<Props> = ({ notification }) => {
  const navigation = useNavigation()

  const { metadata, connectionId, id, createdAt } = notification

  const connection = useConnectionById(connectionId)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Credential Offer', { credentialId: id })}
    >
      <View style={styles.icon}>
        <Icon name="credit-card" color={backgroundColor} size={30} />
      </View>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>{parseSchema(metadata?.schemaId)}</Text>
          <Text style={{ fontSize: 12 }}>{connection?.alias || connection?.invitation?.label}</Text>
        </View>
        <Text style={styles.date}>{DateTime.fromJSDate(createdAt).toFormat('LLL d, yyyy')}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default NotificationCredentialListItem
