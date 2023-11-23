import React from 'react'; 
import { Text, View, TextInput, ImageBackground,  
    StyleSheet, Dimensions } from 'react-native'; 
  
const screenHeight = Dimensions.get('window').height; 
const screenWidth = Dimensions.get('window').width; 
  
const BackgroundImg = () => { 
  return ( 
    <View> 
      <ImageBackground 
        source={{ 
          uri:  
'https://media.geeksforgeeks.org/wp-content/uploads/20220217151648/download3.png', 
        }} 
        resizeMode="stretch"
        style={styles.img}> 
        <TextInput placeholder="Geeks for Geeks" style={styles.input} /> 
      </ImageBackground> 
    </View> 
  ); 
}; 
  
export default BackgroundImg; 
  
const styles = StyleSheet.create({ 
  img: { 
    height: screenHeight, 
    width: screenWidth, 
    justifyContent: 'center', 
    alignItems: 'center', 
  }, 
  input: { 
    height: 40, 
    margin: 12, 
    borderWidth: 2, 
    padding: 10, 
  }, 
});