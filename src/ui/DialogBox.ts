import Phaser from 'phaser';

export class DialogBox {
  private container: Phaser.GameObjects.Container;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    const background = scene.add
      .rectangle(0, 0, width, height, 0x1f2933, 0.92)
      .setStrokeStyle(3, 0xf6c85f);

    this.text = scene.add
      .text(0, 0, '', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width - 32 }
      })
      .setOrigin(0.5);

    this.container = scene.add.container(x, y, [background, this.text]).setDepth(1000).setVisible(false);
  }

  show(message: string): void {
    this.text.setText(message);
    this.container.setVisible(true);
  }

  hide(): void {
    this.container.setVisible(false);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
