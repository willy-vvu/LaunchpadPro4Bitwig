// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function AbstractSequencerView (model, rows, cols)
{
    if (!model) // Called on first prototype creation
        return;

    AbstractView.call (this, model);

    this.resolutions = [ 1, 2/3, 1/2, 1/3, 1/4, 1/6, 1/8, 1/12 ];
    this.resolutionsStr = [ "1/4", "1/4t", "1/8", "1/8t", "1/16", "1/16t", "1/32", "1/32t" ];
    this.selectedIndex = 4;
    this.scales = this.model.getScales ();
    
    this.modeColor = LAUNCHPAD_COLOR_YELLOW;

    this.offsetX = 0;
    this.offsetY = 0;

    this.clip = this.model.createCursorClip (cols, rows);
    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
}
AbstractSequencerView.prototype = new AbstractView ();

AbstractSequencerView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToPrgMode ();

    AbstractView.prototype.onActivate.call (this);

    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, this.modeColor);
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_GREY_LO);

    this.model.getCurrentTrackBank ().setIndication (false);
    this.drawSceneButtons ();
    this.updateIndication ();
};

AbstractSequencerView.prototype.scrollLeft = function (event)
{
    var newOffset = this.offsetX - this.clip.getStepSize ();
    if (newOffset < 0)
        this.offsetX = 0;
    else
    {
        this.offsetX = newOffset;
        this.clip.scrollStepsPageBackwards ();
    }
};

AbstractSequencerView.prototype.scrollRight = function (event)
{
    this.offsetX = this.offsetX + this.clip.getStepSize ();
    this.clip.scrollStepsPageForward ();
};

AbstractSequencerView.prototype.onScene = function (index, event)
{
    if (!event.isDown ())
        return;
    if (!this.canSelectedTrackHoldNotes ())
        return;
    this.selectedIndex = 7 - index;
    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
    this.drawSceneButtons ();
    displayNotification (this.resolutionsStr[this.selectedIndex]);
};

AbstractSequencerView.prototype.drawSceneButtons = function ()
{
    if (this.canSelectedTrackHoldNotes ())
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

AbstractSequencerView.prototype.isInXRange = function (x)
{
    return x >= this.offsetX && x < this.offsetX + this.clip.getStepSize ();
};
