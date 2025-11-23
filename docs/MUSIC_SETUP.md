# Background Music Implementation

## Files Created/Modified

### New Files:
- `src/contexts/AudioContext.js` - Audio context provider for global music management

### Modified Files:
- `App.js` - Wrapped with AudioProvider
- `src/screens/OptionsScreen/OptionsScreen.js` - Added music controls
- `src/screens/OptionsScreen/styles.js` - Added music control styles

## Setup Instructions

### 1. Add Your Music Files

Place your 4-5 music tracks in `assets/sounds/` directory. Example structure:
```
assets/
  sounds/
    track1.mp3
    track2.mp3
    track3.mp3
    track4.mp3
    track5.mp3  (optional)
```

### 2. Update Track Configuration

Edit `src/contexts/AudioContext.js` and update the `MUSIC_TRACKS` array (lines 5-22) to match your actual audio files:

```javascript
const MUSIC_TRACKS = [
  {
    id: 'track1',
    name: 'Main Theme',  // Update with your track name
    file: require('../../assets/sounds/track1.mp3'),  // Update path
  },
  {
    id: 'track2',
    name: 'Mining Blues',  // Update with your track name
    file: require('../../assets/sounds/track2.mp3'),  // Update path
  },
  // Add more tracks as needed
];
```

## Features Implemented

✅ Automatic playlist playback (plays tracks back-to-back in order, loops)
✅ Mute/unmute toggle with visual feedback
✅ Track selection interface (tap any track to play it)
✅ Background audio (continues when app is backgrounded)
✅ Persists across all screens
✅ Visual indicators for current playing track

## Usage

### In Options Screen
- Toggle mute/unmute with the switch
- Select any track from the list to start playing it
- Current track is highlighted in green

### Quick Mute Access (Optional)
To add a quick mute button to any screen header:

```javascript
import { useAudio } from '../../contexts/AudioContext';

const YourScreen = () => {
  const { isMuted, toggleMute } = useAudio();
  
  return (
    <CustomHeader
      title="Your Screen"
      rightIcon={isMuted ? "volume-off" : "volume-high"}
      onRightIconPress={toggleMute}
    />
  );
};
```

## Testing

1. Run the app: `npm start` or `expo start`
2. Navigate to Options screen
3. Check music is playing (should auto-start)
4. Test mute toggle
5. Test track selection
6. Verify tracks play continuously back-to-back
