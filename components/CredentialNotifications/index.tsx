import { CredentialRecord, ProposePresentationMessage, CredentialState } from 'aries-framework'
import React, { useContext, useEffect, useState } from 'react'
import BackgroundTask from 'react-native-background-task'
import { downloadGenesis, storeGenesis } from '../../genesis-utils'
import * as Keychain from 'react-native-keychain'
import indy from 'rn-indy-sdk'
import { PollingInboundTransporter } from '../../transporters'
import Config from 'react-native-config'
import PushNotification from "react-native-push-notification";
import {
    Agent,
    ConnectionEventType,
    BasicMessageEventType,
    ConsoleLogger,
    LogLevel,
    HttpOutboundTransporter,
  } from 'aries-framework'

const CredentialNotifications = (props:any)=>{
    const initAgent = async()=>{
        const genesis = await downloadGenesis(Config.GENESIS_URL)
        const genesisPath = await storeGenesis(genesis, 'genesis.txn')

        const agentConfig = {
            label: 'Aries Bifold',
            mediatorUrl: Config.MEDIATOR_URL,
            walletConfig: { id: 'wallet4' },
            walletCredentials: { key: '123' },
            autoAcceptConnections: true,
            poolName: 'test-183',
            genesisPath,
            logger: new ConsoleLogger(LogLevel.debug),
            indy,
        }
        let newAgent = new Agent(agentConfig)

      let outbound = new HttpOutboundTransporter(newAgent)

      newAgent.setInboundTransporter(new PollingInboundTransporter())
      newAgent.setOutboundTransporter(outbound)

      await newAgent.init()

      const handleBasicMessageReceive = (event) => {
        console.log(`New Basic Message with verkey ${event.verkey}:`, event.message)
      }
      newAgent.basicMessages.events.on(BasicMessageEventType.MessageReceived, handleBasicMessageReceive)

      const handleConnectionStateChange = (event) => {
        console.log(
          `connection event for: ${event.connectionRecord.id}, previous state -> ${event.previousState} new state: ${event.connectionRecord.state}`
        )
      }
      newAgent.connections.events.on(ConnectionEventType.StateChanged, handleConnectionStateChange)

      return newAgent
    }

    BackgroundTask.define(async ()=>{
        //Runs every 15 minutes in the background, has a max runtime of 30 seconds
        const agent = await initAgent()

        try{
        //Get list of credentials that have already had notifications
        console.log("Fetching past notification credential IDs...")
        const pastNotifications =  JSON.parse((await Keychain.getGenericPassword({service: 'previousNotifications'})).password)

        console.log("Fetching all credential records...")
        let credentialRecords = await agent.credentials.getAll()
        let credentialRecordIds: Array<String> = []
        //Filter out records
        console.log("Filtering all credential records...")
        credentialRecords = credentialRecords.filter((credentialRecord: CredentialRecord) =>{
            if(credentialRecord.state === CredentialState.OfferReceived){
                return false
            }

            //If we have already sent a notification for this credential record
            if(Array.isArray(pastNotifications)){
                if(pastNotifications.includes(credentialRecord.id)){
                    return false
                }
            }

            //Get credential ID
            credentialRecordIds.push(credentialRecord.id)
            return true
        })

        //Add list of credentials to past notification array
        Keychain.setGenericPassword('previousNotifications', JSON.stringify([...pastNotifications, ...credentialRecordIds]))

        //Send push notification
        if(credentialRecords.length > 0){
            console.log("Sending push notifications")
            let notificationMessage
            if(credentialRecords.length === 1){
            notificationMessage = "You have a new credential offer."
            }else{
            notificationMessage = `You have ${credentialRecords.length} credential offers.`
            }

            PushNotification.localNotification({
                title: 'New Credential Offer',
                message: notificationMessage,
                number: credentialRecords.length === 0 ? "none" : `${credentialRecords.length}`
            })
        }

        
        }catch(err){
        console.error(err)
        }
        BackgroundTask.finish()
    })

    useEffect(()=>{
        const initialize = async ()=>{
        //Enable the background service
        await BackgroundTask.cancel()
        console.log("Scheduling background services") 
        BackgroundTask.schedule({period: typeof props.interval === 'number' ? props.interval : 900})
        console.log("Background tasks scheduled")
        }
        initialize()
    }, [])

    return <></>
}

export default CredentialNotifications