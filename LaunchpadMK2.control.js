// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (1);
load ("Config.js");
load ("framework/ClassLoader.js");
load ("launchpad/ClassLoader.js");
load ("view/ClassLoader.js");
load ("Controller.js");

SYSEX_HEADER = "F0 00 20 29 02 18 ";
LAUNCHPAD_PRG_MODE   = "22 00";
LAUNCHPAD_FADER_MODE = "22 04";
LAUNCHPAD_PAN_MODE   = "22 05";

LAUNCHPAD_BUTTON_UP        = 104;
LAUNCHPAD_BUTTON_DOWN      = 105;
LAUNCHPAD_BUTTON_LEFT      = 106;
LAUNCHPAD_BUTTON_RIGHT     = 107;
LAUNCHPAD_BUTTON_SESSION   = 108;
LAUNCHPAD_BUTTON_NOTE      = 109;
LAUNCHPAD_BUTTON_DEVICE    = 110;
LAUNCHPAD_BUTTON_USER      = 111;

LAUNCHPAD_BUTTONS_ALL =
[
    LAUNCHPAD_BUTTON_LEFT,
    LAUNCHPAD_BUTTON_RIGHT,
    LAUNCHPAD_BUTTON_UP,
    LAUNCHPAD_BUTTON_DOWN,
    LAUNCHPAD_BUTTON_SESSION,
    LAUNCHPAD_BUTTON_NOTE, 
    LAUNCHPAD_BUTTON_DEVICE,
    LAUNCHPAD_BUTTON_USER,
    LAUNCHPAD_BUTTON_SHIFT,
    LAUNCHPAD_BUTTON_CLICK,
    LAUNCHPAD_BUTTON_UNDO,
    LAUNCHPAD_BUTTON_DELETE,
    LAUNCHPAD_BUTTON_QUANTIZE,
    LAUNCHPAD_BUTTON_DUPLICATE,
    LAUNCHPAD_BUTTON_DOUBLE,
    LAUNCHPAD_BUTTON_RECORD,
    LAUNCHPAD_BUTTON_REC_ARM,
    LAUNCHPAD_BUTTON_TRACK,
    LAUNCHPAD_BUTTON_MUTE,
    LAUNCHPAD_BUTTON_SOLO,
    LAUNCHPAD_BUTTON_VOLUME,
    LAUNCHPAD_BUTTON_PAN,
    LAUNCHPAD_BUTTON_SENDS,
    LAUNCHPAD_BUTTON_STOP_CLIP
];


// This is the only global variable, do not use it.
var controller = null;

host.defineController ("Novation", "LaunchpadMK24Bitwig", "1.10", "4E01A0B0-67B1-11E5-A837-0800200C9A66", "Jürgen Moßgraber");
host.defineMidiPorts (1, 1);

host.platformIsWindows () && host.addDeviceNameBasedDiscoveryPair (["Launchpad MK2"], ["Launchpad MK2"]);
host.platformIsLinux () && host.addDeviceNameBasedDiscoveryPair (["Launchpad MK2"], ["Launchpad MK2"]);
host.platformIsMac () && host.addDeviceNameBasedDiscoveryPair (["Launchpad MK2"], ["Launchpad MK2"]);

function init ()
{
    controller = new Controller ();
    controller.surface.isPro = false;
    controller.surface.shiftButtonId  = LAUNCHPAD_BUTTON_USER;

    println ("Initialized.");
}

function exit ()
{
    controller.shutdown ();
}

function flush ()
{
    controller.flush ();
}
