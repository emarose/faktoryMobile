import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, PanResponder, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../../../../../../constants/Colors";

const QuantityStepper = ({ amount, setAmount, maxAmount }) => {
  // Valores calculados que no cambian con frecuencia
  const sliderWidth = 250;
  const thumbSize = 24;
  const trackHeight = 4;
  
  // Aseguramos que maxAmount sea al menos 1 para evitar divisiones por cero
  const safeMaxAmount = Math.max(1, maxAmount || 1);
  
  // Manejo más robusto del valor numérico inicial
  const parseAmount = (val) => {
    const parsed = parseInt(val);
    return isNaN(parsed) ? 1 : Math.max(1, Math.min(safeMaxAmount, parsed));
  };
  
  // Estado para el valor numérico
  const [numericValue, setNumericValue] = useState(() => parseAmount(amount));
  
  // Animated Value para la posición del thumb
  const thumbPosition = useRef(new Animated.Value(0)).current;
  
  // Función memoizada para calcular la posición del thumb basada en el valor
  const calculateThumbPosition = useMemo(() => (value) => {
    // Evitar división por cero o valores negativos
    if (safeMaxAmount <= 1) return 0;
    
    // Limitar el valor al rango válido y calcular la posición
    const boundedValue = Math.max(1, Math.min(safeMaxAmount, value));
    return ((boundedValue - 1) / (safeMaxAmount - 1)) * (sliderWidth - thumbSize);
  }, [safeMaxAmount, sliderWidth, thumbSize]);
  
  // Función para actualizar el valor y posición de manera consistente
  const updateValue = (newValue) => {
    // Asegurar que el valor está dentro del rango permitido
    const boundedValue = Math.max(1, Math.min(safeMaxAmount, newValue));
    
    // Solo actualizar si el valor ha cambiado
    if (boundedValue !== numericValue) {
      setNumericValue(boundedValue);
      setAmount(String(boundedValue));
      
      // Animar el thumb a la nueva posición
      const position = calculateThumbPosition(boundedValue);
      Animated.spring(thumbPosition, {
        toValue: position,
        useNativeDriver: false,
        friction: 7,
        tension: 40
      }).start();
    }
  };
  
  // Actualizar cuando las props cambian
  useEffect(() => {
    const parsedValue = parseAmount(amount);
    if (parsedValue !== numericValue) {
      setNumericValue(parsedValue);
      
      // Actualizar posición sin animación para sincronizar con props
      const position = calculateThumbPosition(parsedValue);
      thumbPosition.setValue(position);
    }
  }, [amount, safeMaxAmount, calculateThumbPosition, numericValue]);
  
  // Referencia para el ancho del track para cálculos precisos
  const trackWidthRef = useRef(sliderWidth);
  
  // Configurar PanResponder para el slider con mejor manejo de gestos
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Simplemente registramos que estamos arrastrando, sin modificar el valor
      thumbPosition.stopAnimation();
    },
    onPanResponderMove: (evt, gestureState) => {
      // Calcular la posición absoluta del dedo, no relativa al inicio del gesto
      const touchX = evt.nativeEvent.locationX;
      
      // Asegurar que estamos dentro de los límites del track
      if (touchX < 0 || touchX > trackWidthRef.current) return;
      
      // Calcular la posición limitada del thumb
      const position = Math.max(0, Math.min(sliderWidth - thumbSize, touchX - thumbSize / 2));
      
      // Actualizar directamente la posición visual
      thumbPosition.setValue(position);
      
      // Calcular el valor basado en la posición actual
      const ratio = position / (sliderWidth - thumbSize);
      const newValue = Math.round(1 + ratio * (safeMaxAmount - 1));
      
      // Actualizar el valor si cambió
      if (newValue !== numericValue) {
        setNumericValue(newValue);
        setAmount(String(newValue));
      }
    },
    onPanResponderRelease: () => {
      // Asegurar que el thumb queda en una posición exacta correspondiente al valor
      const exactPosition = calculateThumbPosition(numericValue);
      Animated.spring(thumbPosition, {
        toValue: exactPosition,
        useNativeDriver: false,
        friction: 7,
        tension: 40
      }).start();
    }
  }), [numericValue, safeMaxAmount, sliderWidth, thumbSize, calculateThumbPosition]);

  // Mejora: Control por toque en la barra (no solo arrastrando el thumb)
  const handleTrackPress = (evt) => {
    // Obtener la posición relativa del toque
    const { locationX } = evt.nativeEvent;
    
    // Guardar el ancho real del track para cálculos precisos
    trackWidthRef.current = sliderWidth;
    
    // Calcular el valor basado en la posición
    const ratio = Math.max(0, Math.min(1, locationX / sliderWidth));
    const newValue = Math.round(1 + ratio * (safeMaxAmount - 1));
    
    // Actualizar el valor y animar el thumb
    updateValue(newValue);
  };

  return (
    <View style={{ marginVertical: 16, alignItems: "center" }}>
      {/* Valor actual y controles +/- */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => updateValue(numericValue - 1)}
          style={{
            backgroundColor: Colors.backgroundSecondary,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: Colors.borderLight,
          }}
        >
          <MaterialIcons name="remove" size={20} color="#fff" />
        </TouchableOpacity>
        
        <View style={{ marginHorizontal: 16, alignItems: "center", width: 60 }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            {numericValue}
          </Text>
          <Text style={{ color: "#aaa", fontSize: 12 }}>
            of {safeMaxAmount}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => updateValue(numericValue + 1)}
          style={{
            backgroundColor: "#2c2c44",
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#444455",
          }}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Slider personalizado mejorado */}
      <View 
        style={{ width: sliderWidth, height: 40, justifyContent: "center" }}
        onTouchStart={handleTrackPress}
      >
        {/* Track de fondo */}
        <View 
          style={{
            position: "absolute",
            width: sliderWidth,
            height: trackHeight,
            backgroundColor: "#444",
            borderRadius: trackHeight / 2,
          }}
        />
        
        {/* Track de progreso */}
        <Animated.View 
          style={{
            position: "absolute",
            width: Animated.add(thumbPosition, thumbSize / 2),
            height: trackHeight,
            backgroundColor: Colors.accentGreen,
            borderRadius: trackHeight / 2,
          }}
        />
        
        {/* Thumb con área táctil ampliada */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            left: thumbPosition,
           // top: -10,
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: "#ffe082",
            borderWidth: 2,
            borderColor: Colors.accentGreen,
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            justifyContent: "center",
            alignItems: "center",
            // Aumentar el área táctil
            hitSlop: { top: 20, bottom: 20, left: 20, right: 20 }
          }}
        >
          <View 
            style={{ 
              width: 6, 
              height: 6, 
              borderRadius: 3, 
              backgroundColor: Colors.accentGreen 
            }} 
          />
        </Animated.View>
      </View>
      
      {/* Valores extremos como texto */}
      <View style={{ flexDirection: "row", width: sliderWidth, justifyContent: "space-between", marginTop: 8 }}>
        <Text style={{ color: "#888", fontSize: 12 }}>1</Text>
        <Text style={{ color: "#888", fontSize: 12 }}>{safeMaxAmount}</Text>
      </View>
    </View>
  );
};

export default QuantityStepper;