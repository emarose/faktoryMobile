import React, { useState } from 'react';
import { View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const VirtualJoystick = ({ onMove, style, size = 120, knobSize = 40 }) => {
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const maxDistance = (size - knobSize) / 2;

  const onGestureEvent = (event) => {
    const { translationX, translationY, state } = event.nativeEvent;

    if (state === State.ACTIVE) {
      setIsActive(true);
      
      // Calculate distance from center
      const distance = Math.sqrt(translationX ** 2 + translationY ** 2);
      
      let x = translationX;
      let y = translationY;
      
      // Limit movement to joystick boundary
      if (distance > maxDistance) {
        x = (translationX / distance) * maxDistance;
        y = (translationY / distance) * maxDistance;
      }
      
      setKnobPosition({ x, y });
      
      // Normalize values for movement (-1 to 1)
      const normalizedX = x / maxDistance;
      const normalizedY = y / maxDistance;
      
      console.log('Joystick move:', { x: normalizedX, y: normalizedY });
      onMove({ x: normalizedX, y: normalizedY });
    } else if (state === State.END) {
      setIsActive(false);
      setKnobPosition({ x: 0, y: 0 });
      onMove({ x: 0, y: 0 });
    }
  };

  return (
    <View style={[{
      position: 'absolute',
      bottom: 50,
      left: 50,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    }, style]}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            position: 'absolute',
            left: (size / 2) + knobPosition.x - (knobSize / 2),
            top: (size / 2) + knobPosition.y - (knobSize / 2),
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            backgroundColor: isActive ? '#4CAF50' : '#fff',
            borderWidth: 3,
            borderColor: isActive ? '#fff' : 'rgba(0, 0, 0, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
          }} />
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default VirtualJoystick;