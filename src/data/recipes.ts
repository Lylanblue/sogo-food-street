export interface Recipe {
  id: string;
  name: string;
  correctIngredients: string[];
  ingredientOptions: string[];
  rewardCoins: number;
}

export const recipes: Recipe[] = [
  {
    id: 'cheese_burger',
    name: '芝士汉堡',
    correctIngredients: ['面包', '牛肉饼', '芝士'],
    ingredientOptions: ['面包', '牛肉饼', '芝士', '生鱼片', '珍珠', '辣汤'],
    rewardCoins: 50
  },
  {
    id: 'salmon_sushi',
    name: '三文鱼寿司',
    correctIngredients: ['米饭', '海苔', '三文鱼'],
    ingredientOptions: ['米饭', '海苔', '三文鱼', '芝士', '面条', '孜然'],
    rewardCoins: 60
  },
  {
    id: 'xiangyang_beef_noodles',
    name: '襄阳牛肉面',
    correctIngredients: ['面条', '牛肉', '红油汤'],
    ingredientOptions: ['面条', '牛肉', '红油汤', '冰块', '猪肉馅', '海苔'],
    rewardCoins: 80
  },
  {
    id: 'malatang',
    name: '招牌麻辣烫',
    correctIngredients: ['丸子', '青菜', '辣汤'],
    ingredientOptions: ['丸子', '青菜', '辣汤', '面包', '奶茶', '羊肉'],
    rewardCoins: 70
  },
  {
    id: 'bubble_tea',
    name: '珍珠奶茶',
    correctIngredients: ['奶茶', '珍珠', '冰块'],
    ingredientOptions: ['奶茶', '珍珠', '冰块', '红油汤', '葱花', '牛肉饼'],
    rewardCoins: 40
  },
  {
    id: 'pork_baozi',
    name: '鲜肉包',
    correctIngredients: ['面皮', '猪肉馅', '葱花'],
    ingredientOptions: ['面皮', '猪肉馅', '葱花', '三文鱼', '辣椒粉', '青菜'],
    rewardCoins: 45
  },
  {
    id: 'lamb_skewer',
    name: '羊肉串',
    correctIngredients: ['羊肉', '孜然', '辣椒粉'],
    ingredientOptions: ['羊肉', '孜然', '辣椒粉', '米饭', '面皮', '芝士'],
    rewardCoins: 90
  }
];

export function getRecipeById(recipeId: string): Recipe {
  const recipe = recipes.find((item) => item.id === recipeId);

  if (!recipe) {
    throw new Error(`Unknown recipe id: ${recipeId}`);
  }

  return recipe;
}
