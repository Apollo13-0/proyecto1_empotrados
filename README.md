# proyecto1_empotrados

## Integrantes

Sergio Rios 2019007977
Kevin Guzman Navarro 2017238886
Jose Ignacio Calderon Diaz 2019031750

## Investigacion

- ¿Que pasos debe seguir antes de escribir o leer de un puerto de entrada/salida general (GPIO)?

Para configurar un GPIO en Linux, se deben seguir varios pasos. Primero, se debe exportar el número del GPIO que se desea usar, lo cual normalmente se hace escribiendo el número correspondiente en el archivo /sys/class/gpio/export. Con el fin de habilitar al GPIO en el espacio de usuario. Luego, se debe configurar la dirección del GPIO (entrada o salida) escribiendo en el archivo /sys/class/gpio/gpioX/direction, donde X es el número del GPIO. Después de eso, se puede leer o escribir en el GPIO utilizando los archivos /sys/class/gpio/gpioX/value.

- ¿Que comando podria utilizar, bajo Linux, para escribir a un GPIO especifico?

En Linux, se puede utilizar el comando `echo` para escribir en un GPIO específico. Por ejemplo, para escribir un valor de 1 (alto) en el GPIO 2, se puede usar el siguiente comando:

```bash
echo 1 > /sys/class/gpio/gpio2/value
``` 

