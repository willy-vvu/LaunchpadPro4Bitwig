// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function RaindropsView (model)
{
    AbstractRaindropsView.call (this, model);
    this.cursorColor = LAUNCHPAD_COLOR_GREEN;
    this.modeColor = LAUNCHPAD_COLOR_GREEN;
}
RaindropsView.prototype = new AbstractRaindropsView ();
