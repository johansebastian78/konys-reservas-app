# Konys Pizza · Sistema de Reservas de Mesas

Aplicación web para que los clientes de Konys Pizza (Cra. 36 con calle 41, Bucaramanga) reserven una mesa desde el celular o el computador, vean qué horarios están libres y consulten la carta. El administrador tiene un panel en `/admin` para manejar mesas, horarios, reservas y la carta.

Proyecto de la asignatura Configuración y Mantenimiento de Software · Universidad de Santander · Docente Carlos Carrascal.

## Enlaces

- Aplicación en Vercel: https://konys-reservas-app-one.vercel.app
- Video explicativo: pendiente por subir
- Repositorio: https://github.com/johansebastian78/konys-reservas-app
- Mockups en Figma: https://www.figma.com/design/bjiIWOOJAHOwdeFFZISUV7/Konys-Pizza---Mockups

## Tecnologías

- React 18 + Vite
- React Router (rutas `/` y `/admin`)
- CSS3 con Flexbox y Grid (diseño responsivo)
- Supabase (base de datos)
- GitHub y Vercel

## Funciones

Cliente
- Ver las mesas con zona, capacidad y estado
- Elegir mesa, fecha y hora (las horas ocupadas salen en gris)
- Llenar nombre, personas y contacto y confirmar
- Ver la confirmación de la reserva
- Ver la carta por categorías

Administrador (`/admin`, con contraseña)
- Registrar, editar, borrar y activar o desactivar mesas
- Cambiar los horarios de atención por día
- Ver reservas filtrando por fecha o por mesa y cambiar su estado
- Agregar, editar, ocultar y borrar platos de la carta

## Estructura

```
konys-reservas-app/
├── index.html
├── package.json
├── vercel.json            # Para que la ruta /admin funcione en Vercel
├── src/
│   ├── main.jsx           # Montaje de React y rutas
│   ├── pages/             # Cliente.jsx y Admin.jsx
│   ├── components/        # MesaCard, SlotGrid, ReservaModal, Carta...
│   │   └── admin/         # Secciones del panel
│   ├── hooks/useDatos.js  # Carga mesas, horarios y platos
│   ├── services/
│   │   ├── supabase.js    # Conexión con Supabase
│   │   └── slots.js       # Cálculo de horarios libres y ocupados
│   └── styles/styles.css
├── supabase/script.sql    # Tablas y datos de prueba
└── docs/                  # Documento del proyecto y mockups
```

## Cómo ejecutarlo

1. Instalar Node.js
2. Clonar el repositorio y entrar a la carpeta
3. Instalar dependencias

```
npm install
```

4. Crear un archivo `.env` copiando `.env.example` y poner la URL y la anon key de Supabase
5. Arrancar

```
npm run dev
```

6. Abrir `http://localhost:5173` y para el panel `http://localhost:5173/admin`

## Base de datos

En Supabase abrir SQL Editor, pegar el contenido de `supabase/script.sql` y darle Run. Eso crea las tablas `mesas`, `horarios`, `reservas` y `platos` con datos de prueba.

## Créditos

Integrantes: Johan
