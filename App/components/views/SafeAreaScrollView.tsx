import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

import { backgroundColor } from '../../globalStyles'

interface Props {
  children: React.ReactNode
  center?: true
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
  center: {
    alignItems: 'center',
    // marginHorizontal: 20,
  },
})

const SafeAreaScrollView: React.FC<Props> = ({ children, center }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={center && styles.center}>{children}</ScrollView>
    </SafeAreaView>
  )
}

export default SafeAreaScrollView
