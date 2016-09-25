// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SequencerView (model)
{
    AbstractNoteSequencerView.call (this, model);
    this.cursorColor = LAUNCHPAD_COLOR_BLUE;
    this.modeColor = LAUNCHPAD_COLOR_BLUE;
}
SequencerView.prototype = new AbstractNoteSequencerView ();
