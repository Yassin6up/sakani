import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
          fontFamily: 'droidAr',
        },
      }}>
      
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: t('profile'),
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="whishlists"
        options={{
          tabBarLabel: t('whishlists'),
          headerTitle: t('whishlists'),
          headerTitleStyle: { fontFamily: 'droidAr' },
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="upload"
        options={{
          tabBarLabel: t('upload'),
          headerShown: false,
          tabBarIcon: ({ size, color }) => <FontAwesome5 name="share" size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="services"
        options={{
          tabBarLabel: t('services'),
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home-repair-service" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="index"
        options={{
          headerShown : false,
          tabBarLabel: t('index'),
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
