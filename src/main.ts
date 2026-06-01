import Phaser from 'phaser';
import './style.css';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { StreetScene } from './scenes/StreetScene';
import { ShopScene } from './scenes/ShopScene';
import { MyShopScene } from './scenes/MyShopScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 960,
  height: 640,
  backgroundColor: '#2f4858',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    CharacterSelectScene,
    StreetScene,
    ShopScene,
    MyShopScene
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
