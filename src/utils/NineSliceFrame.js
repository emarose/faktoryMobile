import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, useWindowDimensions } from "react-native";
import { CardFrameSlices } from "../../assets/images/UI/card";

/**
 * NineSliceFrame renders a nine-slice frame around children.
 * @param {Object} slices - The slice images (topLeft, top, topRight, left, mid, right, botLeft, bot, botRight)
 * @param {number} tileSize - Size of each tile (default 32)
 * @param {Object} style - Style object for the container
 * @param {React.ReactNode} children - Content to render inside the frame
 * @param {number} paddingHorizontal - Horizontal padding for content (default 8)
 * @param {number} paddingVertical - Vertical padding for content (default 8)
 */
const NineSliceFrame = ({ 
  slices = CardFrameSlices, 
  tileSize = 32, 
  style, 
  children,
  paddingHorizontal = 8,
  paddingVertical = 8,
}) => {
  const { width } = useWindowDimensions();
  const [frameWidth, setFrameWidth] = useState(0);
  
  // Calcular cuántos tiles necesitamos basado en el ancho del componente
  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setFrameWidth(width);
  };
  
  // Calcular el número de tiles necesarios para el ancho actual
  const tileCount = Math.max(1, Math.ceil((frameWidth - (tileSize * 2)) / tileSize));
  
  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {/* Frame edges - using flex layout */}
      <View style={styles.frameContainer}>
        {/* Top row */}
        <View style={styles.row}>
          <Image 
            source={slices.topLeft} 
            style={{ width: tileSize, height: tileSize }} 
            resizeMode="cover"
          />
          <View style={{ flex: 1, height: tileSize, flexDirection: 'row', overflow: 'hidden' }}>
            {Array.from({ length: tileCount }).map((_, i) => (
              <Image 
                key={`top-${i}`}
                source={slices.top} 
                style={{ width: tileSize, height: tileSize }} 
              />
            ))}
          </View>
          <Image 
            source={slices.topRight} 
            style={{ width: tileSize, height: tileSize }} 
            resizeMode="cover"
          />
        </View>
        
        {/* Middle section */}
        <View style={styles.middleSection}>
          {/* Left edge */}
          <Image 
            source={slices.left} 
            style={{ width: tileSize, height: '100%' }} 
            resizeMode="stretch"
          />
          
          {/* Center background */}
          <Image
            source={slices.mid}
            style={{ flex: 1, height: '100%' }}
            resizeMode="repeat"
          />
          
          {/* Right edge */}
          <Image 
            source={slices.right} 
            style={{ width: tileSize, height: '100%' }} 
            resizeMode="stretch"
          />
        </View>
        
        {/* Bottom row */}
        <View style={styles.row}>
          <Image 
            source={slices.botLeft} 
            style={{ width: tileSize, height: tileSize }} 
            resizeMode="cover"
          />
          <View style={{ flex: 1, height: tileSize, flexDirection: 'row', overflow: 'hidden' }}>
            {Array.from({ length: tileCount }).map((_, i) => (
              <Image 
                key={`bot-${i}`}
                source={slices.bot} 
                style={{ width: tileSize, height: tileSize }} 
              />
            ))}
          </View>
          <Image 
            source={slices.botRight} 
            style={{ width: tileSize, height: tileSize }} 
            resizeMode="cover"
          />
        </View>
      </View>
      
      {/* Content */}
      <View style={[styles.content, { paddingHorizontal, paddingVertical }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 64, 
    minWidth: 64,
  },
  frameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    height: 32,
  },
  middleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16, // Reducido el espacio para los bordes laterales
    paddingVertical: 16,   // Reducido el espacio para los bordes superior e inferior
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NineSliceFrame;
