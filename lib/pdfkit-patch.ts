// ✅ PARCHE DEFINITIVO PARA VERCEL - AFM VÁLIDO
function patchPDFKit() {
  if (typeof window === 'undefined') {
    const fsModule = require('fs')
    const originalReadFileSync = fsModule.readFileSync
    
    // Datos AFM mínimos pero VÁLIDOS para Helvetica
    const helveticaAFM = `StartFontMetrics 4.1
FontName Helvetica
FullName Helvetica
FamilyName Helvetica
Weight Medium
ItalicAngle 0
IsFixedPitch false
CharacterSet ExtendedRoman
FontBBox -166 -225 1000 931
UnderlinePosition -100
UnderlineThickness 50
Version 002.000
Notice Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated. All Rights Reserved. Helvetica is a trademark of Linotype-Hell AG and/or its subsidiaries.
EncodingScheme AdobeStandardEncoding
CapHeight 718
XHeight 523
Ascender 718
Descender -207
StdHW 76
StdVW 88
StartCharMetrics 315
C 32 ; WX 278 ; N space ; B 0 0 0 0 ;
C 33 ; WX 278 ; N exclam ; B 90 0 187 718 ;
C 34 ; WX 355 ; N quotedbl ; B 70 463 285 718 ;
C 35 ; WX 556 ; N numbersign ; B 28 0 528 688 ;
C 36 ; WX 556 ; N dollar ; B 32 -115 520 775 ;
C 37 ; WX 889 ; N percent ; B 39 -19 850 703 ;
C 38 ; WX 667 ; N ampersand ; B 44 -15 623 718 ;
C 39 ; WX 222 ; N quoteright ; B 53 463 168 718 ;
C 40 ; WX 333 ; N parenleft ; B 82 -207 299 733 ;
C 41 ; WX 333 ; N parenright ; B 33 -207 250 733 ;
C 42 ; WX 389 ; N asterisk ; B 38 258 351 693 ;
C 43 ; WX 584 ; N plus ; B 40 0 544 505 ;
C 44 ; WX 278 ; N comma ; B 87 -147 191 106 ;
C 45 ; WX 333 ; N hyphen ; B 44 232 289 322 ;
C 46 ; WX 278 ; N period ; B 87 0 191 106 ;
C 47 ; WX 278 ; N slash ; B -19 -19 297 737 ;
C 48 ; WX 556 ; N zero ; B 33 -19 523 703 ;
C 49 ; WX 556 ; N one ; B 100 0 456 703 ;
C 50 ; WX 556 ; N two ; B 28 0 528 703 ;
C 51 ; WX 556 ; N three ; B 29 -19 522 703 ;
C 52 ; WX 556 ; N four ; B 26 0 530 703 ;
C 53 ; WX 556 ; N five ; B 31 -19 519 688 ;
C 54 ; WX 556 ; N six ; B 37 -19 526 703 ;
C 55 ; WX 556 ; N seven ; B 27 0 529 688 ;
C 56 ; WX 556 ; N eight ; B 33 -19 523 703 ;
C 57 ; WX 556 ; N nine ; B 33 -19 523 703 ;
C 58 ; WX 278 ; N colon ; B 87 0 191 516 ;
C 59 ; WX 278 ; N semicolon ; B 87 -147 191 516 ;
C 60 ; WX 584 ; N less ; B 40 11 544 494 ;
C 61 ; WX 584 ; N equal ; B 40 115 544 390 ;
C 62 ; WX 584 ; N greater ; B 40 11 544 494 ;
C 63 ; WX 556 ; N question ; B 66 0 490 727 ;
C 64 ; WX 1015 ; N at ; B 54 -19 961 703 ;
C 65 ; WX 667 ; N A ; B 0 0 667 718 ;
C 66 ; WX 667 ; N B ; B 48 0 633 718 ;
C 67 ; WX 722 ; N C ; B 44 -19 689 737 ;
C 68 ; WX 722 ; N D ; B 48 0 688 718 ;
C 69 ; WX 667 ; N E ; B 48 0 634 718 ;
C 70 ; WX 611 ; N F ; B 48 0 606 718 ;
C 71 ; WX 778 ; N G ; B 44 -19 744 737 ;
C 72 ; WX 722 ; N H ; B 48 0 674 718 ;
C 73 ; WX 278 ; N I ; B 90 0 188 718 ;
C 74 ; WX 556 ; N J ; B 17 -19 491 718 ;
C 75 ; WX 722 ; N K ; B 48 0 720 718 ;
C 76 ; WX 611 ; N L ; B 48 0 563 718 ;
C 77 ; WX 833 ; N M ; B 48 0 785 718 ;
C 78 ; WX 722 ; N N ; B 48 0 674 718 ;
C 79 ; WX 778 ; N O ; B 44 -19 734 737 ;
C 80 ; WX 667 ; N P ; B 48 0 633 718 ;
C 81 ; WX 778 ; N Q ; B 44 -19 734 737 ;
C 82 ; WX 722 ; N R ; B 48 0 688 718 ;
C 83 ; WX 667 ; N S ; B 36 -19 631 737 ;
C 84 ; WX 611 ; N T ; B 17 0 594 718 ;
C 85 ; WX 722 ; N U ; B 48 -19 674 718 ;
C 86 ; WX 667 ; N V ; B 14 0 653 718 ;
C 87 ; WX 944 ; N W ; B 14 0 930 718 ;
C 88 ; WX 667 ; N X ; B 0 0 667 718 ;
C 89 ; WX 667 ; N Y ; B 14 0 653 718 ;
C 90 ; WX 611 ; N Z ; B 26 0 585 718 ;
C 91 ; WX 278 ; N bracketleft ; B 82 -196 252 722 ;
C 92 ; WX 278 ; N backslash ; B -19 -19 297 737 ;
C 93 ; WX 278 ; N bracketright ; B 25 -196 195 722 ;
C 94 ; WX 469 ; N asciicircum ; B 50 257 419 688 ;
C 95 ; WX 556 ; N underscore ; B 0 -125 556 -75 ;
C 96 ; WX 222 ; N quoteleft ; B 53 463 168 718 ;
C 97 ; WX 556 ; N a ; B 32 -15 520 538 ;
C 98 ; WX 556 ; N b ; B 44 -15 520 718 ;
C 99 ; WX 500 ; N c ; B 38 -15 471 538 ;
C 100 ; WX 556 ; N d ; B 36 -15 536 718 ;
C 101 ; WX 556 ; N e ; B 38 -15 518 538 ;
C 102 ; WX 278 ; N f ; B 20 0 276 728 ;
C 103 ; WX 556 ; N g ; B 32 -218 520 538 ;
C 104 ; WX 556 ; N h ; B 44 0 520 718 ;
C 105 ; WX 222 ; N i ; B 70 0 152 718 ;
C 106 ; WX 222 ; N j ; B -16 -218 152 718 ;
C 107 ; WX 500 ; N k ; B 44 0 508 718 ;
C 108 ; WX 222 ; N l ; B 70 0 152 718 ;
C 109 ; WX 833 ; N m ; B 44 0 789 538 ;
C 110 ; WX 556 ; N n ; B 44 0 520 538 ;
C 111 ; WX 556 ; N o ; B 38 -15 518 538 ;
C 112 ; WX 556 ; N p ; B 44 -207 520 538 ;
C 113 ; WX 556 ; N q ; B 36 -207 536 538 ;
C 114 ; WX 333 ; N r ; B 44 0 335 538 ;
C 115 ; WX 500 ; N s ; B 32 -15 467 538 ;
C 116 ; WX 278 ; N t ; B 20 -15 258 669 ;
C 117 ; WX 556 ; N u ; B 44 -15 520 523 ;
C 118 ; WX 500 ; N v ; B 10 0 490 523 ;
C 119 ; WX 722 ; N w ; B 10 0 712 523 ;
C 120 ; WX 500 ; N x ; B 0 0 500 523 ;
C 121 ; WX 500 ; N y ; B 10 -214 490 523 ;
C 122 ; WX 500 ; N z ; B 22 0 478 523 ;
C 123 ; WX 334 ; N braceleft ; B 48 -196 286 722 ;
C 124 ; WX 260 ; N bar ; B 112 -196 148 722 ;
C 125 ; WX 334 ; N braceright ; B 48 -196 286 722 ;
C 126 ; WX 584 ; N asciitilde ; B 50 163 534 342 ;
EndCharMetrics
EndFontMetrics
`
    
    fsModule.readFileSync = function(filePath: string, options?: any) {
      if (typeof filePath === 'string' && filePath.includes('.afm')) {
        console.log('⚠️ Interceptada búsqueda de AFM, devolviendo datos válidos')
        return Buffer.from(helveticaAFM)
      }
      return originalReadFileSync.call(fsModule, filePath, options)
    }
  }
}