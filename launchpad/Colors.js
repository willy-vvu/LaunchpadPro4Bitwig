// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Launchpad Pro Colors

var LAUNCHPAD_COLOR_BLACK               = 0;
var LAUNCHPAD_COLOR_GREY_LO             = 1;
var LAUNCHPAD_COLOR_GREY_MD             = 2;
var LAUNCHPAD_COLOR_WHITE               = 3;
var LAUNCHPAD_COLOR_ROSE                = 4;
var LAUNCHPAD_COLOR_RED_HI              = 5;
var LAUNCHPAD_COLOR_RED                 = 6;
var LAUNCHPAD_COLOR_RED_LO              = 7;
var LAUNCHPAD_COLOR_RED_AMBER           = 8;
var LAUNCHPAD_COLOR_AMBER_HI            = 9;
var LAUNCHPAD_COLOR_AMBER               = 10;
var LAUNCHPAD_COLOR_AMBER_LO            = 11;
var LAUNCHPAD_COLOR_AMBER_YELLOW        = 12;
var LAUNCHPAD_COLOR_YELLOW_HI           = 13;
var LAUNCHPAD_COLOR_YELLOW              = 14;
var LAUNCHPAD_COLOR_YELLOW_LO           = 15;
var LAUNCHPAD_COLOR_YELLOW_LIME         = 16;
var LAUNCHPAD_COLOR_LIME_HI             = 17;
var LAUNCHPAD_COLOR_LIME                = 18;
var LAUNCHPAD_COLOR_LIME_LO             = 19;
var LAUNCHPAD_COLOR_LIME_GREEN          = 20;
var LAUNCHPAD_COLOR_GREEN_HI            = 21;
var LAUNCHPAD_COLOR_GREEN               = 22;
var LAUNCHPAD_COLOR_GREEN_LO            = 23;
var LAUNCHPAD_COLOR_GREEN_SPRING        = 24;
var LAUNCHPAD_COLOR_SPRING_HI           = 25;
var LAUNCHPAD_COLOR_SPRING              = 26;
var LAUNCHPAD_COLOR_SPRING_LO           = 27;
var LAUNCHPAD_COLOR_SPRING_TURQUOISE    = 28;
var LAUNCHPAD_COLOR_TURQUOISE_LO        = 29;
var LAUNCHPAD_COLOR_TURQUOISE           = 30;
var LAUNCHPAD_COLOR_TURQUOISE_HI        = 31;
var LAUNCHPAD_COLOR_TURQUOISE_CYAN      = 32;
var LAUNCHPAD_COLOR_CYAN_HI             = 33;
var LAUNCHPAD_COLOR_CYAN                = 34;
var LAUNCHPAD_COLOR_CYAN_LO             = 35;
var LAUNCHPAD_COLOR_CYAN_SKY            = 36;
var LAUNCHPAD_COLOR_SKY_HI              = 37;
var LAUNCHPAD_COLOR_SKY                 = 38;
var LAUNCHPAD_COLOR_SKY_LO              = 39;
var LAUNCHPAD_COLOR_SKY_OCEAN           = 40;
var LAUNCHPAD_COLOR_OCEAN_HI            = 41;
var LAUNCHPAD_COLOR_OCEAN               = 42;
var LAUNCHPAD_COLOR_OCEAN_LO            = 43;
var LAUNCHPAD_COLOR_OCEAN_BLUE          = 44;
var LAUNCHPAD_COLOR_BLUE_HI             = 45;
var LAUNCHPAD_COLOR_BLUE                = 46;
var LAUNCHPAD_COLOR_BLUE_LO             = 47;
var LAUNCHPAD_COLOR_BLUE_ORCHID         = 48;
var LAUNCHPAD_COLOR_ORCHID_HI           = 49;
var LAUNCHPAD_COLOR_ORCHID              = 50;
var LAUNCHPAD_COLOR_ORCHID_LO           = 51;
var LAUNCHPAD_COLOR_ORCHID_MAGENTA      = 52;
var LAUNCHPAD_COLOR_MAGENTA_HI          = 53;
var LAUNCHPAD_COLOR_MAGENTA             = 54;
var LAUNCHPAD_COLOR_MAGENTA_LO          = 55;
var LAUNCHPAD_COLOR_MAGENTA_PINK        = 56;
var LAUNCHPAD_COLOR_PINK_HI             = 57;
var LAUNCHPAD_COLOR_PINK                = 58;
var LAUNCHPAD_COLOR_PINK_LO             = 59;

Scales.SCALE_COLOR_OFF          = LAUNCHPAD_COLOR_BLACK;
Scales.SCALE_COLOR_OCTAVE       = LAUNCHPAD_COLOR_OCEAN_HI;
Scales.SCALE_COLOR_NOTE         = LAUNCHPAD_COLOR_WHITE;
Scales.SCALE_COLOR_OUT_OF_SCALE = LAUNCHPAD_COLOR_BLACK;

AbstractSessionView.CLIP_COLOR_IS_RECORDING        = { color: LAUNCHPAD_COLOR_RED_HI, blink: LAUNCHPAD_COLOR_RED_HI, fast: false };
AbstractSessionView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: LAUNCHPAD_COLOR_RED_HI, blink: LAUNCHPAD_COLOR_BLACK,  fast: true  };
AbstractSessionView.CLIP_COLOR_IS_PLAYING          = { color: LAUNCHPAD_COLOR_GREEN,  blink: LAUNCHPAD_COLOR_GREEN,  fast: false };
AbstractSessionView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: LAUNCHPAD_COLOR_GREEN,  blink: LAUNCHPAD_COLOR_BLACK,  fast: true  };
AbstractSessionView.CLIP_COLOR_HAS_CONTENT         = { color: LAUNCHPAD_COLOR_AMBER,  blink: null,               fast: false };
AbstractSessionView.CLIP_COLOR_NO_CONTENT          = { color: LAUNCHPAD_COLOR_BLACK,  blink: null,               fast: false };
AbstractSessionView.CLIP_COLOR_RECORDING_ARMED     = { color: LAUNCHPAD_COLOR_RED_LO, blink: null,               fast: false };
AbstractSessionView.USE_CLIP_COLOR                 = true;

BITWIG_INDICATOR_COLORS = [
    LAUNCHPAD_COLOR_RED, 
    LAUNCHPAD_COLOR_AMBER, 
    LAUNCHPAD_COLOR_YELLOW, 
    LAUNCHPAD_COLOR_SPRING, 
    LAUNCHPAD_COLOR_CYAN, 
    LAUNCHPAD_COLOR_OCEAN, 
    LAUNCHPAD_COLOR_MAGENTA, 
    LAUNCHPAD_COLOR_PINK
];
