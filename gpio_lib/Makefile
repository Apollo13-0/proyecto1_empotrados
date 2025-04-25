CC ?= $(CROSS_COMPILE)gcc
CFLAGS = -Wall -Iinclude

SRC = src/gpio.c
TEST = test/main.c

all: lib/libgpio.so bin/test_gpio

lib/libgpio.so: $(SRC)
	$(CC) $(CFLAGS) -fPIC -shared -o $@ $^

bin/test_gpio: $(TEST) lib/libgpio.so
	$(CC) $(CFLAGS) -o $@ $< -Llib -lgpio

clean:
	rm -f lib/*.so bin/*
