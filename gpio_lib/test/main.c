#include "../include/gpio.h"
#include <stdio.h>

int main() {
    int output1 = 17; // luz
    int output2 = 27; // puerta
    int input = 22;   // sensor

    pinMode(output1, OUTPUT);
    pinMode(output2, OUTPUT);
    pinMode(input, INPUT);

    digitalWrite(output1, 1); // encender luz
    blink(output2, 5, 5);     // parpadear puerta
    int value = digitalRead(input);
    printf("Sensor en GPIO %d lee: %d\n", input, value);

    return 0;
}
