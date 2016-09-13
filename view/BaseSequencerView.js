// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function BaseSequencerView (model, rows, cols)
{
    if (!model) // Called on first prototype creation
        return;
    AbstractSequencerView.call (this, model, rows, cols);
    this.modeColor = LAUNCHPAD_COLOR_YELLOW;
}
BaseSequencerView.prototype = new AbstractSequencerView ();

BaseSequencerView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToPrgMode ();

    AbstractSequencerView.prototype.onActivate.call (this);

    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, this.modeColor);
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_GREY_LO);

    this.model.getCurrentTrackBank ().setIndication (false);
    this.updateIndication ();
};

BaseSequencerView.prototype.onScene = function (index, event)
{
    if (!event.isDown () || !this.model.canSelectedTrackHoldNotes ())
        return;
    AbstractSequencerView.prototype.onScene.call (this, index, event)
    displayNotification (this.resolutionsStr[this.selectedIndex]);
};

BaseSequencerView.prototype.updateSceneButtons = function ()
{
    if (this.model.canSelectedTrackHoldNotes ())
    {
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, this.selectedIndex == 7 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, this.selectedIndex == 6 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, this.selectedIndex == 5 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, this.selectedIndex == 4 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, this.selectedIndex == 3 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, this.selectedIndex == 2 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, this.selectedIndex == 1 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, this.selectedIndex == 0 ? LAUNCHPAD_COLOR_YELLOW : LAUNCHPAD_COLOR_GREEN);
    }
    else
    {
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, LAUNCHPAD_COLOR_BLACK);
    }
};
