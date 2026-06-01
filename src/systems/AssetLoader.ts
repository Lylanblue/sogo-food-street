import Phaser from 'phaser';
import { OPTIONAL_ASSETS, type GameAsset } from '../data/assets';

export class AssetLoader {
  static async loadOptionalAssets(scene: Phaser.Scene): Promise<void> {
    const availableAssets = await AssetLoader.findAvailableAssets(OPTIONAL_ASSETS);

    if (availableAssets.length === 0) {
      return;
    }

    availableAssets.forEach((asset) => {
      if (asset.kind === 'image') {
        scene.load.image(asset.key, asset.path);
      } else {
        scene.load.audio(asset.key, asset.path);
      }
    });

    await new Promise<void>((resolve) => {
      scene.load.once('complete', () => resolve());
      scene.load.start();
    });
  }

  private static async findAvailableAssets(assets: GameAsset[]): Promise<GameAsset[]> {
    const results = await Promise.all(assets.map((asset) => AssetLoader.assetExists(asset)));
    return assets.filter((_, index) => results[index]);
  }

  private static async assetExists(asset: GameAsset): Promise<boolean> {
    try {
      const response = await fetch(asset.path, {
        method: 'HEAD',
        cache: 'no-cache'
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
