import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import MyAdsContent from './MyAds';

const ProfileMenu = ({controleModal}) => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  // Change the app direction based on the language
  useEffect(() => {
    const rtl = i18n.language === 'ar';
    setIsRTL(rtl);
    I18nManager.forceRTL(rtl);
  }, [i18n.language]);

  const handlePress = (screen) => {
    if (screen === 'Logout') {
      SecureStore.deleteItemAsync("token");
      SecureStore.deleteItemAsync("userData");
      SecureStore.deleteItemAsync("userId");
      router.replace("/login");
    }else if(screen === 'MyAdsScreen'){
        controleModal()
    } else {
      router.navigate(screen)
    }
  };

  return (
    <>
    <View style={styles.menuContainer}>
      {/* My Ads */}
      <TouchableOpacity style={[styles.menuItem, isRTL && styles.menuItemRTL]} onPress={() => handlePress('MyAdsScreen')}>
        <MaterialIcons name="list" size={24} color="#4b5563" style={[styles.icon, isRTL && styles.iconRTL]} />
        <Text style={[styles.menuText, isRTL && styles.menuTextRTL]}>{t('myAds')}</Text>
        <MaterialIcons name="chevron-right" size={20} color="#4b5563" style={[styles.chevron, isRTL && styles.chevronRTL]} />
      </TouchableOpacity>

      {/* Terms & Conditions */}
      <TouchableOpacity style={[styles.menuItem, isRTL && styles.menuItemRTL]} onPress={() => handlePress(`/Terms?lang=${i18n.language}`)}>
        <MaterialIcons name="description" size={24} color="#4b5563" style={[styles.icon, isRTL && styles.iconRTL]} />
        <Text style={[styles.menuText, isRTL && styles.menuTextRTL]}>{t('Terms & Conditions')}</Text>
        <MaterialIcons name="chevron-right" size={20} color="#4b5563" style={[styles.chevron, isRTL && styles.chevronRTL]} />
      </TouchableOpacity>

       {/* Privacy Policy*/}
       <TouchableOpacity style={[styles.menuItem, isRTL && styles.menuItemRTL]} onPress={() => handlePress(`/Polic?lang=${i18n.language}`)}>
        <MaterialIcons name="privacy-tip" size={24} color="#4b5563" style={[styles.icon, isRTL && styles.iconRTL]} />
        <Text style={[styles.menuText, isRTL && styles.menuTextRTL]}>{t('privacy policy')}</Text>
        <MaterialIcons name="chevron-right" size={20} color="#4b5563" style={[styles.chevron, isRTL && styles.chevronRTL]} />
      </TouchableOpacity>

      {/* Help */}
      <TouchableOpacity style={[styles.menuItem, isRTL && styles.menuItemRTL]} onPress={() => handlePress(`/support?lang=${i18n.language}`)}>
        <MaterialIcons name="help-outline" size={24} color="#4b5563" style={[styles.icon, isRTL && styles.iconRTL]} />
        <Text style={[styles.menuText, isRTL && styles.menuTextRTL]}>{t('Help')}</Text>
        <MaterialIcons name="chevron-right" size={20} color="#4b5563" style={[styles.chevron, isRTL && styles.chevronRTL]} />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={[styles.menuItem, styles.logoutItem, isRTL && styles.menuItemRTL]} onPress={() => handlePress('Logout')}>
        <MaterialIcons name="logout" size={24} color="#dc2626" style={[styles.icon, isRTL && styles.iconRTL]} />
        <Text style={[styles.menuText, styles.logoutText, isRTL && styles.menuTextRTL]}>{t('logout')}</Text>
      </TouchableOpacity>

    </View>
    </>
  );
};

export default ProfileMenu;

const styles = StyleSheet.create({
  menuContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 10,
  },
  menuItemRTL: {
    flexDirection: 'row-reverse',
  },
  icon: {
    marginRight: 15,
  },
  iconRTL: {
    marginLeft: 15,
    marginRight: 0,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    textAlign: 'left',
    fontFamily : "droidAr"
  },
  menuTextRTL: {
    textAlign: 'right',
  },
  chevron: {},
  chevronRTL: {
    transform: [{ rotate: '180deg' }],
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#dc2626',
  },
});
