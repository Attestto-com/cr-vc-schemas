# 3. Capa 2 — Wallets Pseudónimos (Separación de Identidad y Pago)

## El principio

El wallet de identidad del ciudadano (donde porta su mDL, VCs, DIDs) **no es el mismo** que su wallet de pagos. Esta separación es fundamental:

```
  Wallet de Identidad (DID wallet)        Wallet de Pagos
  ─────────────────────────────           ─────────────────────────
  did:web:ejemplo.cr:user                 Dirección pseudónima
                                          (no vinculada al DID)
  • mDL
  • VCs de salud                          • Saldo en CRC/USDC
  • Historial de conducción               • Historial de pagos
  • Credenciales laborales                • Recibos

        Vinculación conocida SOLO por:
        • El ciudadano
        • La plataforma del tenant (para sus propios clientes)
        • SUGEF/BCCR (con orden regulatoria)
```

## Por qué importa

- **Personas:** Un ciudadano que paga una multa en el sitio web del banco no expone su historial financiero completo a nadie. El pago y la identidad viajan por canales separados.
- **Comercios:** Un negocio que recibe pagos en stablecoin no revela su volumen total ni su cartera de clientes a competidores.
- **Instituciones:** COSEVI puede verificar que un pago se realizó sin necesitar acceso al saldo ni al historial del ciudadano.
- **El regulador (SUGEF/BCCR)** puede, cuando existe causa justificada y orden formal, solicitar la vinculación entre la identidad (DID) y la dirección de pago. Este es el único actor externo con esa capacidad.

## Dónde vive la relación identidad ↔ wallet

La plataforma del ecosistema mantiene las relaciones — tanto de sus usuarios directos como de los tenants con sus clientes. Esta arquitectura puede estar **distribuida**:

- **El tenant conoce la relación** entre la identidad y el wallet de pagos de sus propios clientes
- **La plataforma central no necesita conocer** la relación de los clientes de un tenant — el tenant la gestiona
- **SUGEF/BCCR** accede a la relación solo con causa justificada y orden formal, solicitándola al tenant o a la plataforma según corresponda

Esto significa que no hay un punto central que conozca todas las vinculaciones. El conocimiento está distribuido entre los actores que legítimamente lo necesitan.

## Implementación

Cada ciudadano puede generar múltiples direcciones de pago derivadas de una clave maestra. Para el ecosistema vial, el sistema genera automáticamente una dirección dedicada a pagos vehiculares — separada de cualquier otra actividad financiera del ciudadano.
