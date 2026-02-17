# Notas para el ejecutor (implementación por fases)

## Reglas generales

1. **Archivo correspondiente**: Cada prompt debe aplicarse en el archivo indicado. Si un archivo no existe (ej. `CartDrawer.tsx`), se omite ese punto.
2. **Pruebas tras cada fase**: Después de cada fase, probar en navegador (móvil y escritorio) para comprobar que los estilos se aplican bien y que la funcionalidad no se ha roto.
3. **Consultar código existente**: Si hay dudas sobre la estructura exacta del código, consultar el archivo original y adaptar los cambios **sin eliminar lógica**.

## Iconos

- Los nombres **FiShoppingCart, FiWhatsApp** etc. corresponden a **react-icons/fi**.
- **Estado actual del proyecto**: no está instalado `react-icons`. Se usa **lucide-react**.
- Opciones:
  - **Instalar react-icons**: `npm install react-icons`
  - **O** usar equivalentes de **lucide-react** (ya en el proyecto), p. ej. `ShoppingCart`, `MessageCircle` (WhatsApp), etc.

## Estado de archivos relevantes (referencia)

| Archivo            | Existe |
|--------------------|--------|
| `src/components/CartDrawer.tsx` | Sí |

---

*Documento de apoyo para quien ejecute las fases de implementación. Actualizar si cambian dependencias o estructura.*
