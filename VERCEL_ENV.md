# Variables de entorno para Vercel (Prisma serverless)

Para evitar el error "prepared statement already exists" en Vercel, configura estas variables en el dashboard de Vercel:

## DATABASE_URL

Debe incluir **`?pgbouncer=true&connection_limit=1`** al final:

```
postgresql://postgres.xxx:tu_password@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## DIRECT_URL

Conectión directa (sin pgbouncer) para migraciones:

```
postgresql://postgres.xxx:tu_password@db.xxx.supabase.co:5432/postgres
```

> **Nota:** Si usas el pooler de Supabase en puerto 5432 como DIRECT_URL, asegúrate de tener ambas variables configuradas. DIRECT_URL se usa para migraciones y esquema.
