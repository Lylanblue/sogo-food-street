import Phaser from 'phaser';
import { getFoodAssetKey } from '../data/assets';
import { getShopById, type ShopWithRecipe } from '../data/shops';
import { SaveSystem } from '../systems/SaveSystem';
import { DialogBox } from '../ui/DialogBox';

interface ShopSceneData {
  shopId: string;
}

export class ShopScene extends Phaser.Scene {
  private shop?: ShopWithRecipe;
  private selectedIngredients = new Set<string>();
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private resultDialog?: DialogBox;

  constructor() {
    super('ShopScene');
  }

  init(data: ShopSceneData): void {
    this.shop = getShopById(data.shopId);
    this.selectedIngredients.clear();
    this.optionTexts = [];
  }

  create(): void {
    if (!this.shop) {
      this.scene.start('StreetScene');
      return;
    }

    this.cameras.main.setBackgroundColor('#273642');
    this.drawKitchenBackground();
    this.resultDialog = new DialogBox(this, 480, 555, 820, 90);

    const recipe = this.shop.recipe;
    const save = SaveSystem.load();
    const alreadyLearned = save.learnedRecipes.includes(recipe.id);

    this.add.rectangle(480, 240, 750, 330, 0x1f2933, 0.5);
    this.add.rectangle(480, 238, 730, 310, 0x334656, 0.94).setStrokeStyle(4, 0xf6c85f);
    this.add.rectangle(480, 412, 660, 34, 0x7b4a32).setStrokeStyle(3, 0x3a241a);

    this.add
      .text(480, 62, this.shop.name, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '40px',
        color: '#fff0a8',
        stroke: '#1f2933',
        strokeThickness: 6
      })
      .setOrigin(0.5);

    this.add
      .text(480, 122, `Learn recipe: ${recipe.name}`, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '25px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.add
      .text(480, 172, 'Choose the correct ingredients:', {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '20px',
        color: '#d9e6ef'
      })
      .setOrigin(0.5);

    const foodAssetKey = getFoodAssetKey(recipe.id);
    if (this.textures.exists(foodAssetKey)) {
      this.add.image(780, 132, foodAssetKey).setDisplaySize(96, 96);
    } else {
      this.drawFoodBadge(780, 132, recipe.name);
    }

    recipe.ingredientOptions.forEach((ingredient, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 280 + col * 200;
      const y = 245 + row * 72;
      this.createIngredientOption(x, y, ingredient);
    });

    this.createButton(360, 430, 'Check Recipe', () => this.checkRecipe());
    this.createButton(600, 430, 'Back to Street', () => this.scene.start('StreetScene'));

    if (alreadyLearned) {
      this.resultDialog.show(`You already learned ${recipe.name}. Keep exploring Sogo Food Street!`);
    }

    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('StreetScene'));
  }

  private drawKitchenBackground(): void {
    this.add.rectangle(480, 590, 960, 100, 0x5e4635);
    for (let x = 42; x < 960; x += 64) {
      this.add.rectangle(x, 590, 50, 16, 0x6f5440, 0.75);
    }
    this.add.circle(104, 102, 24, 0xffd36b, 0.16);
    this.add.circle(856, 102, 24, 0xffd36b, 0.16);
  }

  private drawFoodBadge(x: number, y: number, label: string): void {
    this.add.circle(x, y, 52, 0xfff2d1).setStrokeStyle(4, 0x8b5a3c);
    this.add.circle(x, y + 2, 34, this.shop?.color ?? 0xf6c85f, 0.86);
    this.add.text(x, y, label.slice(0, 2), {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#1f2933',
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  private createIngredientOption(x: number, y: number, ingredient: string): void {
    this.add.rectangle(x + 4, y + 5, 166, 48, 0x000000, 0.2);
    const option = this.add
      .text(x, y, `[ ] ${ingredient}`, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '21px',
        color: '#ffffff',
        backgroundColor: '#263847',
        padding: { x: 16, y: 11 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    option.on('pointerdown', () => {
      if (this.selectedIngredients.has(ingredient)) {
        this.selectedIngredients.delete(ingredient);
      } else {
        this.selectedIngredients.add(ingredient);
      }

      this.refreshIngredientOptions();
    });
    option.on('pointerover', () => this.tweens.add({ targets: option, scaleX: 1.05, scaleY: 1.05, duration: 80 }));
    option.on('pointerout', () => this.tweens.add({ targets: option, scaleX: 1, scaleY: 1, duration: 80 }));

    this.optionTexts.push(option);
  }

  private refreshIngredientOptions(): void {
    this.optionTexts.forEach((option) => {
      const ingredient = option.text.replace('[ ] ', '').replace('[x] ', '');
      const selected = this.selectedIngredients.has(ingredient);
      option.setText(`${selected ? '[x]' : '[ ]'} ${ingredient}`);
      option.setStyle({
        color: selected ? '#1f2933' : '#ffffff',
        backgroundColor: selected ? '#f6c85f' : '#263847'
      });
    });
  }

  private checkRecipe(): void {
    if (!this.shop || !this.resultDialog) {
      return;
    }

    const recipe = this.shop.recipe;
    const correctIngredients = [...recipe.correctIngredients].sort();
    const selectedIngredients = [...this.selectedIngredients].sort();
    const isCorrect =
      correctIngredients.length === selectedIngredients.length &&
      correctIngredients.every((ingredient, index) => ingredient === selectedIngredients[index]);

    if (!isCorrect) {
      this.resultDialog.show('Not quite right. Try again.');
      this.cameras.main.shake(120, 0.004);
      return;
    }

    SaveSystem.learnRecipe(recipe.id, recipe.rewardCoins);
    this.showCoinPopup(recipe.rewardCoins);

    this.resultDialog.show(
      `Great! You learned ${recipe.name} and earned ${recipe.rewardCoins} coins.`
    );
  }

  private showCoinPopup(coins: number): void {
    const popup = this.add.text(480, 484, `+${coins} coins`, {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '26px',
      color: '#ffd36b',
      stroke: '#1f2933',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.tweens.add({
      targets: popup,
      y: 448,
      alpha: 0,
      duration: 900,
      ease: 'Quad.easeOut',
      onComplete: () => popup.destroy()
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(x, y, label, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: '#1f2933',
        backgroundColor: '#f6c85f',
        padding: { x: 18, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerdown', onClick);
    button.on('pointerover', () => this.tweens.add({ targets: button, scaleX: 1.05, scaleY: 1.05, duration: 90 }));
    button.on('pointerout', () => this.tweens.add({ targets: button, scaleX: 1, scaleY: 1, duration: 90 }));
  }
}
