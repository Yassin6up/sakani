import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

const VerificationModal = ({ visible, onClose, onSubmit }) => {
  const [code, setCode] = useState('');
  const { t } = useTranslation();

  const handleInputChange = (text) => {
    // Limit the input to 4 digits
    if (/^\d{0,4}$/.test(text)) {
      setCode(text);
    }
  };

  const handleSubmit = () => {
    if (code.length === 4) {
      // Send verification code to the backend
      onSubmit(code);
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit code.');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{t('Phone Verification')}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.instruction}>{t('Enter the 4-digit code sent to your phone')}</Text>
          <TextInput
            style={styles.singleInput}
            maxLength={4}
            keyboardType="numeric"
            value={code}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{t('Submit')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'droidAr',
  },
  instruction: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'droidAr',
  },
  singleInput: {
    borderBottomWidth: 2,
    borderColor: '#ddd',
    width: '50%',
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'droidAr',
  },
});

export default VerificationModal;
  