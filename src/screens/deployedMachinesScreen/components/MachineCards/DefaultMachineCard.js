import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
            style={styles.assignNodeButton}
            onPress={() => console.log(`${machine.type} action pressed`)}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name="settings"
              size={28}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.assignNodeText}>Configure</Text>
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