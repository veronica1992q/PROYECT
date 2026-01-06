# miApp — Android (Windows)

## Requisitos mínimos
- Android Studio + Android SDK instalados
- `ANDROID_SDK_ROOT` o `ANDROID_HOME` apuntando al SDK
- Añadir `platform-tools` a `PATH` (p. ej. `C:\Users\<tu_usuario>\AppData\Local\Android\sdk\platform-tools`)
- Emulador Android creado (o dispositivo físico con Depuración USB)
- (Opcional, para builds en la nube) Cuenta en Expo y `eas-cli` instalada

## Comandos útiles
- Iniciar Metro y abrir en emulador Android (Expo managed):
  - npm: `npm run android`
- Build nativa y ejecutar localmente (requiere toolchain):
  - npm: `npm run run-android` (ejecuta `expo run:android`)
- Build de producción en EAS (APK/AAB):
  - npm: `npm run build-android` (ejecuta `eas build -p android`)

## Pasos rápidos en Windows
1. Abre Android Studio → AVD Manager → inicia un emulador (o conecta un dispositivo y activa USB Debugging).
2. Verifica `adb devices` en terminal para confirmar el dispositivo/emulador visible.
3. En el proyecto: `npm install` (si no lo has hecho).
4. Para ejecutar en emulador: `npm run run-android`.
5. Para generar un APK/AAB con EAS:
   - Instala EAS CLI: `npm install -g eas-cli`
   - Inicia sesión: `eas login`
   - `npm run build-android`

## Notas
- Si `expo run:android` falla por configuración del SDK, revisa las variables de entorno y que `platform-tools` esté en `PATH`.
- Para publicar builds con EAS necesitarás configurar credenciales de firma; EAS te guía durante el proceso.

---
Si quieres, agrego una pequeña sección al README del root del repo también o hago un checklist automatizado en `scripts` para comprobar `adb`. ¿Lo hago? 🔧

## Comprobación rápida
- Ejecuta `npm run check-android` para listar dispositivos/emuladores (`adb devices`). Si no aparecen, abre un emulador o conecta un dispositivo y habilita depuración USB.
