import Phaser from 'phaser';
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
    this.resultDialog = new DialogBox(this, 480, 555, 820, 90);

    const recipe = this.shop.recipe;
    const save = SaveSystem.load();
    const alreadyLearned = save.learnedRecipes.includes(recipe.id);

    this.add
      .text(480, 62, this.shop.name, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '40px',
        color: '#f8e7a2'
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

  private createIngredientOption(x: number, y: number, ingredient: string): void {
    const option = this.add
      .text(x, y, `[ ] ${ingredient}`, {
        fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
        fontSize: '21px',
        color: '#ffffff',
        backgroundColor: '#1f2933',
        padding: { x: 14, y: 10 }
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

    this.optionTexts.push(option);
  }

  private refreshIngredientOptions(): void {
    this.optionTexts.forEach((option) => {
      const ingredient = option.text.replace('[ ] ', '').replace('[x] ', '');
      const selected = this.selectedIngredients.has(ingredient);
      option.setText(`${selected ? '[x]' : '[ ]'} ${ingredient}`);
      option.setStyle({
        color: selected ? '#1f2933' : '#ffffff',
        backgroundColor: selected ? '#f6c85f' : '#1f2933'
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
      return;
    }

    SaveSystem.learnRecipe(recipe.id, recipe.rewardCoins);

    this.resultDialog.show(
      `Great! You learned ${recipe.name} and earned ${recipe.rewardCoins} coins.`
    );
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
  }
}
