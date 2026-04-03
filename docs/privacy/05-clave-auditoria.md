# 5. El Titular de la Clave de Auditoría

## ¿Quién custodia la auditor key?

La clave de auditoría de las transferencias confidenciales — la capacidad de descifrar montos — **no pertenece al MICITT**. El MICITT es el ministerio de ciencia y tecnología; su rol es supervisión técnica y neutralidad.

El titular correcto es **SUGEF** (Superintendencia General de Entidades Financieras) o **BCCR** (Banco Central de Costa Rica), dependiendo del alcance:

| Entidad | Rol | Alcance de auditoría |
|---|---|---|
| **SUGEF** | Supervisor financiero | Transacciones que involucren entidades supervisadas. Cumplimiento AML/CFT. |
| **BCCR** | Banco central, operador SINPE | Integridad del sistema de pagos. Política monetaria si aplica stablecoins CRC. |
| **MICITT** | Supervisión técnica | Verifica que la infraestructura cumple estándares. **No tiene acceso a datos transaccionales.** |

## Modelo de custodia compartida

La auditor key se gestiona mediante un esquema de **custodia compartida** (key splitting):

```
  Auditor Key (completa) = Share A + Share B + Share C

  Share A → SUGEF (supervisor financiero)
  Share B → BCCR (banco central)
  Share C → Custodia judicial (Poder Judicial)

  Reconstrucción: 2-of-3
    • SUGEF + BCCR = auditoría regulatoria de rutina
    • SUGEF + Judicial = investigación con orden judicial
    • BCCR + Judicial = emergencia sistémica

  Ninguna entidad puede descifrar transacciones unilateralmente.
```

Este modelo es análogo a cómo opera la gobernanza on-chain del ecosistema de credenciales (multisig 2-of-3 entre COSEVI, MICITT y desarrollador) — pero aplicado al dominio financiero con los actores correspondientes.
