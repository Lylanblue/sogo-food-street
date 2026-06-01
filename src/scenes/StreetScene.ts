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
    this.add.rectangle(480, 320, 290, 640, 0x5b5f66);
    this.add.rectangle(480, 320, 18, 640, 0xf1d26a, 0.75);

    for (let y = 40; y < 640; y += 80) {
      this.add.rectangle(480, y, 12, 42, 0xf7e9a0);
    }

    this.add.text(480, 30, 'Sogo Food Street', {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  private drawShops(): void {
    getShopsWithRecipes().forEach((shop) => {
      const textureKey = getShopAssetKey(shop.id);

      if (this.textures.exists(textureKey)) {
        this.add.image(shop.x, shop.y, textureKey).setDisplaySize(210, 84);
      } else {
        this.add.rectangle(shop.x, shop.y, 210, 84, shop.color).setStrokeStyle(4, 0x1f2933);
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

  private drawMyShop(): void {
    const save = SaveSystem.load();
    const color = save.myShopUnlocked ? 0x71c562 : 0x5d6670;
    const label = save.myShopUnlocked ? 'My Shop' : 'My Shop Locked';

    if (save.myShopUnlocked && this.textures.exists(SHOP_ASSETS.my_shop)) {
      this.add.image(770, 540, SHOP_ASSETS.my_shop).setDisplaySize(210, 84);
    } else {
      this.add.rectangle(770, 540, 210, 84, color).setStrokeStyle(4, 0x1f2933);
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
      graphics.fillStyle(playerColor);
      graphics.fillRect(0, 0, 28, 36);
      graphics.lineStyle(2, 0xffffff);
      graphics.strokeRect(0, 0, 28, 36);
      graphics.generateTexture(textureKey, 28, 36);
      graphics.destroy();
    }

    this.player = this.physics.add.image(480, 575, textureKey);
    this.player.setDisplaySize(28, 36);
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
