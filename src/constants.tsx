import React from 'react';
import { 
  Utensils, ShoppingBag, Car, Gamepad2, MoreHorizontal,
  Coffee, Milk, Wheat, PackageOpen, Cookie, Droplets, CupSoda, Candy, Zap, 
  CircleDot, Soup, TrainFront, Fuel, Flame, Tv, Search, Baby,
  Bean, Cylinder, Cigarette, Home, HeartPulse, Heart, Bath, Lightbulb, Users,
  Sparkles, Shirt, Wind, HelpCircle, User, WashingMachine,
  Beef, Drumstick, Fish, Carrot, Apple, Nut, IceCream,
  GlassWater, Wine, Beer, Grape, Croissant, Pizza, Sandwich, Salad, 
  Cherry, Banana, Egg, 
  PaintRoller, Wrench, Scissors, Smartphone, Laptop, Plug, Battery, 
  Umbrella, Glasses, Book, FilePlus, Brush, Pen, PenTool,
  Paperclip, Camera, MapPin, Ticket, Plane, Ship, Bus
} from 'lucide-react';
import { PredefinedItem } from './types';

export const ICON_MAP: Record<string, React.ElementType> = {
  Utensils, ShoppingBag, Car, Gamepad2, MoreHorizontal,
  Coffee, Milk, Wheat, PackageOpen, Box: PackageOpen, Cookie, Droplets, CupSoda, Candy, Zap, 
  CircleDot, Soup, TrainFront, Fuel, Flame, Tv, Search, Baby, Bean,
  Cylinder, Cigarette, Home, HeartPulse, Heart, Bath, Lightbulb, Users,
  Sparkles, Shirt, Wind, HelpCircle, User, WashingMachine,
  Beef, Drumstick, Fish, Carrot, Apple, Nut, IceCream,
  GlassWater, Wine, Beer, Grape, Croissant, Pizza, Sandwich, Salad, 
  Cherry, Banana, Egg, 
  PaintRoller, Wrench, Scissors, Smartphone, Laptop, Plug, Battery, 
  Umbrella, Glasses, Book, FilePlus, Brush, Pen, PenTool,
  Paperclip, Camera, MapPin, Ticket, Plane, Ship, Bus
};

export const CATEGORIES = [
  { id: 'Nourriture', label: 'Nourriture', iconName: 'Utensils', color: 'text-teal-700', bgColor: 'bg-teal-100', lightBg: 'bg-teal-50/60', colorString: 'teal', colorHex: '#0f766e' },
  { id: 'Logement', label: 'Logement', iconName: 'Home', color: 'text-indigo-600', bgColor: 'bg-indigo-100', lightBg: 'bg-indigo-50/60', colorString: 'indigo', colorHex: '#4f46e5' },
  { id: 'Transport', label: 'Transport', iconName: 'Car', color: 'text-sky-600', bgColor: 'bg-sky-100', lightBg: 'bg-sky-50/60', colorString: 'sky', colorHex: '#0284c7' },
  { id: 'Sanitaire', label: 'Sanitaire', iconName: 'WashingMachine', color: 'text-rose-600', bgColor: 'bg-rose-100', lightBg: 'bg-rose-50/60', colorString: 'rose', colorHex: '#e11d48' },
  { id: 'Shopping', label: 'Shopping', iconName: 'ShoppingBag', color: 'text-purple-600', bgColor: 'bg-purple-100', lightBg: 'bg-purple-50/60', colorString: 'purple', colorHex: '#9333ea' },
  { id: 'Loisirs', label: 'Loisirs', iconName: 'Gamepad2', color: 'text-amber-600', bgColor: 'bg-amber-100', lightBg: 'bg-amber-50/60', colorString: 'amber', colorHex: '#d97706' },
  { id: 'Devoir', label: 'Devoir', iconName: 'Heart', color: 'text-orange-600', bgColor: 'bg-orange-100', lightBg: 'bg-orange-50/60', colorString: 'orange', colorHex: '#ea580c' },
  { id: 'Autres', label: 'Autres', iconName: 'MoreHorizontal', color: 'text-slate-600', bgColor: 'bg-slate-100', lightBg: 'bg-slate-50/60', colorString: 'slate', colorHex: '#475569' },
];

const RAW_PREDEFINED_ITEMS: Omit<PredefinedItem, 'colorHex' | 'categoryColorHex'>[] = [
  { id: '1', name: 'Cafe', price: 10, category: 'Nourriture', iconName: 'Coffee', frequent: true },
  { id: '2', name: 'Taxi', price: 5, category: 'Transport', iconName: 'Car', frequent: true },
  { id: '3', name: 'Danone', price: 5, category: 'Nourriture', iconName: 'Milk', frequent: true },
  { id: '4', name: 'Bampers', price: 4.5, category: 'Sanitaire', iconName: 'Baby', frequent: true },
  { id: '5', name: 'Farine', price: 4, category: 'Nourriture', iconName: 'Wheat', frequent: true },
  { id: '6', name: 'Sucette', price: 0.5, category: 'Nourriture', iconName: 'Candy', frequent: true },
  { id: '7', name: 'Pisquet', price: 2, category: 'Nourriture', iconName: 'Cookie', frequent: true },
  { id: 'glace', name: 'Glaces', price: 5, category: 'Nourriture', iconName: 'IceCream', frequent: true },
  { id: '19', name: 'Cigarette', price: 30, category: 'Loisirs', iconName: 'Cigarette', frequent: true },
  { id: '17', name: 'Tram', price: 60, category: 'Transport', iconName: 'TrainFront', frequent: true },

  { id: 'gaz', name: 'Gaz', price: 15, category: 'Logement', iconName: 'Cylinder', frequent: false },
  { id: 'loc', name: 'Location', price: 1500, category: 'Logement', iconName: 'Home', frequent: false },
  { id: 'elec', name: 'Électricité', price: 150, category: 'Logement', iconName: 'Lightbulb', frequent: false },
  
  // Nouveaux articles Sanitaire
  { id: 'savon', name: 'Savon', price: 5, category: 'Sanitaire', iconName: 'Droplets', frequent: false },
  { id: 'fairy', name: 'Fairy', price: 10, category: 'Sanitaire', iconName: 'Sparkles', frequent: false },
  { id: 'tide', name: 'Tide', price: 10, category: 'Sanitaire', iconName: 'Shirt', frequent: false },
  { id: 'champo', name: 'Champoo', price: 10, category: 'Sanitaire', iconName: 'Wind', frequent: false },

  // Devoir
  { id: 'parents', name: 'Parents', price: 0, category: 'Devoir', iconName: 'Users', frequent: false },
  { id: 'enfants', name: 'Enfants', price: 0, category: 'Devoir', iconName: 'Baby', frequent: false },
  { id: 'femme', name: 'Femme', price: 0, category: 'Devoir', iconName: 'User', frequent: false },
  { id: 'inconnu', name: 'Inconnu', price: 0, category: 'Devoir', iconName: 'HelpCircle', frequent: false },
  
  { id: '8', name: 'Huile', price: 18, category: 'Nourriture', iconName: 'Droplets', frequent: false },
  { id: '9', name: 'Thé 1', price: 12.5, category: 'Nourriture', iconName: 'CupSoda', frequent: false },
  { id: '10', name: 'Thé 2', price: 6, category: 'Nourriture', iconName: 'CupSoda', frequent: false },
  { id: '11', name: 'Blé', price: 12, category: 'Nourriture', iconName: 'Wheat', frequent: false },
  { id: '12', name: 'Sucre', price: 11, category: 'Nourriture', iconName: 'Candy', frequent: false },
  { id: '13', name: 'Épices', price: 5, category: 'Nourriture', iconName: 'Zap', frequent: false },
  { id: '14', name: 'Sel', price: 1, category: 'Nourriture', iconName: 'CircleDot', frequent: false },
  { id: '15', name: 'Endomi', price: 10, category: 'Nourriture', iconName: 'Soup', frequent: false },
  { id: '16', name: 'Cafe grain', price: 20, category: 'Nourriture', iconName: 'Bean', frequent: false },
  
  { id: 'viande', name: 'Viande', price: 0, category: 'Nourriture', iconName: 'Beef', frequent: false },
  { id: 'poulet', name: 'Poulet', price: 0, category: 'Nourriture', iconName: 'Drumstick', frequent: false },
  { id: 'poissons', name: 'Poissons', price: 0, category: 'Nourriture', iconName: 'Fish', frequent: false },
  { id: 'legumes', name: 'Légumes', price: 0, category: 'Nourriture', iconName: 'Carrot', frequent: false },
  { id: 'fruits', name: 'Fruits', price: 0, category: 'Nourriture', iconName: 'Apple', frequent: false },
  { id: 'fruits_seches', name: 'Fruits Séchés', price: 0, category: 'Nourriture', iconName: 'Nut', frequent: false },

  { id: '18', name: 'Essence', price: 20, category: 'Transport', iconName: 'Fuel', frequent: false },
  
  { id: '20', name: 'Abonnement', price: 49, category: 'Loisirs', iconName: 'Tv', frequent: false },
  { id: '21', name: 'Recherche', price: 10, category: 'Loisirs', iconName: 'Search', frequent: false },
];

export const INITIAL_PREDEFINED_ITEMS: PredefinedItem[] = RAW_PREDEFINED_ITEMS.map(item => {
  const category = CATEGORIES.find(c => c.id === item.category) || CATEGORIES.find(c => c.id === 'Autres')!;
  return {
    ...item,
    colorHex: category.colorHex,
    categoryColorHex: category.colorHex
  };
});

export const getArticleInfo = (name: string, categoryId?: string, predefinedItems: PredefinedItem[] = INITIAL_PREDEFINED_ITEMS) => {
  const predefined = predefinedItems.find(p => p.name.toLowerCase() === name.toLowerCase());
  
  if (predefined) {
    const category = CATEGORIES.find(c => c.id === predefined.category) || CATEGORIES.find(c => c.id === 'Autres')!;
    return {
      name: predefined.name,
      iconName: predefined.iconName,
      iconSvg: predefined.iconSvg,
      colorHex: predefined.colorHex,
      categoryColorHex: predefined.categoryColorHex,
      color: category.color,
      bgColor: category.bgColor,
      lightBg: category.lightBg
    };
  }

  const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === 'Autres')!;
  return {
    name,
    iconName: category.iconName,
    iconSvg: undefined,
    colorHex: category.colorHex,
    categoryColorHex: category.colorHex,
    color: category.color,
    bgColor: category.bgColor,
    lightBg: category.lightBg
  };
};
