import Phaser from 'phaser';
import { AssetLoader } from '../systems/AssetLoader';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    this.add
      .text(480, 320, 'Loading Sogo Food Street...', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '24px',
        color: '#ffffff'
      })
      .setOrigin(0.5);
  }

  create(): void {
    void this.loadAssetsThenStart();
  }

  private async loadAssetsThenStart(): Promise<void> {
    await AssetLoader.loadOptionalAssets(this);
    this.scene.start('MainMenuScene');
  }
}
