import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import Colors from '../../../../constants/Colors';
import { useMachineCard, getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';

const DefaultMachineCard = ({ machine, navigation }) => {
  const { machineColor, displayName } = useMachineCard(machine);

  return (
    <View
      style={[
        styles.machineCard,
        {
          borderColor: machineColor,
          backgroundColor: Colors.backgroundPanel,
        },
      ]}
    >
      {/* Machine Header */}
      <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAlignCenterGap}>
              <View
                style={[
                  styles.machineIconContainer,
                  { backgroundColor: machineColor },
                ]}
              >
                {getMachineIcon(machine.type, Colors.textPrimary)}
              </View>
              <Text style={[styles.machineName, { color: machineColor }]}>
                {displayName}
              </Text>
            </View>
          </View>
        </View>

        {/* Generic Action Button */}
        <View style={styles.marginVertical10}>
          <TouchableOpacity
            onPress={() => console.log(`${machine.type} action pressed`)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#00ffff', '#ff00cc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.assignNodeButton}
            >
              <View style={styles.assignNodeButtonInner}>
                <MaterialIcons
                  name="settings"
                  size={20}
                  color={Colors.textPrimary}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.assignNodeText}>Configure</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Default Status */}
      <View style={styles.extraInfoContainer}>
        <Text style={styles.machineStatus}>
          {machine.type} machine (not yet configured)
        </Text>
      </View>
    </View>
  );
};

export default DefaultMachineCard;