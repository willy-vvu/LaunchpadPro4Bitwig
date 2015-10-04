// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PanView (model)
{
    if (model == null)
        return;
    
    AbstractFaderView.call (this, model);
}
PanView.prototype = new AbstractFaderView ();

PanView.prototype.switchLaunchpadMode = function ()
{
    this.surface.setLaunchpadToPanMode ();
};

PanView.prototype.onFader = function (index, value)
{
    this.model.getCurrentTrackBank ().setPan (index, value);
};

PanView.prototype.drawGrid = function () 
{
    for (var i = 0; i < 8; i++)
    {
        var track = this.model.getCurrentTrackBank ().getTrack (i);
        
        if (this.trackColors[i] != track.color || !track.exists)
            this.setupFader (i);
        
        this.trackColors[i] = track.color;
        
        this.surface.output.sendCC (LAUNCHPAD_FADER_1 + i, track.pan);
    }
};

PanView.prototype.setupFader = function (index)
{
    var track = this.model.getCurrentTrackBank ().getTrack (index);
    this.surface.setupPanFader (index, track.color == null ? 0 : track.color);
};
