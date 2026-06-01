import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';

export class HUD {
  private readonly scene: Phaser.Scene;
  private readonly text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.text = scene.add
      .text(18, 16, '', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#18212b',
        padding: { x: 12, y: 8 }
      })
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
    this.text.destroy();
  }
}
