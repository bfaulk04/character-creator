# Character Creator 🎨

A fun, interactive web app that lets you build and customize your own cartoon characters! Mix and match different body parts, accessories, and features to create unique characters.

## 🌟 Try It Out

**Live Demo:** [https://bfaulk04.github.io/character-creator/](https://bfaulk04.github.io/character-creator/)

## 🎮 How to Use

1. **Choose a Body** - Click the "Body" button to pick your character's base
2. **Add Features** - Select eyes, mouth, head accessories, and body accessories from the right panel
3. **Move Things Around** - Click any component thumbnail to show movement controls
4. **Fine-tune Position** - Use the arrow buttons to nudge components 5 pixels at a time
5. **Export Your Character** - Click "Export" to save your creation (coming soon!)

## 🛠️ How It Works

This character creator is built with simple web technologies that work in any browser:

- **HTML** - The structure and layout of the app
- **CSS (Tailwind)** - Makes everything look nice and colorful
- **JavaScript** - Handles all the clicking, moving, and character building
- **PNG Images** - Transparent character parts that stack on top of each other

### The Magic Behind the Scenes

**Layered Images**: Each character is made of 5 layers that stack like pancakes:
- Layer 0: Body (bottom)
- Layer 1: Mouth
- Layer 2: Eyes  
- Layer 3: Head accessories (like hats)
- Layer 4: Body accessories (like ties) (top)

**Smart Positioning**: When you first add a component, it automatically appears in a good spot:
- Hats appear slightly above the head
- Eyes appear slightly above center
- Mouths appear slightly below center
- Accessories appear lower on the body

**Visual Feedback**: The app uses colors to show you what's happening:
- Green borders = currently selected
- Blue borders = being moved around
- Gray borders = available to select

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

The app uses modern web standards but keeps things simple. No complicated frameworks or build tools required!

## 🔮 Future Features

- PDF export for printing your characters
- Save/load character designs
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

**Made with ❤️ for creative kids and adults who never grew up!**
