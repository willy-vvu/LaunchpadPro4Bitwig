// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function AbstractFaderView (model)
{
    if (model == null)
        return;
    
    AbstractView.call (this, model);
    
    this.cursorColor = LAUNCHPAD_COLOR_LIME;
    
    this.trackColors = initArray (0, 8);
}
AbstractFaderView.prototype = new SessionView ();

AbstractFaderView.prototype.updateNoteMapping = function () {};
AbstractFaderView.prototype.onGridNote = function (note, velocity) {};
AbstractFaderView.prototype.onScene = function (scene, event)
{
    this.drawSceneButtons ();
};

AbstractFaderView.prototype.onActivate = function ()
{
    this.switchLaunchpadMode ();

    AbstractSessionView.prototype.onActivate.call (this);

    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_LIME);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_GREY_LO);
    
    this.updateIndication ();
    
    for (var i = 0; i < 8; i++)
        this.setupFader (i);
};

AbstractFaderView.prototype.switchLaunchpadMode = function ()
{
    this.surface.setLaunchpadToFaderMode ();
};

AbstractFaderView.prototype.setupFader = function (index)
{
    var track = this.model.getCurrentTrackBank ().getTrack (index);
    this.surface.setupFader (index, track.color == null ? 0 : track.color);
};

AbstractFaderView.prototype.drawSceneButtons = function (buttonID)
{
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, LAUNCHPAD_COLOR_BLACK);
};
