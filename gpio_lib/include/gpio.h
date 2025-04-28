#ifndef GPIO_H
#define GPIO_H

typedef enum { INPUT, OUTPUT } PinMode;

int pinMode(int pin, PinMode mode);
int digitalWrite(int pin, int value);
int digitalRead(int pin);
int blink(int pin, int freq, int duration);

#endif
