# Asset Plan

Put real pixel-art assets in these folders. The game checks whether each file exists before loading it, so missing files are safe.

Recommended style for the current MVP:

- Pixel art PNGs with transparent backgrounds where possible.
- Character sprites around `32x48` or `48x64`.
- Shop storefronts around `210x84`.
- Food icons around `96x96`.
- UI icons/panels can be any size; the code will scale them when used later.
- Audio files should be short MP3 effects.

## Expected Files

### characters

```text
public/assets/characters/male.png
public/assets/characters/female.png
```

### shops

```text
public/assets/shops/burger_house.png
public/assets/shops/sushi_house.png
public/assets/shops/noodle_shop.png
public/assets/shops/malatang_shop.png
public/assets/shops/tea_shop.png
public/assets/shops/baozi_shop.png
public/assets/shops/bbq_shop.png
public/assets/shops/my_shop.png
```

### food

```text
public/assets/food/cheese_burger.png
public/assets/food/salmon_sushi.png
public/assets/food/xiangyang_beef_noodles.png
public/assets/food/malatang.png
public/assets/food/bubble_tea.png
public/assets/food/pork_baozi.png
public/assets/food/lamb_skewer.png
```

### ui

```text
public/assets/ui/coin.png
public/assets/ui/dialog_panel.png
public/assets/ui/button.png
```

### audio

```text
public/assets/audio/success.mp3
public/assets/audio/failure.mp3
```

## Code Map

The authoritative asset list is in:

```text
src/data/assets.ts
```

Optional loading is handled by:

```text
src/systems/AssetLoader.ts
```

If a listed asset is missing, the game keeps using the existing placeholder rectangles and text.
