# Análisis de la base de datos `bbdd_ventas`

Perfecto, vamos paso a paso. Empezamos con el **Punto 1: Primera Forma Normal (1FN)**.

---

## 📘 ¿Qué exige la 1FN?

Para que una tabla esté en **1FN** debe cumplir con las siguientes reglas:

1. **Atributos atómicos:** Todos los valores deben ser indivisibles (sin listas, valores compuestos o multivaluados).
2. **Homogeneidad:** Cada columna debe contener un solo valor del mismo tipo de dato.
3. **Sin grupos repetidos:** No debe haber columnas repetidas (ej. `tel1`, `tel2`) ni filas duplicadas que representen lo mismo.
4. **Unicidad:** Cada fila debe ser única y contar con una **Clave Primaria (PK)** definida.
5. **Dominio correcto:** Los valores deben pertenecer al dominio adecuado (sin estructuras complejas dentro de un mismo campo).

---

## 🔍 Revisión tabla por tabla

### ✅ ROLES
* `codigo_rol` (PK, autoincremental), `nombre_rol` (VARCHAR).
* **Estado:** Cumple 1FN. Atributos atómicos y PK definida.

### ✅ USUARIOS
* Atributos atómicos, PK `codigo_user`.
* `correo_user` con restricción `UNIQUE`: correcto.
* **Estado:** Cumple 1FN.

### ⚠️ CREDENCIALES
* Atributos atómicos, PK `codigo_cred`.
* **Estado:** Cumple 1FN. 
> 💡 *Nota:* Ojo con `foto_cred` (BLOB). Es atómico (un binario), pero conviene valorar si guardar imágenes directamente en la BD es la mejor opción.

### ⚠️ MENSAJES
* Atributos atómicos, pero **no tiene PRIMARY KEY**.
* Técnicamente puede estar en 1FN si asumimos que la combinación `(codigo_user, fecha_mensaje, asunto_mensaje)` identifica la fila, pero no está declarada. Para 1FN estricta deberías declarar una PK (sea compuesta o añadiendo `codigo_mensaje INT AUTO_INCREMENT`).
* **Estado:** Parcialmente en 1FN (Atributos atómicos sí, pero falta PK declarada).

### ✅ CATEGORIAS
* PK `codigo_categoria`, atributos atómicos.
* **Estado:** Cumple 1FN.

### ⚠️ PRODUCTOS
* PK `codigo_producto`, atributos atómicos.
* **Estado:** Cumple 1FN.
> 💡 *Sugerencia de diseño:* `unidad_producto DECIMAL(5,2)` y `medida_producto VARCHAR(20)` describen lo mismo (la unidad de medida, ej. `1.5` + `"kg"`). No viola la 1FN (siguen siendo atómicos), pero es un *smell* de diseño. Se podría simplificar o separar con una tabla de unidades.

### ✅ CLIENTES
* PK `codigo_customer`, atributos atómicos.
* **Estado:** Cumple 1FN.

### ✅ PEDIDOS
* PK `codigo_pedido`, atributos atómicos.
* **Estado:** Cumple 1FN.

### ⚠️ LISTA_PRODUCTOS_PEDIDOS
* Atributos atómicos (`codigo_pedido`, `codigo_producto`, `cantidad_productos`).
* **No tiene PRIMARY KEY declarada**. Aunque la combinación `(codigo_pedido, codigo_producto)` sería la clave natural, no está declarada. Para 1FN estricta, debes definirla.
* **Estado:** Parcialmente en 1FN (Atributos atómicos sí, PK no declarada).

### ✅ VENDEDORES
* PK `codigo_seller`, atributos atómicos.
* **Estado:** Cumple 1FN.

### ⚠️ VENDEDORES_PEDIDOS
* PK `codigo_pedido`.
* Atributos atómicos.
* **Estado:** Cumple 1FN (la PK está declarada, aunque su diseño es discutible para 2FN/3FN si un pedido solo puede tener un vendedor).

### ✅ COMPRAS
* PK `codigo_compra`, atributos atómicos.
* **Estado:** Cumple 1FN.

### ⚠️ LISTA_PRODUCTOS_COMPRADOS
* Atributos atómicos.
* **No tiene PRIMARY KEY declarada.** La clave natural debería ser `(codigo_compra, codigo_producto)`.
* **Inconsistencia de tipo:** `codigo_producto` es `VARCHAR(45)` aquí, mientras que en `PRODUCTOS` es `VARCHAR(10)`. Es una mala práctica que genera problemas de rendimiento y compatibilidad de FK.
* **Estado:** Parcialmente en 1FN (Atributos atómicos sí, PK no declarada).

---

## 📊 Resumen del Punto 1 (1FN)

| Tabla | ¿En 1FN? | Observación |
| :--- | :---: | :--- |
| **ROLES** | ✅ Sí | — |
| **USUARIOS** | ✅ Sí | — |
| **CREDENCIALES** | ✅ Sí | BLOB de foto (valorar almacenamiento externo) |
| **MENSAJES** | ⚠️ Parcial | Falta PK declarada |
| **CATEGORIAS** | ✅ Sí | — |
| **PRODUCTOS** | ✅ Sí | Unidad de medida duplicada (mejora de diseño) |
| **CLIENTES** | ✅ Sí | — |
| **PEDIDOS** | ✅ Sí | — |
| **LISTA_PRODUCTOS_PEDIDOS** | ⚠️ Parcial | Falta PK compuesta |
| **VENDEDORES** | ✅ Sí | — |
| **VENDEDORES_PEDIDOS** | ✅ Sí | PK discutible (a revisar en 2FN/3FN) |
| **COMPRAS** | ✅ Sí | — |
| **LISTA_PRODUCTOS_COMPRADOS** | ⚠️ Parcial | Falta PK + tipo inconsistente en `codigo_producto` |

---

## 📌 Conclusión del Punto 1

Tu modelo está muy cerca de cumplir con la **1FN**. Los tres ajustes requeridos son:

1. **`MENSAJES` sin PK:** Añadir `codigo_mensaje INT AUTO_INCREMENT` como PK.
2. **`LISTA_PRODUCTOS_PEDIDOS` sin PK:** Declarar `PRIMARY KEY (codigo_pedido, codigo_producto)`.
3. **`LISTA_PRODUCTOS_COMPRADOS` sin PK e inconsistente:** Declarar `PRIMARY KEY (codigo_compra, codigo_producto)` y corregir el tipo de dato de `codigo_producto` a `VARCHAR(10)`.

## 🧪 Pruebas que te sugiero hacer ahora

**Ejecuta en MySQL estas consultas para confirmar lo que te digo:**

```sql

-- 1) Ver qué tablas NO tienen PRIMARY KEY
SELECT t.table_name
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints tc
  ON t.table_name = tc.table_name
 AND tc.constraint_type = 'PRIMARY KEY'
 AND t.table_schema = tc.table_schema
WHERE t.table_schema = 'bbdd_ventas'
  AND tc.constraint_name IS NULL;

-- 2) Verificar tipos de codigo_producto en las 3 tablas
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'bbdd_ventas'
  AND column_name = 'codigo_producto';

-- 3) Ver si las FK de LISTA_PRODUCTOS_COMPRADOS se crearon bien
SELECT constraint_name, table_name, referenced_table_name
FROM information_schema.key_column_usage
WHERE table_schema = 'bbdd_ventas'
  AND table_name = 'LISTA_PRODUCTOS_COMPRADOS';
```