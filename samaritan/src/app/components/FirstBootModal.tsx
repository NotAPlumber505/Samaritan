import { requestBackgroundLocationPermissions, requestForegroundLocationPermissions } from '@/utils/locations';
import { requestNotificationsPermissions } from '@/utils/notifications';
import { setItem } from '@/utils/store';
import { createUser } from '@/utils/user';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';


export default function FirstBootModal() { 
  type ModalState = 'intro' | 'choice' | 'backgroundPrompt' | 'submitting' | 'failed';
  const [modalState, setModalState] = useState<ModalState>('intro');
  const [visible, setVisible] = useState(true)
  const [modalText, setModalText] = useState(
    'Samaritan needs foreground location to submit emergencies. You can opt in to share location in the background and receive alerts for nearby emergencies.',
  );
  const [retryAsSamaritan, setRetryAsSamaritan] = useState(false);

  const finishSetup = async (isSamaritan: boolean) => {
    setRetryAsSamaritan(isSamaritan);
    setModalState('submitting');
    setModalText('Requesting permissions and finishing setup...');
    try {
      const foregroundEnabled = await requestForegroundLocationPermissions();
      await setItem('foregroundEnabled', String(foregroundEnabled));
      if (!foregroundEnabled) {
        throw new Error('Foreground location permission is required to submit emergencies.');
      }

      if (isSamaritan) {
        const notificationsEnabled = await requestNotificationsPermissions();
        await setItem('notificationsEnabled', String(notificationsEnabled));
        const backgroundEnabled = await requestBackgroundLocationPermissions();
        await setItem('backgroundLocationEnabled', String(backgroundEnabled));
      }

      await createUser(isSamaritan)
      await setItem("firstBootComplete", "true")
      setVisible(false)
    } catch (error) {
      console.warn('[firstBoot] Setup failed:', error);
      setModalText(error instanceof Error
        ? `${error.message} Retry, or continue without opting in.`
        : 'Setup failed. Check your connection and try again.');
      setModalState('failed');
    }
  }

  const continueSetup = () => {
    if (modalState === 'intro') {
      setModalText('Opt in to help: Samaritan will share your location and send emergency alerts within 2 km. You can also continue as a requester only.');
      setModalState('choice');
    } else if (modalState === 'backgroundPrompt') {
      void finishSetup(true);
    } else if (modalState === 'failed') {
      void finishSetup(retryAsSamaritan);
    }
  };


  
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalText}</Text>
            {(modalState === 'intro' || modalState === 'backgroundPrompt' || modalState === 'failed') && (
              <Pressable style={styles.buttonClose} onPress={continueSetup}>
                <Text style={styles.textStyle}>{modalState === 'failed' ? 'Retry' : 'Continue'}</Text>
              </Pressable>
            )}
            {modalState === 'choice' && (
            <>
              <Pressable style={styles.buttonClose} onPress={() => {
                setModalText('Background location lets nearby Samaritan alerts reach you when the app is closed. Android may open system settings to grant this permission.');
                setModalState('backgroundPrompt');
              }}>
                <Text style={styles.textStyle}>Opt In</Text>
              </Pressable>
              <Pressable style={styles.buttonClose} onPress={() => { void finishSetup(false); }}>
                <Text style={styles.textStyle}>Opt Out</Text>
              </Pressable>
            </>
            )}
            {modalState === 'failed' && retryAsSamaritan && (
              <Pressable style={styles.buttonClose} onPress={() => { void finishSetup(false); }}>
                <Text style={styles.textStyle}>Continue without opting in</Text>
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