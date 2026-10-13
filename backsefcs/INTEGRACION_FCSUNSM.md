# API de integración con FCSUNSM

Esta API es solo para comunicación servidor-a-servidor. FCSUNSM consulta a
Segunda Especialidad y nunca recibe las credenciales ni el JWT de un usuario.

## Configuración en el VPS de Segunda Especialidad

Configure estas variables en el servicio que inicia `backsefcs` (por ejemplo,
en el archivo `ecosystem.config.js` de PM2 o en la unidad systemd):

```text
INTEGRATION_API_KEY=use_una_clave_aleatoria_larga_y_unica
INTEGRATION_ALLOWED_IPS=IP_PUBLICA_DEL_VPS_FCSUNSM
INTEGRATION_TRUST_PROXY=true
DB_DATABASE=nombre_real_de_la_base_restaurada_en_este_vps
```

`INTEGRATION_ALLOWED_IPS` es opcional, pero se recomienda cuando FCSUNSM tiene
IP pública fija. Defina `INTEGRATION_TRUST_PROXY=true` solamente si el backend
está detrás de su Nginx/proxy confiable; en ese caso la lista usa la IP pública
real del VPS FCSUNSM. Sin esa variable se usa la IP de conexión directa.
Use HTTPS en ambos VPS. La clave no debe estar en el frontend ni en Git.

`DB_DATABASE` es importante si el respaldo fue restaurado con un nombre distinto
al predeterminado. El servidor usa ese valor para conectarse a PostgreSQL. Puede
definir también `DB_HOST`, `DB_PORT`, `DB_USERNAME` y `DB_PASSWORD` cuando la
conexión no sea local.

## Consulta

```http
GET /api/integration/v1/students/{documentNumber}/academic-status
X-Integration-Api-Key: <INTEGRATION_API_KEY>
Accept: application/json
```

Ejemplo:

```bash
curl -H "X-Integration-Api-Key: $INTEGRATION_API_KEY" \
  "https://especialidad.ejemplo.edu.pe/api/integration/v1/students/12345678/academic-status"
```

Respuesta exitosa resumida:

```json
{
  "found": true,
  "document_number": "12345678",
  "students": [{
    "student_id": 42,
    "program": "Segunda Especialidad ...",
    "has_debt": false,
    "debt_count": 0,
    "debt_amount": 0,
    "sustentation_expedito": {
      "has_operation": true,
      "operation_paid": true,
      "operation_status": "Pagado",
      "has_constancy": true,
      "document_code": "15-2026-C.Exp.S.USE",
      "issued_at": "2026-10-12T..."
    }
  }]
}
```

Reglas aplicadas:

- Una deuda es un pago del estudiante en estado `Pendiente` o `Registrado`.
- La operación de expedito de sustentación es un pago con `id_concept = 130`.
- Una operación se considera pagada con estado `Pagado`, `Aceptado`,
  `Regularizado` o `Confirmado`.
- La constancia emitida es un `Document_book` activo con `id_concept = 130`.

Los resultados se devuelven por cada matrícula activa del documento, porque una
persona puede tener más de una especialidad. FCSUNSM debe elegir la matrícula o
programa que corresponda a su trámite.
