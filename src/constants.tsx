import React from 'react';
import { 
  Utensils, ShoppingBag, Car, Gamepad2, MoreHorizontal,
  Coffee, Milk, Wheat, PackageOpen, Cookie, Droplets, CupSoda, Candy, Zap, 
  CircleDot, Soup, TrainFront, Fuel, Flame, Tv, Search, Baby,
  Bean, Cylinder, Cigarette, Home, HeartPulse, Heart, Bath, Lightbulb, Users
} from 'lucide-react';
import { PredefinedItem } from './types';

export const ICON_MAP: Record<string, React.ElementType> = {
  Utensils, ShoppingBag, Car, Gamepad2, MoreHorizontal,
  Coffee, Milk, Wheat, Box: PackageOpen, Cookie, Droplets, CupSoda, Candy, Zap, 
  CircleDot, Soup, TrainFront, Fuel, Flame, Tv, Search, Baby, Bean,
  Cylinder, Cigarette, Home, HeartPulse, Heart, Bath, Lightbulb, Users
};

export const INITIAL_PREDEFINED_ITEMS: PredefinedItem[] = [
  { id: '1', name: 'Cafe', price: 10, category: 'Nourriture', iconName: 'Coffee', frequent: true },
  { id: '2', name: 'Taxi', price: 5, category: 'Transport', iconName: 'Car', frequent: true },
  { id: '3', name: 'Danone', price: 5, category: 'Nourriture', iconName: 'Milk', frequent: true },
  { id: '4', name: 'Bampers', price: 4.5, category: 'Santé', iconName: 'Baby', frequent: true },
  { id: '5', name: 'Farine', price: 4, category: 'Nourriture', iconName: 'Wheat', frequent: true },
  { id: '6', name: 'Sucette', price: 0.5, category: 'Nourriture', iconName: 'Candy', frequent: true },
  { id: '7', name: 'Pisquet', price: 2, category: 'Nourriture', iconName: 'Cookie', frequent: true },
  { id: 'gaz', name: 'Gaz', price: 15, category: 'Logement', iconName: 'Cylinder', frequent: true },
  { id: 'loc', name: 'Location', price: 1500, category: 'Logement', iconName: 'Home', frequent: false },
  { id: 'elec', name: 'Électricité', price: 150, category: 'Logement', iconName: 'Lightbulb', frequent: true },
  { id: 'san', name: 'Produits Sanitaires', price: 50, category: 'Santé', iconName: 'Bath', frequent: false },
  { id: 'fam', name: 'Aide Famille', price: 500, category: 'Famille', iconName: 'Heart', frequent: false },
  
  { id: '8', name: 'Huile', price: 18, category: 'Nourriture', iconName: 'Droplets', frequent: false },
  { id: '9', name: 'Thé 1', price: 12.5, category: 'Nourriture', iconName: 'CupSoda', frequent: false },
  { id: '10', name: 'Thé 2', price: 6, category: 'Nourriture', iconName: 'CupSoda', frequent: false },
  { id: '11', name: 'Blé', price: 12, category: 'Nourriture', iconName: 'Wheat', frequent: false },
  { id: '12', name: 'Sucre', price: 11, category: 'Nourriture', iconName: 'Candy', frequent: false },
  { id: '13', name: 'Épices', price: 5, category: 'Nourriture', iconName: 'Zap', frequent: false },
  { id: '14', name: 'Sel', price: 1, category: 'Nourriture', iconName: 'CircleDot', frequent: false },
  { id: '15', name: 'Endomi', price: 10, category: 'Nourriture', iconName: 'Soup', frequent: false },
  { id: '16', name: 'Cafe grain', price: 20, category: 'Nourriture', iconName: 'Bean', frequent: false },
  
  { id: '17', name: 'Tram', price: 60, category: 'Transport', iconName: 'TrainFront', frequent: false },
  { id: '18', name: 'Essence', price: 20, category: 'Transport', iconName: 'Fuel', frequent: false },
  
  { id: '19', name: 'Cigarette', price: 30, category: 'Loisirs', iconName: 'Cigarette', frequent: true },
  { id: '20', name: 'Abonnement', price: 49, category: 'Loisirs', iconName: 'Tv', frequent: false },
  { id: '21', name: 'Recherche', price: 10, category: 'Loisirs', iconName: 'Search', frequent: false },
];
