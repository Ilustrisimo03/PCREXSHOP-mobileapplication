import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'

const Account = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Account</Text>
      <Text>User profile at settings.</Text>
      <View style={{marginTop: 20}}>
         <Button
            title="Logout"
            color="#E50914"
            onPress={() => navigation.replace('SignIn_SignUp')}
         />
      </View>
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

export default Account