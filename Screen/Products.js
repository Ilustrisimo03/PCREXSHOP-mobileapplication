import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Products = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Products Screen</Text>
      <Text>Dito makikita ang listahan ng lahat ng produkto.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold'
    }
})

export default Products