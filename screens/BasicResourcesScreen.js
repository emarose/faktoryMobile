import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BasicResources from '../components/BasicResources'

const BasicResourcesScreen = () => {
  return (
    <SafeAreaView  style={{ flex: 1, alignItems: 'center',  }}>
      <BasicResources/>
      <Text>BasicResourcesScreen</Text>
    </SafeAreaView>
  )
}

export default BasicResourcesScreen

const styles = StyleSheet.create({})