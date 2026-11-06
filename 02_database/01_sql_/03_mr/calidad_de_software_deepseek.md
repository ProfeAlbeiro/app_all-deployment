# Calidad de Software - Reporte de Seguridad y Remediación (ISO/IEC 25010)

## 1. Explicación Técnica Detallada

La vulnerabilidad detectada por SonarQube bajo la regla **"Responsibility | Not trustworthy"** señala que el código está utilizando credenciales de base de datos *hardcodeadas* y sin protección. En el fragmento afectado, el usuario `root` se conecta a MySQL sin contraseña (`$password = ""`).

SonarQube marca esto como **Security Blocker** debido a las siguientes razones:

* **Regla Trustworthy:** Establece explícitamente que el código confiable no debe exponer ni *hardcodear* información personal o credenciales sensibles.
* **Riesgo de Usuario Root:** Usar `root` sin contraseña es una de las configuraciones más peligrosas en MySQL. La documentación oficial advierte que si es posible ejecutar `mysql -u root` sin que pida contraseña, cualquier persona puede conectarse con privilegios totales al servidor de base de datos.
* **Exposición en Repositorio:** En el proyecto, el archivo `models/DataBase.php` está versionado en el repositorio. Cualquier colaborador (o atacante que acceda al código) conoce la ubicación exacta de la base de datos y sabe que no tiene contraseña.

> **Nota:** El problema no es solo la contraseña vacía, sino que la configuración sensible vive dentro del código fuente en lugar de estar en variables de entorno o en un archivo de configuración externo.

## 2. Importancia y Justificación bajo ISO/IEC 25010

La norma **ISO/IEC 25010** define la **Seguridad** como la capacidad del sistema para proteger la información y los datos, de modo que las personas o sistemas tengan el grado de acceso adecuado a su tipo y autorización.

| Subcaracterística ISO 25010 | Cómo se ve afectada en este hallazgo |
| --- | --- |
| **Confidencialidad** | Las credenciales están expuestas en el repositorio. Si el código se filtra, el atacante obtiene acceso directo a la base de datos. |
| **Integridad** | Con acceso `root` sin contraseña, un atacante podría modificar o eliminar datos de usuarios, roles, etc. |
| **Fiabilidad** | Si alguien cambia la contraseña de `root` por seguridad, la aplicación deja de funcionar porque el código asume que no hay contraseña. |

Además, este hallazgo genera deuda técnica en **Mantenibilidad**: cada vez que se cambie de entorno (desarrollo, pruebas, producción), se tendría que editar el código fuente y volver a desplegar, lo cual es altamente propenso a errores.

## 3. Solución Completa Refactorizada

La solución recomendada es externalizar las credenciales a variables de entorno y nunca usar `root` sin contraseña. Para mantener la compatibilidad sin frameworks, se utiliza el paquete `vlucas/phpdotenv`.

### Paso 3.1: Instalar `phpdotenv`

Ejecuta en la raíz de tu proyecto:

```bash
composer require vlucas/phpdotenv
```

*(Si el proyecto no tiene `composer.json`, créalo primero con `composer init` o instala Composer globalmente).*

### Paso 3.2: Crear el archivo `.env` en la raíz del proyecto

```env
#.env - NUNCA subir este archivo al repositorio
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=db_inventory
DB_USERNAME=app_inventory_user
DB_PASSWORD=UnaClaveSeguraYFuerte_2026!
```

### Paso 3.3: Crear `.env.example` (este archivo SÍ se sube al repositorio)

```env
#.env.example - Plantilla para otros desarrolladores
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=db_inventory
DB_USERNAME=
DB_PASSWORD=
```

### Paso 3.4: Añadir `.env` al `.gitignore`

```gitignore
.env
vendor/
```

### Paso 3.5: Refactorizar `models/DataBase.php`

```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Cargar variables de entorno desde la raíz del proyecto
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

class DataBase {
    # Conexión mediante variables de entorno
    public static function connection() {
        $hostname = $_ENV['DB_HOST'];
        $port     = $_ENV['DB_PORT'];
        $database = $_ENV['DB_DATABASE'];
        $username = $_ENV['DB_USERNAME'];
        $password = $_ENV['DB_PASSWORD'];

        $pdo = new PDO(
            "mysql:host=$hostname;port=$port;dbname=$database;charset=utf8",
            $username,
            $password
        );
        
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    }
}
?>
```

### Paso 3.6: Crear un usuario de base de datos dedicado (NO usar `root`)

Ejecuta en MySQL como administrador:

```sql
-- Crear usuario específico para la aplicación
CREATE USER 'app_inventory_user'@'localhost' IDENTIFIED BY 'UnaClaveSeguraYFuerte_2026!';

-- Otorgar solo los permisos necesarios (SELECT, INSERT, UPDATE, DELETE)
GRANT SELECT, INSERT, UPDATE, DELETE ON db_inventory.* TO 'app_inventory_user'@'localhost';

FLUSH PRIVILEGES;
```

> **Principio de Mínimo Privilegio:** Si la aplicación es comprometida, el atacante no tendrá permisos para ejecutar `DROP TABLE` ni para acceder a otras bases de datos.

## 4. Comparativa Antes y Después

| Aspecto | Antes (inseguro) | Después (remediado) |
| --- | --- | --- |
| **Credenciales en código** | `$username = "root"; $password = "";` | `$_ENV['DB_USERNAME']` y `$_ENV['DB_PASSWORD']` |
| **Usuario de BD** | `root` (todos los privilegios) | `app_inventory_user` (solo DML sobre `db_inventory`) |
| **Contraseña** | Vacía (cualquiera entra) | Fuerte, definida en `.env` fuera del repositorio |
| **Exposición en Git** | Credenciales visibles en cada commit | `.env` ignorado por `.gitignore` |
| **SonarQube** | Security Blocker | Regla satisfecha |

## 5. Guía de Verificación

Antes de hacer commit, ejecuta estas pruebas:

1. **Verificar que `.env` no se sube:**
   ```bash
   git status
   ```
   El archivo `.env` **no** debe aparecer en la lista de cambios. Si aparece, revisa tu `.gitignore`.

2. **Probar la conexión con el nuevo usuario:**
   ```bash
   mysql -u app_inventory_user -p -h localhost -P 3306 db_inventory
   ```
   Debe pedir la contraseña y, una vez dentro, `SHOW TABLES;` debe mostrar las tablas correspondientes.

3. **Probar que `root` remoto ya no es accesible sin contraseña:**
   ```bash
   mysql -u root -h 127.0.0.1 -p
   ```
   Debe pedir contraseña. Si no la pide, significa que `root` sigue sin protección y debes ejecutar:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'otra_clave_fuerte';
   ```

4. **Ejecutar la aplicación:**
   * Accede a `?c=Login` y verifica que el inicio de sesión funciona.
   * Si ves un error de conexión, revisa que las variables en `.env` tengan los valores correctos y que `phpdotenv` esté cargando la ruta adecuada.

5. **Re-ejecutar SonarQube:**
   Verifica que el nuevo `DataBase.php` ya no contenga cadenas como `"root"` o contraseñas vacías en la asignación de credenciales.

6. **Commit seguro:**
   ```bash
   git add .env.example models/DataBase.php .gitignore composer.json composer.lock
   git commit -m "fix (security): externalizar credenciales de BD a variables de entorno"
   ```