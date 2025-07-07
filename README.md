# 🗺️ Location Hints Adventure

A progressive location-based hint system that reveals hints only after visiting specific locations or using override codes.

## Features

- **Progressive Hint System**: Hints are revealed one by one as you solve them
- **Location-Based Verification**: Uses browser geolocation to verify you're at the correct location
- **Override Codes**: Skip location requirements for testing or accessibility
- **Progress Persistence**: Your progress is automatically saved in the browser
- **Modern UI**: Clean, responsive design with smooth animations
- **Real-time Location Checking**: See your distance from target locations

## How to Use

### Getting Started

1. Open `index.html` in a modern web browser
2. Allow location access when prompted
3. Click "Check Current Location" to verify your position
4. Visit the locations described in the hints to solve them

### Solving Hints

**Method 1: Visit the Location**
- Each hint describes a specific location
- Go to that location and click "Check Current Location"
- If you're within the specified radius, the hint will be solved automatically

**Method 2: Use Override Codes**
- Enter the override code in the "Override Code" section
- Click "Submit" to unlock the hint without visiting the location
- Override codes are provided for testing and accessibility


## Technical Details

### Location Detection
- Uses the browser's Geolocation API
- Calculates distance using the Haversine formula
- Configurable radius for each location (100-200 meters)
- High accuracy mode enabled for better precision

### Data Storage
- Progress is saved in browser's localStorage
- Automatically loads previous progress on page refresh
- No server required - everything runs locally

### Browser Compatibility
- Requires HTTPS for geolocation (or localhost for development)
- Modern browsers with Geolocation API support
- Responsive design works on mobile and desktop

## Customization

### Adding New Hints

Edit the `hints` array in `script.js`:

```javascript
{
    id: 6,
    title: "Your Custom Hint",
    description: "Description of the hint",
    location: {
        name: "Location Name",
        latitude: 40.1234,  // Decimal degrees
        longitude: -73.5678, // Decimal degrees
        radius: 150 // meters
    },
    overrideCode: "CUSTOM123"
}
```

### Modifying Locations

- **Latitude/Longitude**: Use decimal degrees (e.g., 40.7829, -73.9654)
- **Radius**: Distance in meters from the center point
- **Override Codes**: Any alphanumeric string (case-insensitive)

### Styling

The website uses CSS custom properties and modern design patterns. Modify `styles.css` to change:
- Colors and gradients
- Animations and transitions
- Layout and spacing
- Mobile responsiveness

## Development

### Local Development
1. Clone or download the files
2. Open `index.html` in a browser
3. For geolocation testing, use a local server (e.g., `python -m http.server`)

### Testing Override Codes
- Use the provided override codes to test the system
- Each hint has a unique code that bypasses location requirements
- Codes are case-insensitive

### Geolocation Testing
- Use browser developer tools to simulate different locations
- Chrome DevTools → More tools → Sensors → Location
- Set custom coordinates to test different scenarios

## Privacy

- Location data is only used locally in your browser
- No location information is sent to any server
- Progress is stored only in your browser's localStorage
- You can clear data by clearing browser storage

## Troubleshooting

### Location Not Working
- Ensure you're using HTTPS or localhost
- Check browser permissions for location access
- Try refreshing the page and allowing location again
- Use override codes if location access is problematic

### Hints Not Unlocking
- Verify you're within the specified radius of the location
- Check that the previous hint has been solved
- Try using the override code for testing

### Progress Not Saving
- Check if localStorage is enabled in your browser
- Try clearing browser data and starting fresh
- Ensure JavaScript is enabled

## License

This project is open source and available under the MIT License. 
