export type AssetKind = 'image' | 'audio';

export interface GameAsset {
  key: string;
  path: string;
  kind: AssetKind;
}

export const CHARACTER_ASSETS = {
  male: 'character_male',
  female: 'character_female'
} as const;

export const SHOP_ASSETS = {
  burger_house: 'shop_burger_house',
  sushi_house: 'shop_sushi_house',
  noodle_shop: 'shop_noodle_shop',
  malatang_shop: 'shop_malatang_shop',
  tea_shop: 'shop_tea_shop',
  baozi_shop: 'shop_baozi_shop',
  bbq_shop: 'shop_bbq_shop',
  my_shop: 'shop_my_shop'
} as const;

export const FOOD_ASSETS = {
  cheese_burger: 'food_cheese_burger',
  salmon_sushi: 'food_salmon_sushi',
  xiangyang_beef_noodles: 'food_xiangyang_beef_noodles',
  malatang: 'food_malatang',
  bubble_tea: 'food_bubble_tea',
  pork_baozi: 'food_pork_baozi',
  lamb_skewer: 'food_lamb_skewer'
} as const;

export const UI_ASSETS = {
  coin: 'ui_coin',
  dialog_panel: 'ui_dialog_panel',
  button: 'ui_button'
} as const;

export const AUDIO_ASSETS = {
  success: 'audio_success',
  failure: 'audio_failure'
} as const;

// Place future pixel-art files under public/assets/ using these exact filenames.
// Missing files are skipped at runtime, so the rectangle/text MVP remains playable.
export const OPTIONAL_ASSETS: GameAsset[] = [
  { key: CHARACTER_ASSETS.male, path: 'assets/characters/male.png', kind: 'image' },
  { key: CHARACTER_ASSETS.female, path: 'assets/characters/female.png', kind: 'image' },
  { key: SHOP_ASSETS.burger_house, path: 'assets/shops/burger_house.png', kind: 'image' },
  { key: SHOP_ASSETS.sushi_house, path: 'assets/shops/sushi_house.png', kind: 'image' },
  { key: SHOP_ASSETS.noodle_shop, path: 'assets/shops/noodle_shop.png', kind: 'image' },
  { key: SHOP_ASSETS.malatang_shop, path: 'assets/shops/malatang_shop.png', kind: 'image' },
  { key: SHOP_ASSETS.tea_shop, path: 'assets/shops/tea_shop.png', kind: 'image' },
  { key: SHOP_ASSETS.baozi_shop, path: 'assets/shops/baozi_shop.png', kind: 'image' },
  { key: SHOP_ASSETS.bbq_shop, path: 'assets/shops/bbq_shop.png', kind: 'image' },
  { key: SHOP_ASSETS.my_shop, path: 'assets/shops/my_shop.png', kind: 'image' },
  { key: FOOD_ASSETS.cheese_burger, path: 'assets/food/cheese_burger.png', kind: 'image' },
  { key: FOOD_ASSETS.salmon_sushi, path: 'assets/food/salmon_sushi.png', kind: 'image' },
  { key: FOOD_ASSETS.xiangyang_beef_noodles, path: 'assets/food/xiangyang_beef_noodles.png', kind: 'image' },
  { key: FOOD_ASSETS.malatang, path: 'assets/food/malatang.png', kind: 'image' },
  { key: FOOD_ASSETS.bubble_tea, path: 'assets/food/bubble_tea.png', kind: 'image' },
  { key: FOOD_ASSETS.pork_baozi, path: 'assets/food/pork_baozi.png', kind: 'image' },
  { key: FOOD_ASSETS.lamb_skewer, path: 'assets/food/lamb_skewer.png', kind: 'image' },
  { key: UI_ASSETS.coin, path: 'assets/ui/coin.png', kind: 'image' },
  { key: UI_ASSETS.dialog_panel, path: 'assets/ui/dialog_panel.png', kind: 'image' },
  { key: UI_ASSETS.button, path: 'assets/ui/button.png', kind: 'image' },
  { key: AUDIO_ASSETS.success, path: 'assets/audio/success.mp3', kind: 'audio' },
  { key: AUDIO_ASSETS.failure, path: 'assets/audio/failure.mp3', kind: 'audio' }
];

export function getShopAssetKey(shopId: string): string {
  return `shop_${shopId}`;
}

export function getFoodAssetKey(recipeId: string): string {
  return `food_${recipeId}`;
}
