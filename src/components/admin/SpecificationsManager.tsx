'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export interface Specification {
  key: string;
  value: string;
  order: number;
}

interface Props {
  specifications: Specification[];
  onChange: (specs: Specification[]) => void;
}

export default function SpecificationsManager({ specifications, onChange }: Props) {
  const [specs, setSpecs] = useState<Specification[]>(specifications);

  useEffect(() => {
    setSpecs(specifications);
  }, [specifications]);

  const addSpec = () => {
    const newSpec: Specification = {
      key: '',
      value: '',
      order: specs.length,
    };
    const updated = [...specs, newSpec];
    setSpecs(updated);
    onChange(updated);
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    setSpecs(updated);
    onChange(updated);
  };

  const deleteSpec = (index: number) => {
    const updated = specs.filter((_, i) => i !== index);
    setSpecs(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-sans font-medium text-[#2D2D2D]">
          Especificaciones Técnicas
        </label>
        <button
          type="button"
          onClick={addSpec}
          className="text-sm bg-[#CB997E] hover:bg-[#B8886E] text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {specs.length === 0 ? (
        <p className="font-sans text-sm text-[#6B6B6B] italic">
          Sin especificaciones. Click &quot;Agregar&quot; para crear una.
        </p>
      ) : (
        <div className="space-y-2">
          {specs.map((spec, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-[#6B6B6B] flex-shrink-0" />

              <input
                type="text"
                placeholder="Nombre (ej: Material)"
                value={spec.key}
                onChange={(e) => updateSpec(idx, 'key', e.target.value)}
                className="flex-1 border border-[#EDEDED] rounded-lg px-3 py-2 text-sm font-sans text-[#2D2D2D] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
              />

              <input
                type="text"
                placeholder="Valor (ej: Algodón 100%)"
                value={spec.value}
                onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                className="flex-1 border border-[#EDEDED] rounded-lg px-3 py-2 text-sm font-sans text-[#2D2D2D] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
              />

              <button
                type="button"
                onClick={() => deleteSpec(idx)}
                className="p-2 bg-[#F5E0DC] hover:bg-[#EDD4CF] text-[#9B6B6B] rounded-lg transition flex-shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
