#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include "ioutil.h"

int getFile(char **buffer, FILE *f, bool close)
{
    long length = 0; // this really doesn't need to be too big for our ref purposes here, likely could get by with an int

    if (f)
    {
        fseek(f, 0, SEEK_END);
        length = ftell(f);
        fseek(f, 0, SEEK_SET);
        *buffer = malloc(length + 1);
        if (*buffer)
        {
            fread(*buffer, 1, length, f);
        }
        if (close)
        {
            fclose(f);
        }
    } else {
        return -1;
    }
    if (*buffer)
    {
        buffer[length] = '\0';
        return length+1;
    } else {
        return -2;
    }
}
