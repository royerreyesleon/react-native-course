import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Platform } from 'react-native';
// import imagen from './assets/diamante.jpg';

import uploadToAnonymousFilesAsync from 'anonymous-files';


import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

export default function App() {

  const openSharedDialog = async () => {
    // PREGUNTAR SI ESTA DISPONIBLE EN LA PLATAFORMA LA API PARA COMPARTIR
    if(! (await  Sharing.isAvailableAsync()) ){
      // alert('Compartir, no esta dsponible en tu plataforma')
      alert('Compartir, siguiendo en enlace: '+selectedImage.remoteUri)
      return
    }

    // compartir lo que tenemos en el estado
    await Sharing.shareAsync(selectedImage.localUri)


  }

  // ACTUALIZAR EL ESTADO DE LA IMAGEN
  const [selectedImage, setSelectedImage] = useState(null)

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if(permissionResult.granted === false){
      alert('Los permisos son requeridos')
      return
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync()
    console.log(pickerResult)

    // SI EL USUARIO NO SELECCIONO UNA IMAGEN
    if(pickerResult.cancelled === true){
      return
    }


    // DETECTAR LA PLATAFORMA EN LA QUE ESTAMOS
    if(Platform.OS === 'web'){

      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)

      setSelectedImage({localUri: pickerResult.uri, remoteUri})
    }else{
      setSelectedImage({localUri: pickerResult.uri})
    }



  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CARGA Y COMPARTE!</Text>
      {/* <StatusBar style={styles.title} /> */}
      <StatusBar style="auto" />

      <TouchableOpacity onPress={openImagePickerAsync} >
        
        <Image source={{uri: selectedImage !== null ? selectedImage.localUri : 'https://picsum.photos/200/200'}} style={styles.image}></Image>

      </TouchableOpacity>
      {/* <Image source={{uri: 'https://picsum.photos/200/200'}} style={styles.image}></Image> */}
      {/* <Image source={imagen} style={styles.image}></Image> */}

      {
        selectedImage ? 
        <Button 
        color="green"
        title="Comparte"
        // onPress={() => Alert.alert('Hola Mundo ')}
        onPress={ openSharedDialog}
        />
        :
        <View/>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title : {fontSize: 24, marginBottom:20},
  // image: {height:200, width:200}
  image: {height:200, width:200, borderRadius:100}
});
