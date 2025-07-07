# Images Directory

This directory contains the images for the collage page.

## How to Add Images

1. **File Naming**: Name your images as follows:
   - `image1.jpg`
   - `image2.jpg`
   - `image3.jpg`
   - ... up to `image20.jpg`

2. **Supported Formats**: 
   - JPG/JPEG
   - PNG
   - GIF

3. **Recommended Size**: 
   - Square images work best (e.g., 500x500 pixels)
   - The collage will automatically resize and crop images to fit

4. **File Size**: Keep images under 5MB each for optimal loading

## Current Image List

The collage expects these 20 images:
- image1.jpg
- image2.jpg
- image3.jpg
- image4.jpg
- image5.jpg
- image6.jpg
- image7.jpg
- image8.jpg
- image9.jpg
- image10.jpg
- image11.jpg
- image12.jpg
- image13.jpg
- image14.jpg
- image15.jpg
- image16.jpg
- image17.jpg
- image18.jpg
- image19.jpg
- image20.jpg

## Customizing Descriptions

To change the image descriptions that appear on hover, edit the `imageDescriptions` array in `collage.html`:

```javascript
const imageDescriptions = [
    'Your custom description 1',
    'Your custom description 2',
    // ... etc
];
```

## Missing Images

If some images are missing, the collage will show placeholder text instead of breaking the layout. 