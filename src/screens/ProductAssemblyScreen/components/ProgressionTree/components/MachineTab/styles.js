import { StyleSheet } from 'react-native';
import Colors from '../../../../../../constants/Colors';

const styles = StyleSheet.create({
  machineTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  machineIconContainer: {
    width: 24,
    height: 24,
    marginRight: 6,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  machineTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recipeCounter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  recipeCounterText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default styles;
