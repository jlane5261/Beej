#include <stdio.h>

int main() {
  #if defined __STDC_VERSION__ 
    long version = __STDC_VERSION__;
    printf("version is %d", version);
    if ( version == 199901 ) {
      printf ("version detected : C99\n");
    }
    if ( version == 201112 ) {
      printf ("version detected : C11\n");
    }
    if ( version == 201710 ) {
      printf ("version detected : C18\n");
    }
  #else 
    printf ("version detected : C90\n");
  #endif
}