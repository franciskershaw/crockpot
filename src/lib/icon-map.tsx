import {
  Beef,
  Fish,
  Carrot,
  Milk,
  Zap,
  Wine,
  Cookie,
  Package,
  Home,
  Citrus,
} from "lucide-react";

export const getIconComponent = (faIconName: string) => {
  const iconMap: Record<string, typeof Beef> = {
    faDrumstickBite: Beef, // Meat
    faFish: Fish, // Fish
    faCarrot: Carrot, // Veg
    faCheese: Milk, // Dairy
    faPepperHot: Zap, // Herbs and Spices
    faWineGlass: Wine, // Drinks
    faCookieBite: Cookie, // Sweets
    faJar: Package, // Cupboard
    faToiletPaper: Home, // House
    faLemon: Citrus, // Fruit
  };
  return iconMap[faIconName] || Package;
};
