import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';

export class MyShopScene extends Phaser.Scene {
  constructor() {
    super('MyShopScene');
  }

  create(): void {
    const save = SaveSystem.load();

    this.cameras.main.setBackgroundColor('#2f5545');

    this.add.rectangle(480, 325, 560, 360, 0x8ecf73).setStrokeStyle(6, 0x1f2933);
    this.add.rectangle(480, 225, 430, 70, 0xf6c85f).setStrokeStyle(4, 0x1f2933);
    this.add.rectangle(480, 385, 340, 120, 0x7b4a32).setStrokeStyle(4, 0x1f2933);

    this.add
      .text(480, 225, 'My Shop', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '42px',
        color: '#1f2933'
      })
      .setOrigin(0.5);

    this.add
      .text(
        480,
        320,
        save.myShopUnlocked
          ? 'Congratulations! You opened your own store on Sogo Food Street.'
          : 'Your shop is still locked. Learn more recipes and earn more coins.',
        {
          fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
          fontSize: '24px',
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: 640 }
        }
      )
      .setOrigin(0.5);

    this.add
      .text(480, 438, `Coins: ${save.coins}   Learned Recipes: ${save.learnedRecipes.length}`, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: '#fff3c4'
      })
      .setOrigin(0.5);

    this.createButton(480, 535, 'Back to Street', () => this.scene.start('StreetScene'));
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('StreetScene'));
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(x, y, label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: '#1f2933',
        backgroundColor: '#f6c85f',
        padding: { x: 20, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerdown', onClick);
  }
}
