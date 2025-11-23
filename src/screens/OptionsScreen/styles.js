import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImageContainer: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  optionCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    overflow: 'hidden',
    elevation: 8,
  },
  versionText: {
    fontSize: 16,
    color: '#00ffff',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  // Music Controls
  musicOption: {
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
    justifyContent: 'space-between',
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
  trackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  pauseButton: {
    padding: 6,
    marginLeft: 8,
  },
});