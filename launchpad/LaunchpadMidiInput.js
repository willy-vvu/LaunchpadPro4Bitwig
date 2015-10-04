// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function LaunchpadMidiInput ()
{
    MidiInput.call (this);
}

LaunchpadMidiInput.prototype = new MidiInput();

LaunchpadMidiInput.prototype.createNoteInput = function ()
{
    var noteInput = this.port.createNoteInput ("Novation Launchpad Pro", 
                                               "80????",  // Note off
                                               "90????"); // Note on
    noteInput.setShouldConsumeEvents (false);
    return noteInput;
};
