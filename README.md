# Proyecto Final

## Instrucciones

1) Dirígete al repositorio en GitHub y copia el enlace del mismo.
2) En tu ordenador, abre la terminal.
3) En la terminal, ingresa el siguiente comando: "git clone" y pega el enlace del repositorio.
4) Presiona Enter y espera hasta que el repositorio termine de descargarse.
5) Con el mouse, arrastra la carpeta del repositorio hacia el icono de Visual Studio Code, o ábrela directamente en Visual Studio Code.
6) Repitan los pasos anteriores con el siguiente repositorio (https://github.com/bruno-argenta/fake_instagram.git).
7) Dentro de Visual Studio Code, abre una terminal e ingresa los siguientes comandos en la carpeta nombrada fake_instagram:
    - cd fake_instagram
    - cd api-node
    - npm install
    - node server.js (La terminal debería mostrar "Server running on port 3001" y "MongoDB connected")
8)  Dentro de Visual Studio Code, abre una terminal e ingresa los siguientes comandos en la carpeta nombrada Fakestagram_Mobile:
    - cd Fakestagram
    - npm install
    - npx expo start
9) Desues de ingresar los comando en la terminal beria aparecerle un codigo qr junto con una coleccion de comandos para iniciar la pagina
10) Si la quiere iniciar en web entonces debe escribir la letra "w" en la terminal, si la quiere iniciar en un dispositivo movil entonces descargue la aplicacion "Expo Go" y lea el codigo qr con la aplicación 
11) Si el programa funciona como debería, en el navegador se mostrará una página para iniciar sesión. En esta página, deberás elegir la opción para registrarte (la primera vez).

## Funcionalidades

### Componentes 

#### Footer
- El componente se utiliza para mostrar un conjunto de enlaces de navegación y opciones para el usuario, en este caso contiene enlaces para navegar a las secciones "Home", "Notificaciones", "Create", "Profile" y "logout". Este componente asegura que el usuario pueda navegar fácilmente a través de las distintas áreas de la aplicación sin importar el dispositivo que esté utilizando. 
#### Logout
- Es una función que permite a los usuarios cerrar sesión en la aplicación.
#### Post
- Muestra los detalles de una publicación, que incluyen la foto de perfil, el nombre del usuario, la descripción de la imagen publicada, los 'me gusta' y los comentarios de dicha imagen. Maneja diversas interacciones del usuario, como dar 'me gusta' a la publicación, escribir comentarios y mostrar opciones (compartir o reportar la publicación). Gestiona los estados de carga y error, y actualiza la interfaz de usuario según las interacciones del mismo. La imagen de la publicación se obtiene del backend.
#### Register
- Es un modal que permite a los usarios registrarse proporcionando su nombre de usuario, contraseña y correo electronico. Al enviar el formulario, los datos se envian al servidor(backend) para realizar el registro, y si tiene exito, el modal cierra y navega a la página principal. Si hay un error en el envio del formulario o la información del formulario en si, se muestra un mensaje de error.


### Paginas

#### Feed 
- Muestra una lista de publicaciones que existen en la red social en el feed del usuario.
#### Login
- Te permite iniciar sesion si anteriormente completaste el formulario del componente "Register" de lo contrario tendras que completar uno.
#### MyProfile
- Puedes ingresar a tu perfil, donde te mostrará el nombre de usuario y la foto de perfil, junto con sus publicaciones y los detalles de las mismas.
#### Profile 
- Puedes ingresar a perfiles diferentes al tuyo, donde te mostrará el nombre de usuario y la foto de perfil, junto con sus publicaciones y los detalles de las mismas.
#### Register
- Es la pagina en la que puedes ingresar las datos para completar el formulario del componente "Register".
