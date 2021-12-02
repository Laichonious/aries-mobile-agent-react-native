import type { CredentialRecord } from '@aries-framework/core'
import { CredentialState } from '@aries-framework/core'

import { useCredentialByState } from '@aries-framework/react-hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'

import { backgroundColor } from '../globalStyles'

import { CredentialListItem, Text } from 'components'

const ListCredentials: React.FC = () => {
  const credentialsDone = useCredentialByState(CredentialState.Done)
  const credentialsReceived = useCredentialByState(CredentialState.CredentialReceived)
  const { t } = useTranslation()

  const emptyListComponent = () => <Text style={{ textAlign: 'center', marginTop: 100 }}>{t('Global.NoneYet!')}</Text>

  const keyForItem = (item: CredentialRecord) => String(item.credentialId)

  return (
    <FlatList
      data={[...credentialsDone, ...credentialsReceived]}
      style={{ backgroundColor }}
      keyExtractor={keyForItem}
      ListEmptyComponent={emptyListComponent}
      renderItem={({ item }) => <CredentialListItem credential={item} />}
    />
  )
}

export default ListCredentials
