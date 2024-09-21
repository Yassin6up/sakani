import React, { useState , useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next

const GymBookingModal = ({ visible, onClose, onSubmit , listingData }) => {
  const { t } = useTranslation(); // Use the translation hook
  const [subscription, setSubscription] = useState(''); // To store selected subscription
  const [price, setPrice] = useState(''); // To store the price of the subscription

  // Example subscription options
  const subscriptions = [
    { type: t('Monthly'), price: '50 USD' },
    { type: t('Quarterly'), price: '130 USD' },
    { type: t('Yearly'), price: '500 USD' },
  ];

  useEffect(()=>{
    setSubscription(listingData?.subscriptionTypeGym	);
    setPrice(listingData?.price);
  },[listingData])
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('Gym Subscription')}</Text>
          <View style={styles.subscriptionContainer}>
            {/* {subscriptions.map((sub, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.subscriptionOption,
                  subscription === sub.type && styles.selectedSubscription,
                ]}
                onPress={() => {
                  setSubscription(sub.type);
                  setPrice(sub.price);
                }}
              >
                <Text style={styles.subscriptionText}>{sub.type}</Text>
                <Text style={styles.subscriptionPrice}>{sub.price}</Text>
              </TouchableOpacity>
            ))} */}

<TouchableOpacity
                style={[
                  styles.subscriptionOption,
                  styles.selectedSubscription,
                ]}
                onPress={() => {
                  setSubscription(listingData?.subscriptionTypeGym	);
                  setPrice(listingData?.price);
                }}
              >
                <Text style={styles.subscriptionText}>{listingData?.subscriptionTypeGym	}</Text>
                <Text style={styles.subscriptionPrice}>{listingData?.price} JOD</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => {
                if (subscription) {
                  onSubmit({subscription:subscription,price : price}); // Call the submit function with the selected subscription
                }
              }}
            >
              <Text style={styles.buttonText}>{t('Book Now')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>{t('Cancel')}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'droidAr', // Set the font family
  },
  subscriptionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  subscriptionOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedSubscription: {
    borderColor: '#3498db',
    backgroundColor: '#ecf6fd',
  },
  subscriptionText: {
    fontSize: 16,
    fontFamily: 'droidAr', // Set the font family
  },
  subscriptionPrice: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'droidAr', // Set the font family
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#3498db',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'droidAr', // Set the font family
  },
});

export default GymBookingModal;
