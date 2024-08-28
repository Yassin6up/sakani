import React, { useRef } from 'react';
import { View, Text, Pressable, PanResponder, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DraggableButton = () => {
  const pan = useRef(new Animated.ValueXY({ x: 5, y: -100 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: pan.x._value, y: pan.y._value },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#25D366",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
          bottom: 100,
          left: 5,
        },
        pan.getLayout(),
      ]}
    >
      <Pressable>
        <MaterialCommunityIcons name='whatsapp' size={40} color={"white"} />
        <View
          style={{
            width: 90,
            height: 20,
            backgroundColor: "#25D366",
            borderRadius: 10,
            position: "absolute",
            bottom: -5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{
            fontFamily: "droidAr",
            fontSize: 12,
            color: "white",
          }}>الاستفسارات</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default DraggableButton;
