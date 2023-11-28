import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Visualization(){
    return(
        <View style={styles.container}>
            <Text>Visualization</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});