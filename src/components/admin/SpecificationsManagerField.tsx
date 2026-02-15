'use client';

import { useState } from 'react';
import SpecificationsManager, { type Specification } from './SpecificationsManager';

interface Props {
  name: string;
  initialSpecifications: Specification[];
}

/** Para formularios server action: mantiene estado y escribe en un input hidden para enviar specs en FormData. */
export default function SpecificationsManagerField({
  name,
  initialSpecifications,
}: Props) {
  const [specs, setSpecs] = useState<Specification[]>(initialSpecifications);

  return (
    <>
      <input type="hidden" name={name} value={JSON.stringify(specs)} readOnly />
      <SpecificationsManager
        specifications={specs}
        onChange={(newSpecs) => setSpecs(newSpecs)}
      />
    </>
  );
}
