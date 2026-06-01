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
    this.cameras.main.setBackgroundColor('#263847');
    this.dialog = new DialogBox(this, 480, 552, 760, 96);

    this.add
      .text(480, 92, 'Sogo Food Street', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '54px',
        color: '#f8e7a2'
      })
      .setOrigin(0.5);

    this.add
      .text(480, 145, 'From Apprentice to Owner', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '24px',
        color: '#ffffff'
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

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = this.add
      .rectangle(x, y, 280, 42, 0xf6c85f)
      .setStrokeStyle(3, 0x1c2933)
      .setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: '#1c2933'
      })
      .setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0xffd976));
    button.on('pointerout', () => button.setFillStyle(0xf6c85f));
    button.on('pointerdown', onClick);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  }
}
