import React from 'react'
import { View, StyleSheet } from 'react-native'

import Text from '../texts/Text'
import Title from '../texts/Title'

import { shadow } from '../../globalStyles'

interface Props {
  contact: any
}

const ContactListItem: React.FC<Props> = ({ contact }) => {
  const date = JSON.stringify(contact.createdAt)

  return (
    <View key={contact.contact_id} style={styles.container}>
      <Title>{contact.alias ? contact.alias : contact.invitation.label}</Title>
      <Text>{contact.did}</Text>
      <Text style={styles.date}>{`${Number(date.slice(6, 8))}/${Number(date.slice(9, 11))}/${date.slice(1, 5)}`}</Text>
    </View>
  )
}

export default ContactListItem

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: shadow,
  },
  date: {
    textAlign: 'right',
  },
})