// CustomAlert.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const CustomAlert = ({ icon, message, visible }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Animatable.View
      animation="fadeIn"
      duration={500}
      style={styles.container}
    >
      <View style={styles.alert}>
        {icon && <MaterialIcons name={icon} size={24} style={styles.icon} color={Colors.primary}/>}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 999999,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 11,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
    
  },
  message: {
    color: '#333',
    fontSize: 16,
  },
});

export default CustomAlert;
