# 9. Cómo Funcionan los Rieles — Flujos de Transacción

## El modelo de capas

El ecosistema opera sobre tres capas independientes que se complementan:

```
  Capa de Identidad          Capa de Pagos             Capa de Cumplimiento
  ─────────────────          ─────────────             ────────────────────
  DIDs + VCs                 Token-2022 (Solana)       ZKP de lote
  Identidad verificable      Stablecoins CRC/USDC      Auditor key
  Credenciales verificables  Wallets pseudónimos        Escalamiento progresivo

  El ciudadano tiene una     El ciudadano tiene una     El regulador verifica
  identidad verificable      dirección de pago          cumplimiento sin ver
  que NO está vinculada      que NO está vinculada      transacciones
  a su wallet de pagos       a su identidad             individuales
```

Cada capa puede operar de forma independiente. Un ciudadano puede tener identidad verificable sin usar pagos on-chain. Un comercio puede aceptar pagos on-chain sin emitir credenciales. SUGEF puede auditar el cumplimiento sin acceder a la identidad de los participantes.

## Flujo 1: Ciudadano paga multa vehicular

Hoy, un ciudadano paga su multa en una ventanilla bancaria o por el sitio web del banco. El banco ve la identidad completa, el monto, y cobra comisión. COSEVI confirma el pago días después.

Con rieles abiertos:

```
  1. Ciudadano abre app del banco o wallet
     → El sistema consulta al tenant (banco/COSEVI) si hay multas pendientes
     → COSEVI responde con monto + referencia (sin exponer historial completo)

  2. Ciudadano autoriza el pago
     → El wallet genera una transacción confidencial (Token-2022)
     → El monto está cifrado — solo el ciudadano, COSEVI y el auditor pueden verlo
     → La dirección de pago es pseudónima — no vinculada al DID del ciudadano

  3. Transacción se confirma en segundos
     → COSEVI recibe confirmación inmediata (no días)
     → El ciudadano recibe comprobante verificable (VC de pago)
     → La multa se marca como pagada en tiempo real

  4. Cumplimiento
     → La transacción se incluye en el siguiente lote ZKP
     → SUGEF/BCCR verifican que el monto cumple umbrales AML sin ver el detalle
     → Solo con causa justificada + auditor key pueden descifrar el monto específico
```

### Qué cambió

| Aspecto | Proceso actual | Con rieles abiertos |
|---|---|---|
| Confirmación | Días (conciliación bancaria) | Segundos |
| Privacidad | Banco ve todo | Solo partes involucradas ven el monto |
| Costo | Comisión bancaria | Fee de red (~$0.001) |
| Comprobante | PDF o papel | VC verificable criptográficamente |
| Horario | Horario bancario | 24/7 |
| Auditoría | Cada entidad mantiene sus logs | Registro inmutable + ZKP de cumplimiento |

## Flujo 2: Comercio recibe pago de cliente

Hoy, un comercio necesita: cuenta bancaria + inscripción Hacienda + contrato con adquirente (BN Adquirencia) + datafono físico. Solo procesa Visa/MasterCard. Comisiones del 3-5%.

Con rieles abiertos:

```
  1. Comercio se registra como tenant en la plataforma
     → Presenta credencial verificable de persona jurídica
     → El sistema valida contra el Registro Nacional vía VC (no consulta manual)
     → Recibe dirección de pago pseudónima para su negocio

  2. Cliente escanea código QR o paga desde wallet
     → Transacción confidencial: monto cifrado
     → El comercio ve que recibió un pago — pero el público no ve el monto
     → Otros comercios no ven los volúmenes de venta del competidor

  3. Liquidación
     → Opción A: El comercio mantiene saldo en stablecoin CRC
     → Opción B: Liquidación automática a cuenta bancaria (vía puente SINPE)
     → El comercio elige — no está obligado a usar uno u otro

  4. Facturación electrónica
     → La transacción genera datos compatibles con factura electrónica (Hacienda)
     → El comercio o su sistema contable emite la factura
     → Los datos fiscales viajan separados de los datos de pago
```

### Qué cambió

| Aspecto | Proceso actual | Con rieles abiertos |
|---|---|---|
| Requisitos | Cuenta + Hacienda + adquirente + datafono | Credencial verificable PJ + wallet |
| Comisión | 3-5% (Visa/MC + adquirente) | ~$0.001 fee de red |
| Tecnología | Datafono EMV (GSM/Ethernet/Bluetooth) | Cualquier dispositivo con internet |
| Visibilidad | Adquirente y marcas ven todo | Solo comercio y cliente ven el monto |
| Liquidación | T+1 a T+3 (proceso batch) | Inmediata o automática |
| Alcance | Solo tarjetas Visa/MC | Cualquier wallet compatible |

## Flujo 3: Institución procesa miles de transacciones

Hoy, una institución como COSEVI procesa pagos a través de múltiples bancos. Cada banco tiene su propia integración, su propia conciliación, su propio formato. La institución no tiene visibilidad en tiempo real del estado de pagos.

Con rieles abiertos:

```
  1. La institución opera como tenant con su propia configuración
     → Define tipos de pago, montos, reglas de negocio
     → Cada servicio (multas, renovaciones, marchamo) tiene su dirección

  2. Los pagos llegan por cualquier canal
     → Desde wallet del ciudadano
     → Desde app del banco (si el banco integra los rieles)
     → Desde portal web institucional
     → Todos convergen al mismo registro on-chain

  3. Conciliación en tiempo real
     → La institución ve un dashboard con todos los pagos confirmados
     → No espera reportes bancarios de T+1
     → Cada pago tiene su VC de comprobante — verificable por cualquier parte

  4. Reportes para contraloría
     → Los datos agregados están disponibles sin exponer transacciones individuales
     → La Contraloría puede verificar que los montos totales cuadran
     → Si necesita detalle específico, usa el mecanismo de escalamiento (ZKP → auditor key → orden formal)
```

## Flujo 4: Turista paga en Costa Rica

Hoy, un turista depende exclusivamente de tarjetas internacionales (Visa/MC) o efectivo. Las comisiones cross-border son del 3-5% + spread cambiario. Los comercios pequeños (sodas, tours, artesanos) frecuentemente no tienen datafono.

```
  1. Turista llega con USDC/stablecoins en su wallet
     → O compra USDC en un exchange antes del viaje
     → O el banco del turista ofrece stablecoins (tendencia creciente)

  2. Escanea QR del comercio
     → La transacción se ejecuta en USDC
     → El comercio puede recibir en USDC y convertir a CRC, o mantener en USDC
     → El tipo de cambio es transparente y en tiempo real

  3. Sin intermediarios
     → No hay procesador de pagos internacional cobrando 3-5%
     → No hay spread cambiario oculto
     → El comercio pequeño no necesita datafono — solo un celular con QR

  4. Beneficio país
     → Se recupera el ~2% que hoy sale del país en comisiones internacionales
     → El capital del turista entra directamente a la economía local
     → Los datos de gasto turístico son verificables para el ICT
       (en agregado, sin exponer al turista individual)
```

## El puente SINPE

Los rieles on-chain no son un sistema aislado. El puente SINPE permite que los fondos fluyan entre ambos mundos:

```
  Mundo on-chain                    Puente                     Mundo SINPE
  ──────────────                    ──────                     ───────────
  Stablecoin CRC  ───────────►  Entidad regulada  ────────►  Cuenta bancaria
  (Token-2022)                  (banco o fintech)             (colones)

  Cuenta bancaria ◄───────────  Entidad regulada  ◄────────  SINPE Móvil
  (colones)                     (banco o fintech)             transferencia
```

La entidad que opera el puente:
- Está supervisada por SUGEF
- Mantiene reserva 1:1 de colones por cada stablecoin CRC emitida
- Reporta movimientos según normativa existente
- Opera bajo los mismos estándares AML/CFT que cualquier entidad financiera

El ciudadano no necesita saber qué riel usa. El sistema rutea automáticamente según el contexto.

## El rol de MICITT en los rieles de pago

MICITT no opera los rieles de pago — eso corresponde a BCCR y SUGEF. El rol natural de MICITT en este contexto es:

```
  1. Supervisión técnica
     → Que la infraestructura cumpla estándares de ciberseguridad
     → Que los protocolos criptográficos sean robustos
     → Que exista interoperabilidad con estándares internacionales

  2. Gobernanza del estándar
     → El estándar de credenciales verificables (VCs) para el ecosistema vial
       se define con participación de MICITT
     → COSEVI implementa el estándar dentro del marco de gobernanza acordado
     → Cambios al estándar pasan por gobernanza multisig (COSEVI + MICITT + dev)

  3. Separación respecto a datos transaccionales
     → Los datos financieros son competencia de SUGEF/BCCR
     → El rol de MICITT es técnico y de gobernanza, no financiero
     → Esta separación ya existe en el Estado costarricense y la arquitectura la respeta
```

La arquitectura se alinea con la separación de competencias existente: MICITT supervisa tecnología, SUGEF supervisa finanzas, BCCR opera pagos, el Poder Judicial interviene con orden formal.
