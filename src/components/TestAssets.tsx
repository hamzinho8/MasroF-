import React from 'react';

export default function TestAssets() {
  const imageUrl = "https://i.postimg.cc/8k2Y4Hfr/icon.png";

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <h2 className="text-2xl font-bold text-slate-800">Page de Test des Images</h2>
      <p className="text-center text-slate-500 mb-4">
        Cette page sert à vérifier que l'image source est correcte avant la génération des icônes pour Android.
      </p>

      <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
        <h3 className="font-semibold text-lg mb-4 text-slate-700">Logo HD</h3>
        <img src={imageUrl} alt="Logo" className="w-40 h-40 object-contain drop-shadow-md" />
      </div>

      <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
        <h3 className="font-semibold text-lg mb-4 text-slate-700">Prévisualisation d'Icône (Arrondie)</h3>
        <div className="bg-slate-100 p-8 rounded-[40px]">
             <img src={imageUrl} alt="Icon" className="w-24 h-24 object-contain shadow-lg rounded-2xl" />
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
        <h3 className="font-semibold text-lg mb-4 text-slate-700">Prévisualisation Splash Screen</h3>
        <div className="w-full h-80 relative bg-[#2D8B96] rounded-2xl overflow-hidden flex items-center justify-center">
             <img src={imageUrl} alt="Splash Screen" className="w-32 h-32 object-contain drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
