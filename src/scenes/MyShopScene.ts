import Phaser from 'phaser';
import { SHOP_ASSETS } from '../data/assets';
import { SaveSystem } from '../systems/SaveSystem';

export class MyShopScene extends Phaser.Scene {
  constructor() {
    super('MyShopScene');
  }

  create(): void {
    const save = SaveSystem.load();

    this.cameras.main.setBackgroundColor('#2f5545');
    this.add.rectangle(480, 560, 960, 160, 0x536b4d);
    this.add.rectangle(480, 530, 960, 76, 0x6f5440);
    for (let x = 70; x < 960; x += 92) {
      this.add.circle(x, 104, 10, 0xffd36b, 0.55);
      this.add.line(0, 0, x - 45, 104, x + 45, 104, 0xffd36b, 0.25).setOrigin(0);
    }

    if (save.myShopUnlocked && this.textures.exists(SHOP_ASSETS.my_shop)) {
      this.add.image(480, 325, SHOP_ASSETS.my_shop).setDisplaySize(560, 360);
    } else {
      this.add.rectangle(490, 336, 574, 374, 0x000000, 0.2);
      this.add.rectangle(480, 325, 560, 360, 0x8ecf73).setStrokeStyle(6, 0x1f2933);
      this.add.rectangle(480, 180, 592, 70, 0xffd36b).setStrokeStyle(5, 0x1f2933);
      this.add.rectangle(330, 352, 86, 144, 0x7b4a32).setStrokeStyle(4, 0x1f2933);
      this.add.rectangle(512, 354, 220, 100, 0xfff2d1, 0.78).setStrokeStyle(4, 0x1f2933);
      this.add.circle(640, 264, 28, 0xffb347, 0.8).setStrokeStyle(3, 0x8a3d2b);
    }

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
