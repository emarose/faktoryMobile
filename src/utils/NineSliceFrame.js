import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { FrameSlices } from "../../assets/images/UI/frame";

const TILE = 16; // tamaño original de tus slices

const NineSliceFrame = ({ width, height, children }) => {
  const horizontalTiles = Math.ceil(width / TILE) - 2;
  const verticalTiles = Math.ceil(height / TILE) - 2;

  return (
    <View
      style={{
        width,
        height,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top row */}
      <View style={styles.row}>
        <Image source={FrameSlices.topRight} style={styles.tile} resizeMode="contain" />
        {Array.from({ length: horizontalTiles }).map((_, i) => (
          <Image key={`top-${i}`} source={FrameSlices.topMid} style={styles.tile} resizeMode="contain" />
        ))}
        <Image source={FrameSlices.topLeft} style={styles.tile} resizeMode="contain" />
      </View>

      {/* Middle rows */}
      {Array.from({ length: verticalTiles }).map((_, y) => (
        <View key={`mid-row-${y}`} style={styles.row}>
          <Image source={FrameSlices.midLeft} style={styles.tile} resizeMode="contain" />
          {Array.from({ length: horizontalTiles }).map((_, x) => (
            <Image key={`mid-${x}-${y}`} source={FrameSlices.midMid} style={styles.tile} resizeMode="contain" />
          ))}
          <Image source={FrameSlices.midRight} style={styles.tile} resizeMode="contain" />
        </View>
      ))}

      {/* Bottom row */}
      <View style={styles.row}>
        <Image source={FrameSlices.botLeft} style={styles.tile} resizeMode="contain" />
        {Array.from({ length: horizontalTiles }).map((_, i) => (
          <Image key={`bot-${i}`} source={FrameSlices.botMid} style={styles.tile} resizeMode="contain" />
        ))}
        <Image source={FrameSlices.botRight} style={styles.tile} resizeMode="contain" />
      </View>

      {/* Contenido interno */}
      <View
        style={{
          position: "absolute",
          top: TILE,
          left: TILE,
          right: TILE,
          bottom: TILE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  tile: {
    width: TILE,
    height: TILE,
    imageRendering: "pixelated",
  },
});

export default NineSliceFrame;
