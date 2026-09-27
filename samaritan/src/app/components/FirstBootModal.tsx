
import Storage from 'expo-sqlite/kv-store';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { requestNotificationsPermissions } from '@/utils/notifications';
import { requestBackgroundLocationPermissions, requestForegroundLocationPermissions } from '@/utils/locations';
import { createUser } from '@/utils/user';


export default function FirstBootModal() { 
  type ModalState = "" |"samaritanNotificationPrompt" | "approximateLocationPrompt" | "approximateLocationContinue" | "finished";
  const [modalState,setModalState] = useState<ModalState>("")
  const [visible, setVisible] = useState(true)
  const [modalText, setModalText] = useState("")


  const modalOkFunction = () => {
    switch (modalState) {
      case "samaritanNotificationPrompt":
        (async () => {
            Storage.setItem("foregroundEnabled",String(await requestForegroundLocationPermissions()))
        })()
        setModalText("Samaritan uses notifications to alert whenever someone nearby has an emergency.\n\n You can choose to Opt In or Opt Out of this feature")
        //Next modal state determined by buttons, hence the lack of next state setting.
        break;
      case "approximateLocationPrompt": 
        (async () => {
          Storage.setItem("Samaritan","true")
          Storage.setItem("notifications",String(await requestNotificationsPermissions()))
        })()
        setModalText("Samaritain needs your approximate location whenever you're not using the app so that we can send emergencies that are close to you! ")
        setModalState("approximateLocationContinue")
        break;
      case "approximateLocationContinue":
        (async () => {
          Storage.setItem("backgroundLocationEnabled",String(await requestBackgroundLocationPermissions));
        })()
        //No break allows it to move on to finish first time setup
      case "finished":
        (async () => {
          setModalText("Finishing setup, please wait...")
          try {await createUser(modalState === "approximateLocationContinue")}
          //This catch should change to check if back-end server is accessable. But this is a prototype. So like..
          catch(e) {
            setModalText("Failed to finish setup! Ensure you are connected to the internet. Contact samaritanapp@gmail.com If you believe this to be an error. Press OK to try again")
            return
          }
          await Storage.setItem("firstBootComplete","true")
          setVisible(false)
        })()
        break;
      default:
        setModalText("Samaritan requires precise location permissions to send out your location when using the Emergency button.\n\n When asked, please allow precise location permissions!")
    }
  }
  useEffect(() => {
    modalOkFunction()
  },[modalState])

  const modalContinue = () => {
    console.log(modalState)
    switch(modalState) {
      case "":
        setModalState("samaritanNotificationPrompt")
        break;
      case "approximateLocationPrompt":
        setModalState("approximateLocationContinue")
        break;
      case "approximateLocationContinue":
      case "finished" :
        setModalState("") 
    }
    
  }


  
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalText}</Text>
            {modalState != "samaritanNotificationPrompt" && (
            <Pressable style={styles.buttonClose} onPress={modalContinue}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
            )}
            {modalState == "samaritanNotificationPrompt" && (
            <>
              <Pressable style={styles.buttonClose} onPress={() => { setModalState("approximateLocationPrompt");}}>
                <Text style={styles.textStyle}>Opt In</Text>
              </Pressable>
              <Pressable style={styles.buttonClose} onPress={() => { setModalState("finished");}}>
                <Text style={styles.textStyle}>Opt Out</Text>
              </Pressable>
            </>
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
    padding: 40,
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
    fontSize: 20,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
});