import Phaser from 'phaser';
import { CHARACTER_ASSETS, getShopAssetKey, SHOP_ASSETS } from '../data/assets';
import { getShopsWithRecipes, type ShopWithRecipe } from '../data/shops';
import { SaveSystem } from '../systems/SaveSystem';
import { HUD } from '../ui/HUD';
import { DialogBox } from '../ui/DialogBox';

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

interface ShopEntrance {
  shop: ShopWithRecipe;
  marker: Phaser.GameObjects.Rectangle;
}

export class StreetScene extends Phaser.Scene {
  private player?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private cursors?: CursorKeys;
  private wasd?: Record<'W' | 'A' | 'S' | 'D' | 'E', Phaser.Input.Keyboard.Key>;
  private promptText?: Phaser.GameObjects.Text;
  private hud?: HUD;
  private unlockDialog?: DialogBox;
  private shopEntrances: ShopEntrance[] = [];
  private nearestShop?: ShopWithRecipe;
  private myShopEntrance?: Phaser.GameObjects.Rectangle;
  private canEnterMyShop = false;
  private unlockMessageShown = false;
  private wasMoving = false;

  constructor() {
    super('StreetScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#76a46f');
    this.shopEntrances = [];
    this.nearestShop = undefined;
    this.canEnterMyShop = false;

    this.drawStreet();
    this.drawShops();
    this.createPlayer();

    this.hud = new HUD(this);
    this.unlockDialog = new DialogBox(this, 480, 575, 820, 82);

    this.promptText = this.add
      .text(480, 505, '', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: '#ffffff',
        backgroundColor: '#1f2933',
        padding: { x: 14, y: 8 }
      })
      .setOrigin(0.5)
      .setDepth(900)
      .setVisible(false);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D,E') as Record<
      'W' | 'A' | 'S' | 'D' | 'E',
      Phaser.Input.Keyboard.Key
    >;

    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('MainMenuScene'));
  }

  update(): void {
    this.updateMovement();
    this.updateEntrances();

    if (Phaser.Input.Keyboard.JustDown(this.wasd!.E)) {
      if (this.nearestShop) {
        this.scene.start('ShopScene', { shopId: this.nearestShop.id });
      } else if (this.canEnterMyShop) {
        this.scene.start('MyShopScene');
      }
    }
  }

  private drawStreet(): void {
    this.add.rectangle(480, 320, 960, 640, 0x6fa36b);
    this.add.rectangle(140, 320, 260, 640, 0x7eb174, 0.42);
    this.add.rectangle(820, 320, 260, 640, 0x7eb174, 0.42);
    this.add.rectangle(480, 320, 304, 640, 0x515760);
    this.add.rectangle(480, 320, 268, 640, 0x626871);

    for (let y = 24; y < 640; y += 44) {
      this.add.rectangle(352, y, 16, 30, 0x454a52, 0.55);
      this.add.rectangle(608, y + 20, 16, 30, 0x454a52, 0.55);
      this.add.rectangle(480, y, 12, 28, 0xf7e9a0, 0.78);
    }

    for (let y = 36; y < 640; y += 72) {
      this.add.circle(333, y, 7, 0xffd36b, 0.7);
      this.add.circle(627, y + 30, 7, 0xffd36b, 0.7);
    }

    this.drawStreetDecorations();

    this.add.rectangle(480, 320, 18, 640, 0xf1d26a, 0.28);

    this.add.text(480, 30, 'Sogo Food Street', {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '28px',
      color: '#fff6c8',
      stroke: '#24313d',
      strokeThickness: 5
    }).setOrigin(0.5);
  }

  private drawStreetDecorations(): void {
    for (let y = 92; y <= 572; y += 120) {
      this.add.rectangle(330, y, 18, 42, 0x5c3a2e).setStrokeStyle(2, 0x2e211b);
      this.add.circle(330, y - 32, 12, 0xffbd59, 0.85).setStrokeStyle(2, 0x8a3d2b);
      this.add.rectangle(630, y + 48, 18, 42, 0x5c3a2e).setStrokeStyle(2, 0x2e211b);
      this.add.circle(630, y + 16, 12, 0xffbd59, 0.85).setStrokeStyle(2, 0x8a3d2b);
    }

    for (const item of [
      { x: 335, y: 208 },
      { x: 625, y: 338 },
      { x: 335, y: 468 },
      { x: 625, y: 590 }
    ]) {
      this.add.rectangle(item.x, item.y, 42, 24, 0x8b5a3c).setStrokeStyle(2, 0x3f2a1f);
      this.add.circle(item.x - 30, item.y + 18, 12, 0x3f8d5c).setStrokeStyle(2, 0x205137);
      this.add.circle(item.x + 30, item.y + 18, 12, 0x3f8d5c).setStrokeStyle(2, 0x205137);
    }
  }

  private drawShops(): void {
    getShopsWithRecipes().forEach((shop) => {
      const textureKey = getShopAssetKey(shop.id);

      if (this.textures.exists(textureKey)) {
        this.add.image(shop.x, shop.y, textureKey).setDisplaySize(210, 84);
      } else {
        this.drawShopFront(shop);
      }

      this.add
        .text(shop.x, shop.y - 12, shop.name, {
          fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
          fontSize: '19px',
          color: '#ffffff'
        })
        .setOrigin(0.5);
      this.add
        .text(shop.x, shop.y + 20, shop.recipe.name, {
          fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
          fontSize: '15px',
          color: '#fff3c4'
        })
        .setOrigin(0.5);

      const entranceX = shop.side === 'left' ? shop.x + 120 : shop.x - 120;
      const marker = this.add.rectangle(entranceX, shop.y, 32, 52, 0xf8e7a2, 0.85);
      this.shopEntrances.push({ shop, marker });
    });

    this.drawMyShop();
  }

  private drawShopFront(shop: ShopWithRecipe): void {
    const style = this.getShopStyle(shop.id, shop.color);
    const x = shop.x;
    const y = shop.y;

    this.add.rectangle(x + 6, y + 8, 218, 92, 0x000000, 0.18);
    this.add.rectangle(x, y, 210, 84, style.wall).setStrokeStyle(4, 0x1f2933);
    this.add.rectangle(x, y - 45, 222, 28, style.awning).setStrokeStyle(3, 0x1f2933);

    for (let i = -84; i <= 84; i += 42) {
      this.add.rectangle(x + i, y - 45, 22, 28, style.stripe, 0.78);
    }

    this.add.rectangle(x, y - 11, 132, 28, style.sign).setStrokeStyle(2, 0x1f2933);
    this.add.rectangle(x - 54, y + 27, 38, 34, style.window, 0.9).setStrokeStyle(2, 0xffffff, 0.55);
    this.add.rectangle(x + 54, y + 27, 38, 34, style.window, 0.9).setStrokeStyle(2, 0xffffff, 0.55);
    this.add.rectangle(x, y + 29, 32, 38, 0x463126).setStrokeStyle(2, 0x1f2933);

    if (shop.id === 'bbq_shop') {
      this.add.triangle(x - 76, y + 35, x - 88, y + 52, x - 76, y + 12, x - 62, y + 52, 0xff7a2d);
      this.add.triangle(x + 76, y + 35, x + 62, y + 52, x + 76, y + 12, x + 88, y + 52, 0xffd66b);
    }

    if (shop.id === 'noodle_shop' || shop.id === 'malatang_shop') {
      this.add.circle(x - 96, y - 31, 8, 0xd63031).setStrokeStyle(2, 0xffd36b);
      this.add.circle(x + 96, y - 31, 8, 0xd63031).setStrokeStyle(2, 0xffd36b);
    }
  }

  private getShopStyle(shopId: string, fallback: number): { wall: number; awning: number; stripe: number; sign: number; window: number } {
    const styles: Record<string, { wall: number; awning: number; stripe: number; sign: number; window: number }> = {
      burger_house: { wall: 0xd75a4a, awning: 0xffb347, stripe: 0xffedd2, sign: 0x8f2f25, window: 0xffcf8b },
      sushi_house: { wall: 0x5ca6d8, awning: 0x8b5e3c, stripe: 0xd7eefb, sign: 0x2e6f9e, window: 0xb7e4f8 },
      noodle_shop: { wall: 0xb9382f, awning: 0xd9a441, stripe: 0xffefb2, sign: 0x7e1f1d, window: 0xffd36b },
      malatang_shop: { wall: 0xa9345a, awning: 0x7b2d61, stripe: 0xff9a76, sign: 0x5c1b45, window: 0xffb3a7 },
      tea_shop: { wall: 0xf1d3a7, awning: 0xa97955, stripe: 0xfff3cf, sign: 0x7b4f35, window: 0xf8e7d0 },
      baozi_shop: { wall: 0xe7f1de, awning: 0x78b78a, stripe: 0xffffff, sign: 0x3f8d5c, window: 0xffffff },
      bbq_shop: { wall: 0x573225, awning: 0xe4572e, stripe: 0xffc857, sign: 0x2d1d19, window: 0xff9f43 }
    };

    return styles[shopId] ?? { wall: fallback, awning: 0xf6c85f, stripe: 0xffffff, sign: 0x1f2933, window: 0xd9e6ef };
  }

  private drawMyShop(): void {
    const save = SaveSystem.load();
    const color = save.myShopUnlocked ? 0x71c562 : 0x5d6670;
    const label = save.myShopUnlocked ? 'My Shop' : 'My Shop Locked';

    if (save.myShopUnlocked && this.textures.exists(SHOP_ASSETS.my_shop)) {
      this.add.image(770, 540, SHOP_ASSETS.my_shop).setDisplaySize(210, 84);
    } else {
      this.add.rectangle(776, 548, 218, 92, 0x000000, 0.18);
      this.add.rectangle(770, 540, 210, 84, color).setStrokeStyle(4, 0x1f2933);
      this.add.rectangle(770, 496, 222, 24, save.myShopUnlocked ? 0xffd36b : 0x87909b).setStrokeStyle(3, 0x1f2933);
    }

    this.add
      .text(770, 532, label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '20px',
        color: '#ffffff'
      })
      .setOrigin(0.5);
    this.add
      .text(770, 560, '500 coins + 5 recipes', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '14px',
        color: '#fff3c4'
      })
      .setOrigin(0.5);

    this.myShopEntrance = this.add.rectangle(650, 540, 32, 52, 0xf8e7a2, save.myShopUnlocked ? 0.85 : 0.35);
  }

  private createPlayer(): void {
    const save = SaveSystem.load();
    const playerColor = save.selectedCharacter === 'female' ? 0xf18f9b : 0x5fa8d3;
    const characterAssetKey =
      save.selectedCharacter === 'female' ? CHARACTER_ASSETS.female : CHARACTER_ASSETS.male;
    const textureKey = this.textures.exists(characterAssetKey) ? characterAssetKey : `player-${playerColor}`;

    if (!this.textures.exists(textureKey)) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x000000, 0.18);
      graphics.fillEllipse(16, 42, 24, 8);
      graphics.fillStyle(0xffd7ad);
      graphics.fillCircle(16, 11, 9);
      graphics.fillStyle(0x3b2b24);
      graphics.fillRect(7, 4, 18, 6);
      graphics.fillStyle(playerColor);
      graphics.fillRect(7, 19, 18, 17);
      graphics.fillStyle(0xffffff);
      graphics.fillRect(9, 21, 14, 5);
      graphics.fillStyle(0xffd7ad);
      graphics.fillRect(3, 22, 5, 14);
      graphics.fillRect(24, 22, 5, 14);
      graphics.fillStyle(0x263847);
      graphics.fillRect(9, 36, 6, 8);
      graphics.fillRect(18, 36, 6, 8);
      graphics.lineStyle(2, 0x1f2933);
      graphics.strokeRect(7, 19, 18, 17);
      graphics.generateTexture(textureKey, 32, 48);
      graphics.destroy();
    }

    this.player = this.physics.add.image(480, 575, textureKey);
    this.player.setDisplaySize(32, 48);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(24, 32);
  }

  private updateMovement(): void {
    if (!this.player || !this.cursors || !this.wasd) {
      return;
    }

    const speed = 190;
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    this.player.setVelocity(0);

    if (left) {
      this.player.setVelocityX(-speed);
    } else if (right) {
      this.player.setVelocityX(speed);
    }

    if (up) {
      this.player.setVelocityY(-speed);
    } else if (down) {
      this.player.setVelocityY(speed);
    }

    this.player.body.velocity.normalize().scale(speed);
    this.updateWalkingFeedback(left || right || up || down);
  }

  private updateWalkingFeedback(isMoving: boolean): void {
    if (!this.player || this.wasMoving === isMoving) {
      return;
    }

    this.wasMoving = isMoving;
    this.tweens.killTweensOf(this.player);

    if (isMoving) {
      this.tweens.add({
        targets: this.player,
        angle: { from: -2, to: 2 },
        yoyo: true,
        repeat: -1,
        duration: 120
      });
    } else {
      this.tweens.add({ targets: this.player, angle: 0, duration: 80 });
    }
  }

  private updateEntrances(): void {
    if (!this.player || !this.promptText || !this.myShopEntrance) {
      return;
    }

    this.nearestShop = undefined;
    this.canEnterMyShop = false;

    for (const entrance of this.shopEntrances) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        entrance.marker.x,
        entrance.marker.y
      );

      if (distance < 58) {
        this.nearestShop = entrance.shop;
        break;
      }
    }

    const save = SaveSystem.load();
    this.hud?.refresh();

    if (save.myShopUnlocked && !this.unlockMessageShown) {
      this.unlockMessageShown = true;
      this.unlockDialog?.show('Congratulations! You can now open your own shop on Sogo Food Street.');
    }

    const myShopDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.myShopEntrance.x,
      this.myShopEntrance.y
    );
    this.canEnterMyShop = save.myShopUnlocked && myShopDistance < 58;

    if (this.nearestShop || this.canEnterMyShop) {
      this.promptText.setText('Press E to enter').setVisible(true);
    } else {
      this.promptText.setVisible(false);
    }
  }
}
