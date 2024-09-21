import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const TripBookingModal = ({ visible, onClose, onSubmit, tripDate, tripDuration, tripPrice }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('tripDetailsTitle')}</Text>

          {/* Trip Details */}
          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t('dateLabel')}:</Text>
              <Text style={styles.detailValue}>{tripDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t('durationLabel')}:</Text>
              <Text style={styles.detailValue}>{t(tripDuration)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t('priceLabel')}:</Text>
              <Text style={styles.detailValue}>{t('JOD')}{tripPrice}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t('cancelButton')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>{t('submitButton')}</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'droidAr', // Use the custom font
  },
  tripDetails: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'droidAr', // Use the custom font
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    fontFamily: 'droidAr', // Use the custom font
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: 'bold',
    fontFamily: 'droidAr', // Use the custom font
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#ff5a5f',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'droidAr', // Use the custom font
  },
});

export default TripBookingModal;
