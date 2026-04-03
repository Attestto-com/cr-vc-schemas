# Infraestructura Digital Abierta — Rieles de Pago e Identidad Verificable

## Costa Rica: Hacia una Infraestructura Pública Digital de Propósito General

**Presentado por:** Attestto Open — attestto.org
**Fecha:** Abril 2026
**Naturaleza:** Documento técnico complementario. No vinculado a la licitación 2026LY-000001-0012400001. Presentado como contribución al diálogo sobre infraestructura digital nacional.
**Audiencia sugerida:** MICITT/DGDCFD, Centro de Innovación Financiera (CIF), BCCR, SUGEF

---

## Contexto

La arquitectura de credenciales verificables presentada en la Propuesta de Arquitectura de Referencia para el ecosistema vial demuestra que es posible construir infraestructura digital abierta, interoperable y sin dependencia de un solo proveedor para un dominio específico del Estado.

Este documento explora las extensiones naturales de esa misma infraestructura hacia dos dominios adyacentes:

1. **Rieles de pago abiertos** — pagos digitales con privacidad, distribución automática de fees, y acceso sin intermediarios propietarios
2. **Identidad verificable de propósito general** — más allá del ecosistema vial, hacia cualquier dominio donde el ciudadano necesita demostrar algo sin exponer más de lo necesario

---

## Contenido

### Parte 1: Más Allá del Ecosistema Vial
_La misma arquitectura, cualquier dominio del Estado_
→ Fuente: docs/privacy/10-mas-alla-del-ecosistema-vial.md

### Parte 2: Privacidad Transaccional
_Cómo proteger al ciudadano, al comercio y a la institución cuando los pagos se procesan en rieles abiertos_

- Transferencias confidenciales (Token-2022, ElGamal, Bulletproofs)
- Wallets pseudónimos (identidad ≠ dirección de pago)
- Cumplimiento ZKP (pruebas de lote sin visibilidad individual)
- Custodia de la clave de auditoría (SUGEF + BCCR + Judicial, 2-of-3)
→ Fuente: docs/privacy/02-06

### Parte 3: Flujos de Transacción
_Cómo funcionan los rieles para cada actor del ecosistema_

- Ciudadano paga multa vehicular
- Comercio recibe pago de cliente
- Institución procesa miles de transacciones
- Turista paga en Costa Rica
- El puente SINPE (on-chain ↔ fiat)
→ Fuente: docs/privacy/09-flujo-de-rieles.md

### Parte 4: Experiencia del Ciudadano
_Flujos de uso real para María, Carlos, Sarah y Doña Carmen_
→ Fuente: docs/privacy/11-experiencia-del-ciudadano.md

### Parte 5: Distribución de Fees
_Modelo ilustrativo: cómo la distribución automática alinea incentivos_

- Ejemplo: renovación digital ₡1,000 (40/30/15/10/5%)
- Fondo de ecosistema para nuevas integraciones
- Gobernanza del fondo (multisig)
→ Fuente: docs/privacy/12-distribucion-de-fees.md

### Parte 6: Modelo de Financiamiento
_¿Quién paga? — Cada actor se financia desde su propia actividad_

- Código abierto: operador de infraestructura
- Auditoría on-chain: Solana Foundation (grants)
- Puente SINPE: banco/fintech (su modelo de negocio)
- Supervisión MICITT: presupuesto ordinario existente
- Inversión pública requerida: ₡0
→ Fuente: docs/privacy/13-modelo-de-financiamiento.md

### Parte 7: Identidad Vinculada a Firma Digital
_El eslabón faltante entre la identidad verificada y el acto de firmar_

- Propuesta de grupo de trabajo interinstitucional (MICITT + BCCR + TSE)
- Niveles de firma complementarios a la Firma Digital Certificada
- Canal de distribución: 740,000 renovaciones de licencia anuales
→ Fuente: Annexo A del documento principal

### Compatibilidad SINPE
_La infraestructura complementa, no reemplaza_
→ Fuente: docs/privacy/06-compatibilidad-sinpe.md

---

## Estado

Este documento está en preparación. Los contenidos fuente ya existen en los archivos referenciados y serán consolidados en una versión final para presentación independiente.

---

_Documento de libre uso público. Abril 2026_
