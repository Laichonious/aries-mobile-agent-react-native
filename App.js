import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

import { Provider } from 'react-redux'
import { AgentThunks, initializeStore } from '@aries-framework/redux-store'

import Config from 'react-native-config'

import { downloadGenesis, storeGenesis } from './genesis-utils'
import { PollingInboundTransporter } from './transporters'

import indy from 'rn-indy-sdk'
import {
  Agent,
  ConnectionEventType,
  BasicMessageEventType,
  ConsoleLogger,
  LogLevel,
  HttpOutboundTransporter,
} from 'aries-framework'

//For UUIDv4 within React Native
import 'react-native-get-random-values'

import { AgentProvider } from './App/contexts/AgentProvider'
import Errors from './App/contexts/Errors'
import Notifications from './App/contexts/Notifications'

import TabNavigator from './App/navigators/TabNavigator'
import AuthenticateStack from './App/navigators/AuthenticateStack'

export function useAgentListeners(agent, store) {
  useEffect(() => {
    // returns cleaner method
    const removeConnectionsListener = startConnectionsListener(agent, store)
    const removeCredentialsListener = startCredentialsListener(agent, store)
    const removeProofsListener = startProofsListener(agent, store)

    return () => {
      removeConnectionsListener()
      removeCredentialsListener()
      removeProofsListener()
    }
  }, [agent, store])
}

const App = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [Lstore, setStore] = useState()
  const [Lagent, setAgent] = useState()

  useEffect(async () => {
    const agent = await setUpAgent()
    const { store, useAppDispatch } = initializeStore(agent)
    await useAppDispatch(AgentThunks.initializeAgent())
    setStore(store)
    setAgent(agent)
    useAgentListeners(agent, store)
  }, [])

  const setUpAgent = async () => {
    console.info('Initializing Agent')

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

    return newAgent
  }

  return (
    <Provider store={Lstore}>
      <AgentProvider Lagent={Lagent}>
        <Errors>
          <Notifications>
            <View style={{ height: '100%' }}>
              {authenticated ? <TabNavigator /> : <AuthenticateStack setAuthenticated={setAuthenticated} />}
            </View>
          </Notifications>
        </Errors>
      </AgentProvider>
    </Provider>
  )
}

export default App
