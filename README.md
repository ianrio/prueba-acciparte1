# Prueba técnica Acciparte — Caso práctico 1

## 1. Requisitos

- Node.js 18 o superior.
- PostgreSQL 13 o superior con un usuario que pueda crear bases de datos.
- `psql` accesible desde la terminal.

---

## 2. Instrucción de ejecución

### 2.1. Base de datos

```bash
# Desde una shell con psql en PATH:
createdb acciparte
```

> El usuario usadoes `postgres` y la contraseña igual

---

### 2.2. Backend

```bash
cd backend
cp .env.example .env        
npm install
npm run db:schema            
npm run db:seed               
npm run dev                   
```

---

### 2.3. Frontend

En otra terminal:

```bash
cd frontend
copy .env.example .env       
npm install
npm run dev                   # http://localhost:5173
```

---

### 2.4. Credenciales


Tenant: Acme ; User: `admin@acme.com` ;  Pass: `acme1234` ;
Tenant: Globex ; User: `admin@globex.com`  Pass:  `globex1234` ;


---

## 3. Modelo de datos

Relación 1:N de los tenants a usuarios y estos a los reportes

La id de los tennts está presente en todas, de forma que solo puedan verse bajo el mismo tenant

---

## 4. Endpoints implementados

Base URL: `http://localhost:3001/api`

| Método | Rutaa                 | Auth | Descripción                                          |
|--------|-----------------------|------|-------------------------------------------------------|
| GET    | `/health`             | No   | Comprobación de vida del servicio                     |
| GET    | `/intervention-types` | No   | Lista cerrada para el `<select>` del formulario       |
| POST   | `/auth/login`         | No   | Devulve `{ token, user, tenant }`                     |
| GET    | `/auth/me`            | Sí   | Datos del usuario y tenant del token                  |
| GET    | `/reports`            | Sí   | Lista de informes **del tenant del token**            |
| GET    | `/reports/:id`        | Sí   | Detalle de un informe (404 si pertenece a otro tenant)|
| POST   | `/reports`            | Sí   | Crea un informe **asociado al tenant del token**      |


---

## 5. Breve explicación de cómo se garantiza el aislamiento multi-tenant.


Cuando un usuario hace login, el servidor firma un token que incluye `tenantId` en su payload.

A partir de ahí, **el cliente nunca envía el `tenantId`**. Si lo intenta meter en el body, se ignora.

El middleware [`authenticate`] verifica el JWT y deja la identidad en `req.auth`.

La capa de servicio de reports recibe el `tenantId` como **primer parámetro** y lo aplica en el `WHERE` de cada consulta.

---
