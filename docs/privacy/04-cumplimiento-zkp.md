# 4. Capa 3 — Cumplimiento ZKP (Pruebas de Lote sin Visibilidad Individual)

## El problema del regulador

SUGEF y BCCR necesitan verificar que el ecosistema cumple con las normas de prevención de lavado de activos (AML) y financiamiento del terrorismo (CFT). Pero no necesitan — ni deberían — ver cada transacción individual en tiempo real.

## La solución: pruebas de cumplimiento en lote

```
  Operador del ecosistema genera periódicamente:

  PRUEBA ZKP DE CUMPLIMIENTO (mensual/trimestral)

  Afirma:
  1. "En este período se procesaron N transacciones"
  2. "Todas las transacciones fueron ≤ umbral AML"
  3. "Ninguna dirección excedió el límite acumulado diario"
  4. "Todos los pagadores tienen KYC vigente vinculado"
  5. "No se detectaron patrones de estructuración"

  Revela:
  • La prueba matemática de que todo lo anterior es verdadero

  NO revela:
  • Montos individuales
  • Identidades de los pagadores
  • Direcciones de wallet específicas
  • Detalle de ninguna transacción individual
```

## Escalamiento de acceso regulatorio

El acceso a los datos sigue un modelo de **escalamiento progresivo** — el regulador obtiene más detalle solo cuando lo necesita y lo justifica:

| Nivel | Qué ve el regulador | Cuándo aplica |
|---|---|---|
| **1. Prueba ZKP de lote** | Cumplimiento agregado — sin datos individuales | Supervisión rutinaria |
| **2. Auditor key (Token-2022)** | Montos descifrados de transacciones específicas | Investigación con causa |
| **3. Vinculación DID ↔ wallet** | Identidad real detrás de una dirección | Orden formal SUGEF/BCCR |
| **4. Acceso completo** | Todo lo anterior + historial detallado | Orden judicial |

Este modelo respeta el principio de **minimización de datos** (Ley 8968, Art. 5): el regulador accede solo a lo que necesita, cuando lo necesita, con la justificación adecuada.
