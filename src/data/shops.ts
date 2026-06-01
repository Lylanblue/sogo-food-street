import { getRecipeById, type Recipe } from './recipes';

export interface Shop {
  id: string;
  name: string;
  recipeId: string;
  color: number;
  x: number;
  y: number;
  side: 'left' | 'right';
}

export interface ShopWithRecipe extends Shop {
  recipe: Recipe;
}

export const shops: Shop[] = [
  {
    id: 'burger_house',
    name: '滋滋汉堡屋',
    recipeId: 'cheese_burger',
    color: 0xd75a4a,
    x: 190,
    y: 150,
    side: 'left'
  },
  {
    id: 'sushi_house',
    name: '海风寿司屋',
    recipeId: 'salmon_sushi',
    color: 0x4aa3df,
    x: 770,
    y: 150,
    side: 'right'
  },
  {
    id: 'noodle_shop',
    name: '老襄阳面馆',
    recipeId: 'xiangyang_beef_noodles',
    color: 0xe09132,
    x: 190,
    y: 280,
    side: 'left'
  },
  {
    id: 'malatang_shop',
    name: '红汤麻辣烫',
    recipeId: 'malatang',
    color: 0xbf3b55,
    x: 770,
    y: 280,
    side: 'right'
  },
  {
    id: 'tea_shop',
    name: '甜蜜茶铺',
    recipeId: 'bubble_tea',
    color: 0xd98ecf,
    x: 190,
    y: 410,
    side: 'left'
  },
  {
    id: 'baozi_shop',
    name: '清晨包子铺',
    recipeId: 'pork_baozi',
    color: 0xd8c27a,
    x: 770,
    y: 410,
    side: 'right'
  },
  {
    id: 'bbq_shop',
    name: '夜火烧烤',
    recipeId: 'lamb_skewer',
    color: 0x7c4a33,
    x: 190,
    y: 540,
    side: 'left'
  }
];

export function getShopById(shopId: string): ShopWithRecipe {
  const shop = shops.find((item) => item.id === shopId);

  if (!shop) {
    throw new Error(`Unknown shop id: ${shopId}`);
  }

  return {
    ...shop,
    recipe: getRecipeById(shop.recipeId)
  };
}

export function getShopsWithRecipes(): ShopWithRecipe[] {
  return shops.map((shop) => ({
    ...shop,
    recipe: getRecipeById(shop.recipeId)
  }));
}
