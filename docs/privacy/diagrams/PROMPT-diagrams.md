# Prompts para generar diagramas en Claude App

Usa el mismo estilo visual de los diagramas d1-d6: cajas redondeadas con colores pastel (verde menta, azul claro, naranja suave, lavanda), texto oscuro, flechas grises con etiquetas, sin bordes duros. Fondo blanco. Texto en español.

---

## d8 — Distribución Atómica de Fees

Genera un diagrama que muestre la distribución de fees de una renovación digital de licencia por ₡1,000.

Estructura:
- Arriba: caja del ciudadano "Ciudadano paga ₡1,000 — Renovación digital de licencia"
- Flecha hacia abajo a: "Contrato Inteligente — Distribución atómica (todas las partes reciben en la MISMA transacción)"
- Del contrato salen 5 flechas hacia abajo, cada una a una caja:
  - COSEVI: ₡400 · 40% — Ingreso institucional directo, confirmación inmediata
  - Proveedor de interfaz: ₡300 · 30% — La app que usó el ciudadano, múltiples proveedores compiten
  - Operador de infraestructura: ₡150 · 15% — Nodos, SDKs, esquemas, verificación
  - Fondo de ecosistema: ₡100 · 10% — Nuevas integraciones, auditorías, investigación
  - Reserva de mantenimiento: ₡50 · 5% — Actualizaciones de protocolo, soporte largo plazo

Abajo del todo, una caja comparativa con dos columnas:
- Izquierda (rojo suave): "Modelo actual — ₡13,000 → un solo proveedor · Conciliación mensual"
- Derecha (verde suave): "Modelo abierto — ₡1,000 → 5 actores automáticamente · Conciliación: cero"

---

## d9 — Tres Capas de Privacidad Transaccional

Genera un diagrama vertical con tres capas apiladas, cada una en un color distinto, conectadas por flechas hacia abajo.

Capa 1 (azul claro): "Transferencias Confidenciales · Token-2022"
- Montos cifrados (Twisted ElGamal)
- Range proofs (Bulletproofs)
- Auditor key (SUGEF / BCCR)
- Resultado: "El público ve QUE ocurrió una transacción, pero NO cuánto"

Capa 2 (verde claro): "Wallets Pseudónimos"
- Wallet de identidad (DIDs + VCs + mDL) separado de Wallet de pagos (dirección pseudónima)
- Vinculación conocida solo por: ciudadano · tenant · regulador con orden formal
- Resultado: "Identidad y pagos viajan por canales separados"

Capa 3 (naranja suave): "Cumplimiento ZKP en Lote"
- Prueba mensual/trimestral: N transacciones · todas ≤ umbral AML · todos con KYC vigente
- Escalamiento progresivo: ZKP lote → auditor key → DID↔wallet → orden judicial
- Resultado: "El regulador verifica cumplimiento sin ver transacciones individuales"

Abajo de las tres capas, una caja resumen (lavanda):
- Ciudadano: privacidad real
- Regulador: auditoría completa
- Verificación: matemática, no confianza

---

## d10 — Puente SINPE

Genera un diagrama horizontal con tres zonas:

Izquierda (verde claro): "Mundo On-chain"
- Wallet del ciudadano (Stablecoin CRC)
- Wallet del comercio (recibe pagos 24/7)
- Wallet COSEVI (recibe fees, confirmación inmediata)

Centro (lavanda): "Puente — Entidad Regulada"
- Banco o fintech supervisado por SUGEF
- Reserva 1:1 en colones
- Reporta según normativa AML/CFT

Derecha (naranja suave): "Mundo SINPE"
- Cuenta bancaria (colones)
- SINPE Móvil
- Nómina · Préstamos · Domiciliaciones

Flechas bidireccionales entre On-chain y Puente (etiqueta: "stablecoin CRC"), y entre Puente y SINPE (etiqueta: "colones").

Abajo, una caja gris claro "Ruteo Automático":
- Multa vehicular → rieles on-chain
- Nómina → SINPE
- Turista paga → USDC on-chain
- Comercio liquida → puente → cuenta bancaria

Texto al pie: "El ciudadano no necesita saber qué riel usa"

---

## d11 — Modelo de Financiamiento (¿Quién Paga?)

Genera un diagrama con dos columnas conectadas por flechas. Cada flecha tiene la etiqueta "₡0 para el Estado".

Columna izquierda (azul claro) — "Componente de infraestructura":
- Código open source (schemas, SDKs, DID resolver)
- Auditoría on-chain (contratos inteligentes)
- Integración institucional (COSEVI, municipalidades)
- Puente SINPE (on-ramp / off-ramp)
- Operación y mantenimiento (nodos, SDKs)
- Supervisión y gobernanza (estándares)

Columna derecha (verde claro) — "Quién lo financia":
- Operador de infraestructura (operación comercial)
- Solana Foundation (grants)
- Fondo de ecosistema (10% de cada tx)
- Banco / fintech (su modelo de negocio)
- 15% de cada transacción (automático)
- Presupuesto ordinario MICITT (mandato existente)

Cada componente de la izquierda se conecta con su financiador de la derecha con una flecha etiquetada "₡0 para el Estado".

Abajo, caja grande (rojo suave con texto fuerte):
"Inversión pública requerida: ₡0 — El Estado no financia la infraestructura. Se conecta a ella."

Debajo, caja (naranja suave) "Lo que el Estado SÍ aporta":
- Participar en gobernanza (multisig)
- Definir estándares (con soporte técnico)
- Supervisar cumplimiento
- Conectar sistemas existentes
