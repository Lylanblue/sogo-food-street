import Phaser from 'phaser';
import { SaveSystem, type CharacterType } from '../systems/SaveSystem';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#31475b');

    this.add
      .text(480, 90, 'Select Character', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '44px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.createCharacterCard(330, 310, 'male', 0x5fa8d3, 'Male');
    this.createCharacterCard(630, 310, 'female', 0xf18f9b, 'Female');
    this.createTextButton(480, 540, 'Back', () => this.scene.start('MainMenuScene'));
  }

  private createCharacterCard(x: number, y: number, character: CharacterType, color: number, label: string): void {
    const card = this.add
      .rectangle(x, y, 210, 300, 0x21313f)
      .setStrokeStyle(4, 0xf6c85f)
      .setInteractive({ useHandCursor: true });

    this.add.rectangle(x, y - 45, 70, 110, color).setStrokeStyle(3, 0xffffff);
    this.add.circle(x, y - 120, 34, color).setStrokeStyle(3, 0xffffff);
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

    card.on('pointerover', () => card.setFillStyle(0x2b4052));
    card.on('pointerout', () => card.setFillStyle(0x21313f));
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
