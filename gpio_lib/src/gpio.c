#include "gpio.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>

#define SYSFS_GPIO_DIR "/sys/class/gpio"
#define GPIO_BASE 512

static int writeToFile(const char *path, const char *value) {
    int fd = open(path, O_WRONLY);
    if (fd < 0) return -1;
    write(fd, value, strlen(value));
    close(fd);
    return 0;
}

int pinMode(int pin, PinMode mode) {
    pin=pin+GPIO_BASE;
    char path[64];
    char buffer[8];

    // Exportar el pin
    snprintf(path, sizeof(path), SYSFS_GPIO_DIR "/export");
    snprintf(buffer, sizeof(buffer), "%d", pin);
    writeToFile(path, buffer);
    usleep(100000);  // pequeña espera

    // Establecer dirección
    snprintf(path, sizeof(path), SYSFS_GPIO_DIR "/gpio%d/direction", pin);
    return writeToFile(path, mode == OUTPUT ? "out" : "in");
}

int digitalWrite(int pin, int value) {
    pin=pin+GPIO_BASE;
    char path[64];
    snprintf(path, sizeof(path), SYSFS_GPIO_DIR "/gpio%d/value", pin);
    return writeToFile(path, value ? "1" : "0");
}

int digitalRead(int pin) {
    pin=pin+GPIO_BASE;
    char path[64], value_str[4];
    snprintf(path, sizeof(path), SYSFS_GPIO_DIR "/gpio%d/value", pin);
    int fd = open(path, O_RDONLY);
    if (fd < 0) return -1;
    read(fd, value_str, sizeof(value_str));
    close(fd);
    return atoi(value_str);
}

int blink(int pin, int freq, int duration) {
    int delay = 1000000 / (freq * 2);
    for (int i = 0; i < freq * duration; i++) {
        digitalWrite(pin, 1);
        usleep(delay);
        digitalWrite(pin, 0);
        usleep(delay);
    }
    return 0;
}
