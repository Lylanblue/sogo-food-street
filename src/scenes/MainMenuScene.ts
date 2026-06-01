import Phaser from 'phaser';
import { getShopsWithRecipes } from '../data/shops';
import { SaveSystem } from '../systems/SaveSystem';
import { DialogBox } from '../ui/DialogBox';

export class MainMenuScene extends Phaser.Scene {
  private dialog?: DialogBox;

  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#24465a');
    this.drawCozyBackground();
    this.dialog = new DialogBox(this, 480, 552, 760, 96);

    this.add
      .text(480, 92, 'Sogo Food Street', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '54px',
        color: '#fff0a8',
        stroke: '#7d3528',
        strokeThickness: 7
      })
      .setOrigin(0.5);

    this.add
      .text(480, 145, 'From Apprentice to Owner', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '24px',
        color: '#fff7df'
      })
      .setOrigin(0.5);

    this.createButton(480, 230, 'Start Game', () => {
      const save = SaveSystem.load();
      this.scene.start(save.selectedCharacter ? 'StreetScene' : 'CharacterSelectScene');
    });

    this.createButton(480, 290, 'Select Character', () => {
      this.scene.start('CharacterSelectScene');
    });

    this.createButton(480, 350, 'Recipe Book', () => {
      const save = SaveSystem.load();
      const learned = getShopsWithRecipes()
        .filter((shop) => save.learnedRecipes.includes(shop.recipe.id))
        .map((shop) => `${shop.recipe.name} (${shop.name})`);

      this.dialog?.show(
        learned.length > 0 ? `Learned recipes:\n${learned.join(' / ')}` : 'No recipes learned yet.'
      );
    });

    this.createButton(480, 410, 'Settings', () => {
      this.dialog?.show('Settings: use WASD or arrow keys to move. Press E to enter shops.');
    });

    this.createButton(480, 470, 'Reset Progress', () => {
      SaveSystem.reset();
      this.dialog?.show('Progress reset.');
    });
  }

  private drawCozyBackground(): void {
    this.add.rectangle(480, 535, 960, 210, 0x5a6e55);
    this.add.rectangle(480, 510, 960, 90, 0x6d5642);
    this.add.rectangle(480, 522, 960, 8, 0xf6c85f, 0.28);

    for (let x = 70; x <= 890; x += 110) {
      this.add.circle(x, 118, 8, 0xffd56b, 0.8);
      this.add.line(0, 0, x - 55, 116, x + 55, 116, 0xffd56b, 0.35).setOrigin(0);
      this.tweens.add({
        targets: this.add.circle(x, 118, 14, 0xffb74d, 0.16),
        alpha: 0.32,
        duration: 900 + (x % 3) * 180,
        yoyo: true,
        repeat: -1
      });
    }

    const stalls = [
      { x: 110, color: 0xd75a4a, label: '汉堡' },
      { x: 260, color: 0x4aa3df, label: '寿司' },
      { x: 700, color: 0xd8c27a, label: '包子' },
      { x: 850, color: 0x7c4a33, label: '烧烤' }
    ];

    stalls.forEach((stall) => {
      this.add.rectangle(stall.x, 474, 120, 86, stall.color).setStrokeStyle(3, 0x263847);
      this.add.triangle(stall.x, 416, stall.x - 70, 455, stall.x, 390, stall.x + 70, 455, 0xffe69a);
      this.add.text(stall.x, 474, stall.label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#263847',
        strokeThickness: 4
      }).setOrigin(0.5);
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const shadow = this.add.rectangle(x + 4, y + 5, 292, 48, 0x000000, 0.2);
    const button = this.add
      .rectangle(x, y, 292, 48, 0xf6c85f)
      .setStrokeStyle(3, 0x1c2933)
      .setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: '#1c2933',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    const targets = [shadow, button, text];
    button.on('pointerover', () => {
      button.setFillStyle(0xffdf81);
      this.tweens.add({ targets, scaleX: 1.04, scaleY: 1.04, duration: 90 });
    });
    button.on('pointerout', () => {
      button.setFillStyle(0xf6c85f);
      this.tweens.add({ targets, scaleX: 1, scaleY: 1, duration: 90 });
    });
    button.on('pointerdown', onClick);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  }
}
