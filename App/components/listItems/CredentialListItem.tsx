import { Connection, CredentialRecord } from '@aries-framework/core'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CredentialStackParams } from 'navigators/CredentialStack'
import { useConnectionById } from '@aries-framework/react-hooks'

import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { mainColor, secondaryTextColor } from '../../globalStyles'
import { parseSchema } from '../../helpers'
import { Text } from 'components'

interface Props {
  credential: CredentialRecord
}

const styles = StyleSheet.create({
  container: {
    height: 230,
    marginTop: 15,
    marginHorizontal: 15,
    padding: 15,
    paddingTop: 10,
    backgroundColor: mainColor,
    borderRadius: 15,
    justifyContent: 'space-between',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  text: { color: secondaryTextColor, fontWeight: '500' },
})

const CredentialListItem: React.FC<Props> = ({ credential }) => {
  const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()
  const connection = useConnectionById(credential.connectionId)
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Credential Details', { credentialId: credential.id })}
    >
      <View style={styles.row}>
        <Text style={styles.text}>{parseSchema(credential.metadata.schemaId).toUpperCase()}</Text>
        <Icon name="chevron-right" color={secondaryTextColor} size={30} />
      </View>
      <View style={[styles.row, { alignItems: 'baseline' }]}>
        <Text style={[styles.text, { fontSize: 18 }]}>
          {credential?.credentialAttributes?.find((n) => n.name === 'given_name')?.value}{' '}
          {credential?.credentialAttributes?.find((n) => n.name === 'surname')?.value}
        </Text>
        <Image style={{ height: 50, width: 50 }} source={{ uri: connection?.imageUrl }} />
      </View>
    </TouchableOpacity>
  )
}

export default CredentialListItem
