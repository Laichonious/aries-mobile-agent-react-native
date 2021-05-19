/**
 * @format
 */

import { AppRegistry } from 'react-native'
import React from 'react'
import { BackButton, NativeRouter } from 'react-router-native'
import App from './App'
import { name as appName } from './app.json'

console.log(App)

const Base = async (props) => (
  <NativeRouter>
    <BackButton>
        <App />
    </BackButton>
  </NativeRouter>
)

AppRegistry.registerComponent(appName, () => Base)
