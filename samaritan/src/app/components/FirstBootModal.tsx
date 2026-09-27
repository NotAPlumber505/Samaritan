import Storage from 'expo-sqlite/kv-store';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { requestNotificationsPermissions } from '@/utils/notifications';
import { requestBackgroundLocationPermissions, requestForegroundLocationPermissions } from '@/utils/locations';
import { createUser } from '@/utils/user';

export default function FirstBootModal() {
  type ModalState = "" | "samaritanNotificationPrompt" | "approximateLocationPrompt" | "approximateLocationContinue" | "finished";
  const [modalState, setModalState] = useState<ModalState>("");
  const [visible, setVisible] = useState(true);
  const [modalText, setModalText] = useState("");
  const [optedIn, setOptedIn] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);

  const modalOkFunction = async () => {
    switch (modalState) {
      case "samaritanNotificationPrompt":
        await Storage.setItem("foregroundEnabled", String(await requestForegroundLocationPermissions()));
        setModalText("Samaritan uses notifications to alert whenever someone nearby has an emergency.\n\n You can choose to Opt In or Opt Out of this feature");
        // Next modal state is decided by the Opt In / Opt Out buttons, not here.
        break;

      case "approximateLocationPrompt": {
        setOptedIn(true);
        await Storage.setItem("Samaritan", "true");
        const token = await requestNotificationsPermissions();
        setPushToken(token);
        await Storage.setItem("notifications", String(Boolean(token)));
        setModalText("Samaritan needs your approximate location whenever you're not using the app so that we can send you emergencies that are close to you!");
        setModalState("approximateLocationContinue");
        break;
      }

      case "approximateLocationContinue":
        await Storage.setItem("backgroundLocationEnabled", String(await requestBackgroundLocationPermissions()));
        setModalState("finished");
        break;

      case "finished":
        setModalText("Finishing setup, please wait...");
        try {
          await createUser(optedIn, pushToken ?? undefined);
        } catch (e) {
          // This catch should change to check if the back-end server is reachable.
          setModalText("Failed to finish setup! Ensure you are connected to the internet. Contact samaritanapp@gmail.com if you believe this to be an error. Press OK to try again");
          return;
        }
        await Storage.setItem("firstBootComplete", "true");
        setVisible(false);
        break;

      default:
        setModalText("Samaritan requires precise location permissions to send out your location when using the Emergency button.\n\n When asked, please allow precise location permissions!");
    }
  };

  useEffect(() => {
    modalOkFunction();
  }, [modalState]);

  const modalContinue = () => {
    if (modalState === "") {
      setModalState("samaritanNotificationPrompt");
    }
  };

  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalText}</Text>
          {modalState !== "samaritanNotificationPrompt" && (
            <Pressable style={styles.buttonClose} onPress={modalContinue}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          )}
          {modalState === "samaritanNotificationPrompt" && (
            <>
              <Pressable style={styles.buttonClose} onPress={() => setModalState("approximateLocationPrompt")}>
                <Text style={styles.textStyle}>Opt In</Text>
              </Pressable>
              <Pressable style={styles.buttonClose} onPress={() => setModalState("finished")}>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    elevation: 5,
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