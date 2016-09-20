// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DrumView (model)
{
    AbstractDrumView.call (this, model, 4, 4);
    this.cursorColor = LAUNCHPAD_COLOR_YELLOW;
}
DrumView.prototype = new AbstractDrumView ();
    
DrumView.prototype.updateArrowStates = function ()
{
    var octave = this.scales.getDrumOctave ();
    this.canScrollUp = octave < 5;
    this.canScrollDown = octave > -3;
    this.canScrollLeft = this.offsetX > 0;
    this.canScrollRight = true; // TODO API extension required - We do not know the number of steps
};

DrumView.prototype.scrollUp = function (event)
{
    this.onOctaveUp (event);
};

DrumView.prototype.scrollDown = function (event)
{
    this.onOctaveDown (event);
};
