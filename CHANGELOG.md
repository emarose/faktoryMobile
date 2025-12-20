# Changelog

All notable changes to Faktory Mobile will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dynamic app version display in Options screen
- Changelog tracking system

## [1.2.0] - 2025-12-13

### Added
- Smooth player sprite animations using react-native-reanimated (runs on UI thread for 60fps)
- Visual player position shared values for better animation performance
- Pathfinding system with automatic walking to clicked tiles
- Trail dots showing player's last 10 visited positions
- Unique walk session IDs to prevent animation conflicts
- Pending walk timeouts management for better walk cancellation

### Changed
- Player movement now uses Reanimated shared values instead of React state for position
- Walking stops and clears all pending animations when clicking elsewhere
- Trail rendering now shows tiles being left, not entered
- Improved direction handling for smoother sprite orientation

### Fixed
- Player sprite animation synchronization during walks
- Animation conflicts when clicking rapidly during walks
- Trail dots now correctly show the path behind the player

## [1.1.0] - 2025-12-11

### Added
- Mini progress bars on mining nodes showing depletion status
- Visual feedback when trying to walk through blocked tiles
- Toast notifications for movement restrictions
- Depleted node visual indicators (grayed out appearance)
- Node amounts passed to MapGrid for real-time depletion display

### Changed
- Grid styling updated with dashed borders for empty tiles
- Selected nodes now use solid borders, unselected use dotted
- Node border colors adjusted for better visibility (rgba overlay)
- Improved tile spacing and visual hierarchy

### Fixed
- Player sprite movement issue resolved
- Position update timing for smoother animations (200ms delay)
- Direction setting now happens before movement for correct sprite orientation

## [1.0.0] - 2025-12-10

### Added
- Music system with 4 tracks and playlist management
- Volume control with slider (0-100%)
- Play/pause functionality
- Track selection and automatic progression
- Persisted audio settings using AsyncStorage
- Music controls component in Options screen
- Settings persist across app restarts

### Changed
- Refactored Options screen with modular components
- Split music controls into separate reusable component
- Updated default volume from 0 to 30%
- Changed song order in playlist (The Antidote now plays first)

### Fixed
- Audio settings now load before playback starts
- Volume changes persist correctly
- Music player respects paused state on app restart

## [0.9.0] - 2025-12-11

### Added
- Android build configuration and gradle setup
- Native build support for Android platform

### Changed
- Project structure updated to support native builds

## [0.8.0] - Earlier

### Added
- Production system with idle state support
- Machine pause/resume functionality
- Miner production respects isIdle flag

### Fixed
- Production loop now correctly handles paused machines
- Miners no longer produce when marked as idle
