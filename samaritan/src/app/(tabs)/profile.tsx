import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CreateUser } from '../../constants/apiObjects';
import { createUser } from '../../utils/api';
import { getStoredProfile, setStoredProfile } from '../../utils/profileStore';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<CreateUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setIsLoading(true);
      getStoredProfile().then((stored) => {
        if (isActive) {
          setProfile(stored);
          setIsLoading(false);
        }
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const setSamaritanStatus = async (isSamaritan: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Post-MVP: collect Name/Allergies/Bio here; ECDSA_public_key stays a placeholder until signing is wired up
    const payload: CreateUser = {
      ECDSA_public_key: profile?.ECDSA_public_key ?? '',
      Is_Samaritan: isSamaritan,
      Push_Token: profile?.Push_Token,
    };

    try {
      console.log('[profile] Calling POST /user...');
      await createUser(payload);
      await setStoredProfile(payload);
      setProfile(payload);
    } catch (error) {
      console.log('[profile] Request failed ->', error);
      Alert.alert('Something went wrong', 'Could not update your Samaritan status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#327EFF" />
      </View>
    );
  }

  const isSamaritan = profile?.Is_Samaritan ?? false;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Samaritan Profile</Text>

      {isSamaritan ? (
        <View style={styles.details}>
          <Detail label="Samaritan" value="Yes" />
          <Detail
            label="ECDSA public key"
            value={profile?.ECDSA_public_key ? String(profile.ECDSA_public_key) : 'Not yet generated'}
          />
          <Detail label="Push notifications" value={profile?.Push_Token ? 'Enabled' : 'Not set up'} />
        </View>
      ) : (
        <Text style={styles.message}>You haven&apos;t opted in as a Samaritan yet.</Text>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSamaritan ? 'Opt out as a Samaritan' : 'Opt in as a Samaritan'}
        disabled={isSubmitting}
        onPress={() => setSamaritanStatus(!isSamaritan)}
        style={[
          styles.button,
          isSamaritan ? styles.optOutButton : styles.optInButton,
          isSubmitting && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonLabel}>{isSamaritan ? 'Opt out as a Samaritan' : 'Opt in as a Samaritan'}</Text>
      </Pressable>
    </View>
  );
}


type DetailProps = {
  label: string;
  value: string;
};

function Detail({ label, value }: DetailProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#327EFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  message: {
    color: '#667085',
    fontSize: 16,
    textAlign: 'center',
  },
  details: {
    alignSelf: 'stretch',
    gap: 20,
  },
  detailRow: {
    gap: 6,
  },
  detailLabel: {
    color: '#667085',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailValue: {
    color: '#1f2933',
    fontSize: 18,
    lineHeight: 26,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 32,
  },
  optInButton: {
    backgroundColor: '#327EFF',
  },
  optOutButton: {
    backgroundColor: '#FF383C',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
