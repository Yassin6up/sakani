import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Expo includes this package
import Colors from '@/constants/Colors';

const SuccessModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <MaterialIcons name="check-circle-outline" size={60} color="green" style={styles.icon} />
          <Text style={styles.message}>تمت اضافة الاعلان بنجاح !</Text>
          <Text style={styles.message}> سيتم الموافقة عليه قريبا</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>الصفحة الرئيسية</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily : 'droidAr'
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    
    fontSize: 16,
    fontFamily : 'droidAr'
  },
});

export default SuccessModal;
