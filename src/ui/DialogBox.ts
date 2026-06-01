import Phaser from 'phaser';

export class DialogBox {
  private container: Phaser.GameObjects.Container;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    const shadow = scene.add.rectangle(5, 6, width, height, 0x000000, 0.22);
    const background = scene.add.rectangle(0, 0, width, height, 0x263847, 0.96).setStrokeStyle(3, 0xf6c85f);
    const topHighlight = scene.add.rectangle(0, -height / 2 + 5, width - 14, 6, 0xffe69a, 0.45);

    this.text = scene.add
      .text(0, 0, '', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width - 32 }
      })
      .setOrigin(0.5);

    this.container = scene.add
      .container(x, y, [shadow, background, topHighlight, this.text])
      .setDepth(1000)
      .setVisible(false)
      .setAlpha(0);
  }

  show(message: string): void {
    this.text.setText(message);
    this.container.setVisible(true).setAlpha(0).setScale(0.98);
    this.container.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scale: 1,
      duration: 140,
      ease: 'Quad.easeOut'
    });
  }

  hide(): void {
    this.container.setVisible(false);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
