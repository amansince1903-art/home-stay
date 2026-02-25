# Replace Unsplash Images with Local Images

## ✅ What I Did

1. Created assets folder structure: `client/src/assets/images/`
2. Updated CSS to use local image path: `/src/assets/images/hero-bg.jpg`
3. Removed Unsplash URL dependency

## 📋 What You Need to Do

### Step 1: Save Your Image

You provided a beautiful haveli courtyard image. Save it as:

**File name:** `hero-bg.jpg`

**Location:** `client/src/assets/images/hero-bg.jpg`

**How to save:**
1. Right-click on your image
2. Save as `hero-bg.jpg`
3. Place it in: `client/src/assets/images/` folder

### Step 2: Verify the Path

Make sure the file is at:
```
client/
  src/
    assets/
      images/
        hero-bg.jpg  ← Your image here
```

### Step 3: Refresh Your Browser

After placing the image:
1. Refresh your website (Ctrl+R or F5)
2. The hero section should now show your local image
3. No more dependency on Unsplash!

---

## 🎨 CSS Changes Made

### Before:
```css
background-image:
  linear-gradient(...),
  url('https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1920&q=90');
```

### After:
```css
background-image:
  linear-gradient(...),
  url('/src/assets/images/hero-bg.jpg');
```

---

## 📸 Image Recommendations

### For Best Results:

**Format:** JPG (for photos) or PNG (for graphics)

**Dimensions:** 
- Minimum: 1920x1080 pixels
- Recommended: 2560x1440 pixels
- Aspect ratio: 16:9

**File Size:**
- Target: Under 500KB
- Maximum: 1MB
- Use image compression tools if needed

**Optimization Tools:**
- TinyPNG (https://tinypng.com/)
- Squoosh (https://squoosh.app/)
- ImageOptim (Mac)

---

## 🔄 Replace Other Unsplash Images

If you want to replace other Unsplash images in your project:

### 1. Find All Unsplash URLs:
```bash
# Search in your project
grep -r "unsplash.com" client/src/
```

### 2. Common Locations:
- `client/src/pages/Home.jsx` - Room images, destination images
- `client/src/pages/About.jsx` - Team photos, timeline images
- `client/src/pages/Rooms.jsx` - Room photos
- `client/src/pages/Gallery.jsx` - Gallery images

### 3. Replace Pattern:
```javascript
// Before
img: 'https://images.unsplash.com/photo-xxx?w=600&q=80'

// After
img: '/src/assets/images/room-royal-suite.jpg'
```

---

## 📁 Suggested Folder Structure

```
client/src/assets/
  images/
    hero-bg.jpg              ← Hero section background
    rooms/
      royal-suite.jpg        ← Room images
      gangamahal.jpg
      family-kothi.jpg
    destinations/
      agra.jpg               ← Destination images
      varanasi.jpg
      lucknow.jpg
      prayagraj.jpg
    gallery/
      gallery-1.jpg          ← Gallery images
      gallery-2.jpg
      gallery-3.jpg
    team/
      host.jpg               ← Team member photos
      chef.jpg
      guide.jpg
```

---

## ⚡ Benefits of Local Images

✅ **Faster Loading:** No external API calls
✅ **Offline Support:** Works without internet
✅ **No Rate Limits:** Unsplash has API limits
✅ **Full Control:** Your own images, your brand
✅ **Better SEO:** Proper alt tags, optimized sizes
✅ **Reliability:** No dependency on external services

---

## 🐛 Troubleshooting

### Image Not Showing?

**Check 1:** File path is correct
```
client/src/assets/images/hero-bg.jpg
```

**Check 2:** File name matches exactly (case-sensitive)
```
hero-bg.jpg  ✓
Hero-Bg.jpg  ✗
hero_bg.jpg  ✗
```

**Check 3:** Clear browser cache
- Chrome: Ctrl+Shift+R (hard refresh)
- Firefox: Ctrl+F5
- Or clear cache in browser settings

**Check 4:** Check browser console (F12)
- Look for 404 errors
- Check the actual path being requested

**Check 5:** Restart Vite dev server
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

## 🎯 Quick Test

After placing your image, open browser console (F12) and check:

```javascript
// Should NOT see 404 error for:
/src/assets/images/hero-bg.jpg
```

If you see 404, the image is not in the correct location.

---

## 📝 Summary

✅ Folder created: `client/src/assets/images/`
✅ CSS updated: Now uses `/src/assets/images/hero-bg.jpg`
✅ Unsplash URL removed

**Next step:** Save your haveli image as `hero-bg.jpg` in the images folder and refresh!
