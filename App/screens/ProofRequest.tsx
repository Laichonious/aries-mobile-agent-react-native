import type { RouteProp } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { HomeStackParams } from 'navigators/HomeStack'

import { ProofState, RetrievedCredentials } from '@aries-framework/core'
import { useAgent, useConnectionById, useProofById } from '@aries-framework/react-hooks'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Alert, View, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'

import { backgroundColor } from '../globalStyles'
import { parseSchema } from '../helpers'

import { Button, ModularView, Label, SafeAreaScrollView } from 'components'

interface Props {
  navigation: StackNavigationProp<HomeStackParams, 'Proof Request'>
  route: RouteProp<HomeStackParams, 'Proof Request'>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
})

const transformAttributes = (attributes: any) => {
  const transformedAttributes = []

  for (const attribute in attributes) {
    transformedAttributes.push({
      name: attribute,
      value: attributes[attribute],
    })
  }
  return transformedAttributes
}

const CredentialOffer: React.FC<Props> = ({ navigation, route }) => {
  const { agent } = useAgent()
  const [retrievedCredentials, setRetrievedCredentials] = useState()
  const [retrievedCredentialsDisplay, setRetrievedCredentialsDisplay] = useState()
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const proofId = route?.params?.proofId
  const proof = useProofById(proofId)
  const connection = useConnectionById(proof?.connectionId)
  const { t } = useTranslation()

  useEffect(() => {
    if (proof?.state === ProofState.Done) {
      Toast.show({
        type: 'success',
        text1: t('ProofRequest.SuccessfullyAcceptedProof'),
      })
      navigation.goBack()
    }
  }, [proof])

  const getRetrievedCredentials = async () => {
    const retrievedCreds = await agent?.proofs.getRequestedCredentialsForProofRequest(
      proof?.requestMessage?.indyProofRequest,
      undefined
    )

    setRetrievedCredentials(retrievedCreds)
    setRetrievedCredentialsDisplay(
      transformAttributes(
        retrievedCreds.requestedAttributes[Object.keys(retrievedCreds.requestedAttributes)[0]][0].credentialInfo
          .attributes
      )
    )
  }

  useEffect(() => {
    getRetrievedCredentials()
  }, [])

  const handleAcceptPress = async () => {
    setButtonsVisible(false)
    Toast.show({
      type: 'info',
      text1: t('ProofRequest.AcceptingProof'),
    })
    try {
      if (!proof) {
        Toast.show({
          type: 'error',
          text1: t('ProofRequest.ProofNotFound'),
        })
        throw new Error('Proof not found')
      }
      const automaticRequestedCreds = agent?.proofs?.autoSelectCredentialsForProofRequest(retrievedCredentials)
      if (!automaticRequestedCreds) {
        Toast.show({
          type: 'error',
          text1: t('ProofRequest.RequestedCredsNotFound'),
        })
        throw new Error('Requested creds not found')
      }
      await agent?.proofs.acceptRequest(proof?.id, automaticRequestedCreds)
    } catch {
      Toast.show({
        type: 'error',
        text1: t('Global.Failure'),
      })
      setButtonsVisible(true)
    }
  }

  const handleRejectPress = async () => {
    Alert.alert(t('ProofRequest.RejectThisProof?'), t('Global.ThisDecisionCannotBeChanged.'), [
      { text: t('Global.Cancel'), style: 'cancel' },
      {
        text: t('Global.Confirm'),
        style: 'destructive',
        onPress: async () => {
          Toast.show({
            type: 'info',
            text1: t('ProofRequest.RejectingProof'),
          })
          try {
            // TODO: Reject proof
            navigation.goBack()
          } catch {
            Toast.show({
              type: 'error',
            })
          }
        },
      },
    ])
  }

  return (
    <SafeAreaScrollView>
      <View style={styles.container}>
        <ModularView
          title={proof?.requestMessage?.indyProofRequest?.name || connection?.alias || connection?.invitation?.label}
          content={
            <FlatList
              data={retrievedCredentialsDisplay}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Label
                  title={item.name
                    .split('_')
                    .map((word: string) => (word === 'of' ? word : word[0].toUpperCase() + word.slice(1)))
                    .join(' ')}
                  subtitle={item.value}
                  label={item.credentialDefinitionId}
                />
              )}
            />
          }
        />
        <Button title={t('Global.Accept')} onPress={handleAcceptPress} disabled={!buttonsVisible} />
        <Button title={t('Global.Reject')} negative onPress={handleRejectPress} disabled={!buttonsVisible} />
      </View>
    </SafeAreaScrollView>
  )
}

export default CredentialOffer
