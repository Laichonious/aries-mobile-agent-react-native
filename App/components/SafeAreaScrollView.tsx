import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

interface Props {
  children: any
}

const SafeAreaScrollView: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>{children}</ScrollView>
    </SafeAreaView>
  )
}

export default SafeAreaScrollView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    alignItems: 'center',
  },
})