export type CharacterType = 'male' | 'female';

export interface SaveData {
  coins: number;
  selectedCharacter: CharacterType | null;
  learnedRecipes: string[];
  myShopUnlocked: boolean;
}

const SAVE_KEY = 'sogo-food-street-save';

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  selectedCharacter: null,
  learnedRecipes: [],
  myShopUnlocked: false
};

export class SaveSystem {
  static load(): SaveData {
    const rawSave = window.localStorage.getItem(SAVE_KEY);

    if (!rawSave) {
      return { ...DEFAULT_SAVE };
    }

    try {
      const parsedSave = JSON.parse(rawSave) as Partial<SaveData>;

      return {
        coins: typeof parsedSave.coins === 'number' ? parsedSave.coins : 0,
        selectedCharacter:
          parsedSave.selectedCharacter === 'male' || parsedSave.selectedCharacter === 'female'
            ? parsedSave.selectedCharacter
            : null,
        learnedRecipes: Array.isArray(parsedSave.learnedRecipes)
          ? parsedSave.learnedRecipes.filter((item): item is string => typeof item === 'string')
          : [],
        myShopUnlocked: Boolean(parsedSave.myShopUnlocked)
      };
    } catch {
      return { ...DEFAULT_SAVE };
    }
  }

  static save(data: SaveData): void {
    const nextData = SaveSystem.withUnlockStatus(data);
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(nextData));
  }

  static reset(): void {
    window.localStorage.removeItem(SAVE_KEY);
  }

  static setCharacter(selectedCharacter: CharacterType): SaveData {
    const data = SaveSystem.load();
    const nextData = { ...data, selectedCharacter };
    SaveSystem.save(nextData);
    return SaveSystem.load();
  }

  static learnRecipe(recipeId: string, rewardCoins: number): SaveData {
    const data = SaveSystem.load();
    const hasLearnedRecipe = data.learnedRecipes.includes(recipeId);

    const nextData: SaveData = {
      ...data,
      coins: data.coins + rewardCoins,
      learnedRecipes: hasLearnedRecipe ? data.learnedRecipes : [...data.learnedRecipes, recipeId]
    };

    SaveSystem.save(nextData);
    return SaveSystem.load();
  }

  static withUnlockStatus(data: SaveData): SaveData {
    return {
      ...data,
      myShopUnlocked: data.myShopUnlocked || (data.coins >= 500 && data.learnedRecipes.length >= 5)
    };
  }
}
