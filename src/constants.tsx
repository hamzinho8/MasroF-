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
  Paperclip, Camera, MapPin, Ticket, Plane, Ship, Bus,
  Droplet, HandMetal, Smile, Wifi, ShoppingCart, Cuboid, Pill, UtensilsCrossed,
  CarTaxiFront, Footprints, GraduationCap, Cake, Scroll, SprayCan, Trash2,
  Stethoscope, Cross, Dumbbell,
  Store, Wallet, CreditCard, Banknote, Coins, Receipt, Tag, Gift, Armchair, Bed, Monitor, Printer, Headphones, Radio, Watch, Mic, Music, Thermometer, Syringe, TreePine, Leaf, Cloud, Sun, Moon, Snowflake, Tent, Compass, Map, Navigation, Truck, Bike, BaggageClaim, Sticker, Puzzle, Building, Briefcase, Key, Lock, Unlock, Shield, ShieldCheck, Globe, Mountain, Palmtree, Clipboard, Archive, Inbox, Mail, Send, PhoneCall, Phone, Video, Image, Speaker, Bell, Calendar, Clock, AlarmClock, Timer, Hourglass, Filter, Settings, Sliders, Hammer, Axe, Paintbrush, Palette, Pipette, ThermometerSun, ThermometerSnowflake, Flashlight, Megaphone, Microwave, Refrigerator, ChefHat, Luggage, Sofa, Lamp, ShowerHead, Trees, Clover, Sprout, Citrus, CloudRain, Bone, PartyPopper, Film, Clapperboard, Gamepad, Activity, PiggyBank, BadgePercent, Castle, Church, Rocket, Container, ArrowRightLeft
} from 'lucide-react';
import { PredefinedItem } from './types';
import * as MoroccanIcons from './components/icons/MoroccanIcons';


export const ICON_MAP: Record<string, React.ElementType> = {
  ...MoroccanIcons,

  Utensils, ShoppingBag, Car, Gamepad2, MoreHorizontal, ArrowRightLeft,
  Coffee, Milk, Wheat, PackageOpen, Box: PackageOpen, Cookie, Droplets, CupSoda, Candy, Zap, 
  CircleDot, Soup, TrainFront, Fuel, Flame, Tv, Search, Baby, Bean,
  Cylinder, Cigarette, Home, HeartPulse, Heart, Bath, Lightbulb, Users,
  Sparkles, Shirt, Wind, HelpCircle, User, WashingMachine,
  Beef, Drumstick, Fish, Carrot, Apple, Nut, IceCream,
  GlassWater, Wine, Beer, Grape, Croissant, Pizza, Sandwich, Salad, 
  Cherry, Banana, Egg, 
  PaintRoller, Wrench, Scissors, Smartphone, Laptop, Plug, Battery, 
  Umbrella, Glasses, Book, FilePlus, Brush, Pen, PenTool,
  Paperclip, Camera, MapPin, Ticket, Plane, Ship, Bus,
  Droplet, HandMetal, Smile, Wifi, ShoppingCart, Cuboid, Cheese: Pizza, Pill, UtensilsCrossed,
  CarTaxiFront, Footprints, GraduationCap, Cake, Scroll, SprayCan, Trash2,
  Stethoscope, Cross, Dumbbell,
  Store, Wallet, CreditCard, Banknote, Coins, Receipt, Tag, Gift, Armchair, Bed, Monitor, Printer, Headphones, Radio, Watch, Mic, Music, Thermometer, Syringe, TreePine, Leaf, Cloud, Sun, Moon, Snowflake, Tent, Compass, Map, Navigation, Truck, Bike, BaggageClaim, Sticker, Puzzle, Building, Briefcase, Key, Lock, Unlock, Shield, ShieldCheck, Globe, Mountain, Palmtree, Clipboard, Archive, Inbox, Mail, Send, PhoneCall, Phone, Video, Image, Speaker, Bell, Calendar, Clock, AlarmClock, Timer, Hourglass, Filter, Settings, Sliders, Hammer, Axe, Paintbrush, Palette, Pipette, ThermometerSun, ThermometerSnowflake, Flashlight, Megaphone, Microwave, Refrigerator, ChefHat, Luggage, Sofa, Lamp, ShowerHead, Trees, Clover, Sprout, Citrus, CloudRain, Bone, PartyPopper, Film, Clapperboard, Gamepad, Activity, PiggyBank, BadgePercent, Castle, Church, Rocket, Container
};

export const CATEGORIES = [
  { id: 'Gourmandises', label: 'Gourmandises', iconName: 'Cookie', color: 'text-purple-700', bgColor: 'bg-purple-100', lightBg: 'bg-purple-50/60', borderColor: 'border-purple-200', colorString: 'purple', colorHex: '#8E44AD' },
  { id: 'Protéines', label: 'Protéines', iconName: 'Beef', color: 'text-red-700', bgColor: 'bg-red-100', lightBg: 'bg-red-50/60', borderColor: 'border-red-200', colorString: 'red', colorHex: '#E53935' },
  { id: 'Essentiel', label: 'Essentiel', iconName: 'Wheat', color: 'text-amber-700', bgColor: 'bg-amber-100', lightBg: 'bg-amber-50/60', borderColor: 'border-amber-200', colorString: 'amber', colorHex: '#F4B400' },
  { id: 'Plantes', label: 'Plantes', iconName: 'Carrot', color: 'text-green-700', bgColor: 'bg-green-100', lightBg: 'bg-green-50/60', borderColor: 'border-green-200', colorString: 'green', colorHex: '#22C55E' },
  { id: 'Logement', label: 'Logement', iconName: 'Home', color: 'text-slate-700', bgColor: 'bg-slate-100', lightBg: 'bg-slate-50/60', borderColor: 'border-slate-200', colorString: 'slate', colorHex: '#B0B7C3' },
  { id: 'Transport', label: 'Transport', iconName: 'Car', color: 'text-blue-700', bgColor: 'bg-blue-100', lightBg: 'bg-blue-50/60', borderColor: 'border-blue-200', colorString: 'blue', colorHex: '#1E90FF' },
  { id: 'Sanitaire', label: 'Sanitaire', iconName: 'WashingMachine', color: 'text-indigo-700', bgColor: 'bg-indigo-100', lightBg: 'bg-indigo-50/60', borderColor: 'border-indigo-200', colorString: 'indigo', colorHex: '#3D5AFE' },
  { id: 'Shopping', label: 'Shopping', iconName: 'ShoppingBag', color: 'text-rose-700', bgColor: 'bg-rose-100', lightBg: 'bg-rose-50/60', borderColor: 'border-rose-200', colorString: 'rose', colorHex: '#D81B60' },
  { id: 'Loisirs', label: 'Loisirs', iconName: 'Gamepad2', color: 'text-orange-700', bgColor: 'bg-orange-100', lightBg: 'bg-orange-50/60', borderColor: 'border-orange-200', colorString: 'orange', colorHex: '#FB8C00' },
  { id: 'Devoir', label: 'Devoir', iconName: 'Heart', color: 'text-stone-700', bgColor: 'bg-stone-100', lightBg: 'bg-stone-50/60', borderColor: 'border-stone-200', colorString: 'stone', colorHex: '#8B5E3C' },
  { id: 'Autres', label: 'Autres', iconName: 'MoreHorizontal', color: 'text-gray-700', bgColor: 'bg-gray-100', lightBg: 'bg-gray-50/60', borderColor: 'border-gray-200', colorString: 'gray', colorHex: '#E5E7EB' },
];

const RAW_PREDEFINED_ITEMS: Omit<PredefinedItem, 'colorHex' | 'categoryColorHex'>[] = [
  // Gourmandises
  { id: '1', name: 'Cafe', price: 10, category: 'Gourmandises', iconName: 'Coffee', frequent: true, dailyLimit: 2 },
  { id: '16', name: 'Cafe grain', price: 20, category: 'Gourmandises', iconName: 'Bean', frequent: false },
  { id: '7', name: 'Bisquet', price: 2, category: 'Gourmandises', iconName: 'Cookie', frequent: true },
  { id: '3', name: 'Danone', price: 5, category: 'Gourmandises', iconName: 'Milk', frequent: true, iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'><path d='M30 35l5 50a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4l5-50z' fill='currentColor' fill-opacity='0.1'/><path d='M30 35l5 50a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4l5-50z'/><rect x='24' y='30' width='52' height='5' rx='2' fill='currentColor' fill-opacity='0.25'/><rect x='24' y='30' width='52' height='5' rx='2'/><path d='M50 30L60 12'/><ellipse cx='63' cy='9' rx='4' ry='6' transform='rotate(30 63 9)' fill='currentColor' fill-opacity='0.3'/><ellipse cx='63' cy='9' rx='4' ry='6' transform='rotate(30 63 9)'/><path d='M35 55c5-4 10-4 15 0s10 4 15 0' stroke-width='3'/><path d='M38 72c5-3 10-3 15 0s10 3 13-1' stroke-width='3'/></svg>" },
  { id: '15', name: 'Indomie', price: 10, category: 'Gourmandises', iconName: 'Soup', frequent: false },
  { id: '6', name: 'Sucette', price: 0.5, category: 'Gourmandises', iconName: 'Candy', frequent: true },
  { id: 'glace', name: 'Glaces', price: 5, category: 'Gourmandises', iconName: 'IceCream', frequent: true },
  { id: 'eau', name: 'Bouteille d\'eau', price: 2.5, category: 'Gourmandises', iconName: 'GlassWater', frequent: false },

  // Essentiel
  { id: '12', name: 'Sucre', price: 11, category: 'Essentiel', iconName: 'Cuboid', frequent: false },
  { id: 'the', name: 'Thé', price: 12.5, category: 'Essentiel', iconName: 'CupSoda', frequent: false },
  { id: '8', name: 'Huile', price: 18, category: 'Essentiel', iconName: 'Droplets', frequent: false },
  { id: '5', name: 'Farine', price: 4, category: 'Essentiel', iconName: 'Wheat', frequent: true },
  { id: '11', name: 'Blé', price: 12, category: 'Essentiel', iconName: 'Wheat', frequent: false },
  { id: '22', name: 'Khmira', price: 8, category: 'Essentiel', iconName: 'Package', frequent: false, iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M7 6h10v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6z'/><path d='M7 6L9 2h6l2 4'/><path d='M5 6h14'/><circle cx='12' cy='14' r='3'/><path d='M12 12v.01'/></svg>" },
  { id: '13', name: 'Épices', price: 5, category: 'Essentiel', iconName: 'Zap', frequent: false },
  { id: '14', name: 'Sel', price: 1, category: 'Essentiel', iconName: 'CircleDot', frequent: false },

  // Protéines
  { id: 'viande', name: 'Viande', price: 0, category: 'Protéines', iconName: 'Beef', frequent: false },
  { id: 'poulet', name: 'Poulet', price: 0, category: 'Protéines', iconName: 'Drumstick', frequent: false },
  { id: 'poissons', name: 'Poissons', price: 0, category: 'Protéines', iconName: 'Fish', frequent: false },
  { id: 'oeufs', name: 'Oeufs', price: 0, category: 'Protéines', iconName: 'Egg', frequent: false },

  // Plantes
  { id: 'legumes', name: 'Légumes', price: 0, category: 'Plantes', iconName: 'Carrot', frequent: false },
  { id: 'fruits', name: 'Fruits', price: 0, category: 'Plantes', iconName: 'Apple', frequent: false },
  { id: 'fruits_seches', name: 'Fruits Séchés', price: 0, category: 'Plantes', iconName: 'Nut', frequent: false },

  // Transport
  { id: '2', name: 'Taxi', price: 5, category: 'Transport', iconName: 'CarTaxiFront', frequent: true, dailyLimit: 2 },
  { id: '17', name: 'Tram', price: 60, category: 'Transport', iconName: 'TrainFront', frequent: true },
  { id: '18', name: 'Essence', price: 20, category: 'Transport', iconName: 'Fuel', frequent: false },
  
  // Sanitaire
  { id: '4', name: 'Bampers', price: 4.5, category: 'Sanitaire', iconName: 'Baby', frequent: true, iconSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 6h16v4c0 6-4 10-8 10S4 16 4 10V6z'/><path d='M4 11c2 0 4 2 4 5'/><path d='M20 11c-2 0-4 2-4 5'/><path d='M4 9h16'/><path d='M8 6v3'/><path d='M16 6v3'/><path d='M12 15.5l-2-2a1.5 1.5 0 0 1 2-2 1.5 1.5 0 0 1 2 2L12 15.5z'/></svg>" },
  { id: 'savon', name: 'Savon', price: 5, category: 'Sanitaire', iconName: 'Droplets', frequent: false },
  { id: 'fairy', name: 'Fairy', price: 10, category: 'Sanitaire', iconName: 'Sparkles', frequent: false },
  { id: 'tide', name: 'Tide', price: 10, category: 'Sanitaire', iconName: 'Shirt', frequent: false },
  { id: 'champo', name: 'Champoo', price: 10, category: 'Sanitaire', iconName: 'Wind', frequent: false },

  // Logement
  { id: 'gaz', name: 'Gaz', price: 15, category: 'Logement', iconName: 'Cylinder', frequent: false },
  { id: 'loc', name: 'Location', price: 1500, category: 'Logement', iconName: 'Home', frequent: false },
  { id: 'logement', name: 'Logement', price: 0, category: 'Logement', iconName: 'Home', frequent: false },
  { id: 'elec', name: 'Électricité', price: 150, category: 'Logement', iconName: 'Lightbulb', frequent: false },

  // Devoir
  { id: 'parents', name: 'Parents', price: 0, category: 'Devoir', iconName: 'Users', frequent: false },
  { id: 'enfants', name: 'Enfants', price: 0, category: 'Devoir', iconName: 'Baby', frequent: false },
  { id: 'femme', name: 'Femme', price: 0, category: 'Devoir', iconName: 'User', frequent: false },
  { id: 'inconnu', name: 'Inconnu', price: 0, category: 'Devoir', iconName: 'HelpCircle', frequent: false },
  
  // Loisirs
  { id: '19', name: 'Cigarette', price: 30, category: 'Loisirs', iconName: 'Cigarette', frequent: true },
  { id: '20', name: 'Abonnement', price: 49, category: 'Loisirs', iconName: 'Tv', frequent: false },
  { id: '21', name: 'Recherche', price: 10, category: 'Loisirs', iconName: 'Search', frequent: false },
];

export const SUBCATEGORY_COLORS: Record<string, { colorHex: string; }> = {
  'Essentiel': { colorHex: '#F4B400' },
  'Protéines': { colorHex: '#E53935' },
  'Plantes': { colorHex: '#22C55E' },
  'Gourmandises': { colorHex: '#8E44AD' },
};

import { IconMatcher } from './iconmatcher/IconMatcher';

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
      colorHex: predefined.colorHex || category.colorHex,
      categoryColorHex: category.colorHex,
      color: category.color,
      bgColor: category.bgColor,
      lightBg: category.lightBg,
      borderColor: category.borderColor
    };
  }

  const match = IconMatcher.findMatches(name)[0];
  const matchedCategoryId = match?.score >= 60 ? match.category : categoryId;
  const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === matchedCategoryId) || CATEGORIES.find(c => c.id === 'Autres')!;
  
  return {
    name,
    iconName: match?.score >= 60 ? match.icon : category.iconName,
    iconSvg: undefined,
    colorHex: category.colorHex,
    categoryColorHex: category.colorHex,
    color: category.color,
    bgColor: category.bgColor,
    lightBg: category.lightBg,
    borderColor: category.borderColor
  };
};
