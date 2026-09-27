import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { updateEmergency } from '../utils/api';
import { getItem } from '../utils/store';
import Dropdown from './components/Dropdown';
import SubmitButton from './components/SubmitButton';

export default function NewAlertDetailsScreen() {
	const {
		emergencyId: emergencyIdParam,
		emergencyType: emergencyTypeParam,
		description: descriptionParam,
		latitude: latitudeParam,
		longitude: longitudeParam,
	} = useLocalSearchParams<{
		emergencyId?: string;
		emergencyType?: string;
		description?: string;
		latitude?: string;
		longitude?: string;
	}>();
	const [emergencyType, setEmergencyType] = useState(emergencyTypeParam ?? '');
	const [description, setDescription] = useState(descriptionParam ?? '');
	const [requires911, setRequires911] = useState(false);
	const [selfEmergency, setSelfEmergency] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [emergencyId, setEmergencyId] = useState(Number(emergencyIdParam) || null);
	const isMounted = useRef(false);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		setEmergencyId(Number(emergencyIdParam) || null);
		setEmergencyType(emergencyTypeParam ?? '');
		setDescription(descriptionParam ?? '');
	}, [descriptionParam, emergencyIdParam, emergencyTypeParam]);

	const submitDetails = async () => {
		if (isSubmitting) return;
		if (!emergencyId || !emergencyType) {
			Alert.alert('Missing emergency details', 'Select an emergency type before continuing.');
			return;
		}

		const latitude = Number(latitudeParam);
		const longitude = Number(longitudeParam);
		if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
			Alert.alert('Emergency details unavailable', 'Return to the emergency form and submit again.');
			return;
		}

		setIsSubmitting(true);
		try {
			const storedUserId = await getItem('user_id');
			const userId = Number(storedUserId);
			if (storedUserId === null || !Number.isFinite(userId)) {
				throw new Error('User information is unavailable.');
			}
			await updateEmergency({
				user_id: userId,
				emergency_id: emergencyId,
				latitude,
				longitude,
				requires_911: requires911,
				emergency_nature: emergencyType,
				self_emergency: String(selfEmergency),
				description,
			});
			if (!isMounted.current) return;
			router.replace({ pathname: '/emergency-status', params: { emergencyId: String(emergencyId) } });
		} catch (error) {
			if (!isMounted.current) return;
			console.error('[newAlertDetails] Emergency update failed:', error);
			Alert.alert(
				'Could not send emergency details',
				error instanceof Error ? error.message : 'Check your connection and try again.',
			);
			setIsSubmitting(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<Pressable
				accessibilityLabel="Back to emergency form"
				accessibilityRole="button"
				hitSlop={12}
				onPress={() => router.back()}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="#327EFF" />
				<Text style={styles.backButtonText}>Back</Text>
			</Pressable>

			<Text style={styles.title}>Emergency details</Text>
			<Text style={styles.subtitle}>Confirm the information responders will receive.</Text>

			<Text style={styles.label}>Emergency type</Text>
			<Dropdown selectedValue={emergencyType} onValueChange={setEmergencyType} />

			<View style={styles.switchRow}>
				<Text style={styles.label}>Call 911</Text>
				<Switch
					accessibilityLabel="Requires 911"
					value={requires911}
					onValueChange={setRequires911}
					trackColor={{ false: '#cbd5e1', true: '#327EFF' }}
				/>
			</View>
			<View style={styles.switchRow}>
				<Text style={styles.label}>This emergency is for me</Text>
				<Switch
					accessibilityLabel="This emergency is for me"
					value={selfEmergency}
					onValueChange={setSelfEmergency}
					trackColor={{ false: '#cbd5e1', true: '#327EFF' }}
				/>
			</View>

			<Text style={styles.label}>Description (optional)</Text>
			<TextInput
				accessibilityLabel="Emergency description"
				multiline
				numberOfLines={5}
				onChangeText={setDescription}
				placeholder="Describe what is happening"
				textAlignVertical="top"
				value={description}
				style={styles.input}
			/>

			<View style={styles.actions}>
				<SubmitButton onPress={submitDetails} disabled={isSubmitting} />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#ffffff',
		padding: 20,
		paddingTop: 32,
	},
	backButton: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8,
		minHeight: 48,
		marginBottom: 16,
	},
	backButtonText: {
		color: '#327EFF',
		fontSize: 17,
		fontWeight: 'bold',
	},
	title: {
		color: '#327EFF',
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		color: '#475467',
		fontSize: 16,
		lineHeight: 23,
		marginBottom: 24,
	},
	label: {
		color: '#1f2933',
		fontSize: 16,
		fontWeight: '600',
	},
	switchRow: {
		alignItems: 'center',
		borderBottomColor: '#e4e7ec',
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		minHeight: 60,
	},
	input: {
		backgroundColor: '#f9fafb',
		borderColor: '#cbd5e1',
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 16,
		lineHeight: 22,
		marginTop: 10,
		minHeight: 120,
		padding: 12,
	},
	actions: {
		marginTop: 'auto',
		paddingTop: 28,
		paddingBottom: 16,
	},
});
