import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    // Future pixel-art assets can be loaded here from public/assets/.
  }

  create(): void {
    this.scene.start('MainMenuScene');
  }
}
