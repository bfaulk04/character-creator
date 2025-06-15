# Ѕρгцηκі Character Creator 🎨

A fun, interactive web app that lets you build and customize your own Ѕρгцηκі characters! Mix and match different body parts, accessories, and features to create unique Ѕρгцηκі characters.

## 🌟 Try It Out

**Live Demo:** [https://bfaulk04.github.io/character-creator/](https://bfaulk04.github.io/character-creator/)

## 🎮 How to Use

1. **Choose a Body** - Click the "Body" button to pick your character's base
2. **Add Features** - Select Eyes, Mouth, Head, and Accessories from the right panel
3. **Move Things Around** - Click any component thumbnail to show movement controls
4. **Fine-tune Position, Scale & Rotation** - Use the arrow or sliders to nudge components a few pixels at a time
5. **Export Your Character** - Click "Export" to save your creation to PDF for printing
6. **Saved Characters**: The app lets you store your favorite creations:
- Layers, body styles, even backgrounds can be reloaded in a click
- Load, Save or Delete your saved characters from the Manage menu
- There are 8 slots available for your characters, use them wisely!

## 🛠️ How It Works

This character creator is built with simple web technologies that work in any browser:

- **HTML** - The structure and layout of the app
- **CSS (Tailwind)** - Makes everything look nice and colorful
- **JavaScript** - Handles all the clicking, moving, and character building
- **PNG Images** - Transparent character parts that stack on top of each other

### The Magic Behind the Scenes

**Layered Images**: Each character is made of 5 layers that stack like pancakes:

- Layer 5: Accessories (like ties) —TOP—
- Layer 4: Head items (like hats)
- Layer 3: Eyes
- Layer 2: Mouth
- Layer 1: Body —BOTTOM—

## 📁 Project Structure

```
character-creator/
├── index.html          # The main app file
├── assets/
│   ├── icon/          # Small preview images for body selection
│   │   ├── icon-1.png
│   │   ├── icon-2.png
│   │   └── ...
│   ├── body/          # Full-size body images
│   │   ├── body-1.png
│   │   ├── body-2.png
│   │   └── ...
│   ├── eyes/          # Eye component images
│   ├── mouth/         # Mouth component images
│   ├── head/          # Head accessory images
│   └── accessory/     # Body accessory images
└── README.md          # This file!
```

## 🎨 Adding Your Own Assets

Want to add more character parts? Here's how:

1. **Create PNG images** with transparent backgrounds (272x406 pixels work best)
2. **Name them correctly**: `body-1.png`, `eyes-1.png`, etc.
3. **Add to the right folder** in the assets directory
4. **Update the counts** in the JavaScript (look for `componentCounts`)

For body parts, you'll also need small preview icons in the `/assets/icon/` folder named `icon-1.png`, `icon-2.png`, etc.

## 🚀 Technical Details

- **No servers needed** - runs completely in your browser
- **No databases** - everything stays on your device
- **Responsive design** - works on computers and tablets
- **Lightweight** - just HTML, CSS, and JavaScript
- **Saved characters** - using Local Storage for up to 8 characters

The app uses modern web standards but keeps things simple. No complicated frameworks or build tools required!

## 🔮 Future Features

- SVG-based characters (color changing)
- More customization options
- Animation effects
- Share characters with friends

## 🤝 Contributing

Found a bug or have an idea? Feel free to:
- Open an issue on GitHub
- Submit a pull request
- Share your custom character assets

## 📄 License

This project is open source and available under the MIT License. Feel free to use it, modify it, and learn from it!

---

**Made with ❤️ for Morris, from Dad!**
