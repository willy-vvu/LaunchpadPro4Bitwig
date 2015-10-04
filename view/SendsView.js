// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SendsView (model)
{
    if (model == null)
        return;
    
    this.selectedSend = 0;
    
    AbstractFaderView.call (this, model);
}
SendsView.prototype = new AbstractFaderView ();

SendsView.prototype.onScene = function (scene, event)
{
    if (event.isDown ())
        this.selectedSend = scene;
    this.drawSceneButtons ();
    this.updateIndication ();
};

SendsView.prototype.onFader = function (index, value)
{
    this.model.getCurrentTrackBank ().setSend (index, this.selectedSend, value);
};

SendsView.prototype.drawGrid = function () 
{
    for (var i = 0; i < 8; i++)
    {
        var track = this.model.getCurrentTrackBank ().getTrack (i);
        var send = track.sends[this.selectedSend];
        
        if (this.trackColors[i] != track.color || !track.exists || send.name.length == 0)
            this.setupFader (i);
        
        this.trackColors[i] = track.color;
        
        this.surface.output.sendCC (LAUNCHPAD_FADER_1 + i, send.volume ? send.volume : 0);
    }
};

SendsView.prototype.drawSceneButtons = function ()
{
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, this.selectedSend == 0 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, this.selectedSend == 1 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, this.selectedSend == 2 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, this.selectedSend == 3 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, this.selectedSend == 4 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, this.selectedSend == 5 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, this.selectedSend == 6 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, this.selectedSend == 7 ? LAUNCHPAD_COLOR_ORCHID : LAUNCHPAD_COLOR_BLACK);
};