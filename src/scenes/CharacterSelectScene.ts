import Phaser from 'phaser';
import { CHARACTER_ASSETS } from '../data/assets';
import { SaveSystem, type CharacterType } from '../systems/SaveSystem';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#2d4f65');
    this.drawBackground();

    this.add
      .text(480, 90, 'Select Character', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '44px',
        color: '#fff0a8',
        stroke: '#253747',
        strokeThickness: 6
      })
      .setOrigin(0.5);

    this.createCharacterCard(330, 310, 'male', 0x5fa8d3, 'Male');
    this.createCharacterCard(630, 310, 'female', 0xf18f9b, 'Female');
    this.createTextButton(480, 540, 'Back', () => this.scene.start('MainMenuScene'));
  }

  private drawBackground(): void {
    this.add.rectangle(480, 570, 960, 140, 0x516b4f);
    for (let x = 58; x < 960; x += 86) {
      this.add.rectangle(x, 570, 54, 16, 0x6f8461, 0.85);
      this.add.circle(x + 26, 520, 12, 0xffd36b, 0.35);
    }
    this.add.text(480, 154, 'Choose your apprentice chef', {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '20px',
      color: '#fff7df'
    }).setOrigin(0.5);
  }

  private createCharacterCard(x: number, y: number, character: CharacterType, color: number, label: string): void {
    const shadow = this.add.rectangle(x + 7, y + 8, 218, 308, 0x000000, 0.22);
    const card = this.add
      .rectangle(x, y, 210, 300, 0x21313f)
      .setStrokeStyle(4, 0xf6c85f)
      .setInteractive({ useHandCursor: true });

    const textureKey = CHARACTER_ASSETS[character];

    if (this.textures.exists(textureKey)) {
      this.add.image(x, y - 60, textureKey).setDisplaySize(96, 128);
    } else {
      this.add.ellipse(x, y - 124, 60, 54, 0xffd7ad).setStrokeStyle(3, 0x4b3425);
      this.add.rectangle(x, y - 54, 72, 104, color).setStrokeStyle(3, 0xffffff);
      this.add.rectangle(x - 22, y - 110, 10, 8, 0x263847);
      this.add.rectangle(x + 22, y - 110, 10, 8, 0x263847);
      this.add.rectangle(x, y - 88, 34, 6, 0xffffff, 0.9);
      this.add.rectangle(x - 38, y - 45, 18, 74, 0xffd7ad).setStrokeStyle(2, 0x4b3425);
      this.add.rectangle(x + 38, y - 45, 18, 74, 0xffd7ad).setStrokeStyle(2, 0x4b3425);
    }
    this.add
      .text(x, y + 105, label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '28px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    const select = () => {
      SaveSystem.setCharacter(character);
      this.scene.start('StreetScene');
    };

    card.on('pointerover', () => {
      card.setFillStyle(0x2b4052);
      this.tweens.add({ targets: [shadow, card], scaleX: 1.03, scaleY: 1.03, duration: 120 });
    });
    card.on('pointerout', () => {
      card.setFillStyle(0x21313f);
      this.tweens.add({ targets: [shadow, card], scaleX: 1, scaleY: 1, duration: 120 });
    });
    card.on('pointerdown', select);
  }

  private createTextButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(x, y, label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: '#f8e7a2',
        backgroundColor: '#1f2933',
        padding: { x: 22, y: 10 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerdown', onClick);
  }
}
