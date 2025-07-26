import React from 'react';
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';

const ProgressBar = ({ value, max = 1, label, height = 16, color = '#4CAF50', backgroundColor = '#23233a', style }) => {
  const progress = Math.max(0, Math.min(1, value / max));
  return (
    <View style={[{ marginVertical: 4 }, style]}>
      {label && <Text style={{ color: '#fff', fontSize: 12, marginBottom: 2 }}>{label}</Text>}
      <Progress.Bar
        progress={progress}
        width={null}
        height={height}
        color={color}
        unfilledColor={backgroundColor}
        borderWidth={0}
        borderRadius={8}
        animated={true}
      />
      <Text style={{ color: '#fff', fontSize: 12, marginTop: 2, textAlign: 'right' }}>{Math.floor(value)} / {max}</Text>
    </View>
  );
};

export default ProgressBar;
