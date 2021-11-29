import { CredentialState, ProofState } from '@aries-framework/core'
import { useCredentialByState, useCredentials, useProofByState, useProofs } from '@aries-framework/react-hooks'
import { NotificationCredentialListItem, NotificationProofListItem, Text } from 'components'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { SectionList, View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

import { textColor, backgroundColor, disabledTextColor } from '../globalStyles'

const styles = StyleSheet.create({
  title: {
    color: textColor,
    fontSize: 12,
    paddingLeft: 15,
    paddingTop: 20,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 200 },
})

const Home: React.FC = () => {
  const pendingCredentials = useCredentialByState(CredentialState.OfferReceived)
  const pendingProofs = useProofByState(ProofState.RequestReceived)
  const { credentials } = useCredentials()
  const { proofs } = useProofs()
  const { t } = useTranslation()

  const data = [
    { title: t('Home.Pending'), data: [...pendingCredentials, ...pendingProofs] },
    {
      title: t('Home.Recent'),
      data: [
        ...credentials.filter((c) => c.state !== CredentialState.OfferReceived),
        ...proofs.filter((p) => p.state !== ProofState.RequestReceived),
      ],
    },
  ]

  return pendingCredentials.length + pendingProofs.length + credentials.length + proofs.length > 0 ? (
    <SectionList
      style={{ backgroundColor }}
      sections={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        item.type === 'CredentialRecord' ? (
          <NotificationCredentialListItem notification={item} />
        ) : (
          <NotificationProofListItem notification={item} />
        )
      }
      renderSectionHeader={({ section }) =>
        section.data.length ? <Text style={styles.title}>{section.title}</Text> : null
      }
    />
  ) : (
    <View style={styles.empty}>
      <Icon name="inbox" color={disabledTextColor} size={100} />
      <Text style={{ color: disabledTextColor }}>{t('Home.NoNewUpdates')}</Text>
    </View>
  )
}

export default Home
