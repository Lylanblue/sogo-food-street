import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';

export class HUD {
  private readonly scene: Phaser.Scene;
  private readonly panel: Phaser.GameObjects.Container;
  private readonly text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const shadow = scene.add.rectangle(3, 4, 258, 92, 0x000000, 0.22);
    const background = scene.add.rectangle(0, 0, 258, 92, 0x263847, 0.94).setStrokeStyle(3, 0xffd36b);
    const coin = scene.add.circle(-108, -27, 10, 0xffc857).setStrokeStyle(2, 0x8f5a18);
    const sparkle = scene.add.star(-101, -34, 4, 2, 5, 0xfff2a8, 0.85);

    this.text = scene.add
      .text(-84, -34, '', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '17px',
        color: '#ffffff',
        lineSpacing: 5
      })
      .setOrigin(0, 0);

    this.panel = scene.add
      .container(147, 64, [shadow, background, coin, sparkle, this.text])
      .setScrollFactor(0)
      .setDepth(900);

    this.refresh();
  }

  refresh(): void {
    const save = SaveSystem.load();
    const goal = save.myShopUnlocked ? 'Goal: Open My Shop' : 'Goal: 500 coins + 5 recipes';

    this.text.setText(
      `Coins: ${save.coins}\nLearned Recipes: ${save.learnedRecipes.length}\n${goal}`
    );
  }

  destroy(): void {
    this.panel.destroy(true);
  }
}
