// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (1);
load ("Config.js");
load ("framework/ClassLoader.js");
load ("launchpad/ClassLoader.js");
load ("view/ClassLoader.js");
load ("Controller.js");

// This is the only global variable, do not use it.
var controller = null;

host.defineController ("Novation", "LaunchpadPro4Bitwig", "1.10", "80B63970-64F1-11E5-A837-0800200C9A66", "Jürgen Moßgraber");
host.defineMidiPorts (1, 1);

host.platformIsWindows () && host.addDeviceNameBasedDiscoveryPair (["MIDIIN2 (Launchpad Pro)"], ["MIDIOUT2 (Launchpad Pro)"]);
host.platformIsLinux () && host.addDeviceNameBasedDiscoveryPair (["Launchpad Pro MIDI 2"], ["Launchpad Pro MIDI 2"]);
host.platformIsMac () && host.addDeviceNameBasedDiscoveryPair (["Launchpad Pro Standalone Port"], ["Launchpad Pro Standalone Port"]);

function init ()
{
    controller = new Controller ();
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
