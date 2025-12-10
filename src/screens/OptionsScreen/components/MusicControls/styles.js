import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

export default StyleSheet.create({
  volumeControl: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
  },
  volumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  volumeLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  volumeValue: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  volumeSlider: {
    width: '100%',
    height: 40,
  },
  playPauseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  trackList: {
    padding: 12,
  },
  trackListTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  trackOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cyan,
  },
  trackOptionActive: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderColor: '#4CAF50',
  },
  trackText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  trackTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
