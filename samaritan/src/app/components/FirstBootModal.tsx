
import Storage from 'expo-sqlite/kv-store';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function FirstBootModal() {
    
    const [okCounter,setOkCounter] = useState(0)
    const [visible, setVisible] = useState(true)
    const [modalText, setModalText] = useState("Samaritan requires precise location permissions to send out your location if you press the emergency button. When asked, please allow precise location permissions!")

    const promptPreciseForegroundLocationPermissions = () => {
        console.log("Implement me!")
        return false;
    }
    const promptNotificationsPermissions = () => {
        console.log("Implement me!")
        return false;
    }
    const promptApproximateBackgroundPermissions = () => {
        console.log("Implement me!")
        return false;
    }


    const modalOkFunction = () => {
        switch (okCounter) {
            case 0:
                Storage.setItem("foregroundEnabled",String(promptPreciseForegroundLocationPermissions()))
                setModalText("Samaritan uses notifications to alert whenever someone nearby has an emergency. You can choose to Opt in or out of this feature")
                setOkCounter(1)
                break
            case 1: 
                Storage.setItem("Samaritan","true")
                Storage.setItem("notifications",String(promptNotificationsPermissions()))
                setModalText("Samaritain needs your approximate location whenever you're not using the app so that we can send emergencies that are close to you! ")
                setOkCounter(2)
                break
            case 2:
                Storage.setItem("backgroundLocationEnabled",String(promptApproximateBackgroundPermissions()));
                //Storage.setItem("firstBootComplete","false") 
                setVisible(false)
                break
            case 3: 

                setVisible(false)
                break
            default:
                setVisible(false)

        }
    }


    return (
         <Modal
        transparent={true}
        visible={visible}
      >
        {/* 3. Style the layout to center and overlay the modal */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
            
            {/* Button to close the modal */}
            {okCounter != 1 && (
                <Pressable
              style={styles.buttonClose}
              onPress={modalOkFunction}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>)}
            {okCounter == 1 && (
                <Pressable
              style={styles.buttonClose}
              onPress={modalOkFunction}
            >
              <Text style={styles.textStyle}>Opt In</Text>
            </Pressable>
            )}
            {okCounter == 1 && (
            <Pressable
              style={styles.buttonClose}
              onPress={() => {
                    setOkCounter(2)
                    modalOkFunction()
                }}
                >
              <Text style={styles.textStyle}>Opt Out</Text>
            </Pressable>
            )}
          </View>
        </View>
      </Modal>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent dim backdrop
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 55,
    paddingTop:120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds drop shadow on Android
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
  },
  buttonClose: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});