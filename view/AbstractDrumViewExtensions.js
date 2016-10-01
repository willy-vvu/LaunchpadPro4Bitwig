// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractDrumView.prototype.onScene = function (index, event)
{
    if (!event.isDown () || !this.model.canSelectedTrackHoldNotes ())
        return;
    
    if (this.surface.isShiftPressed ())
    {
        switch (index)
        {
            case 0:
                this.model.getCurrentTrackBank ().setPreferredView (VIEW_DRUM);
                this.surface.setActiveView (VIEW_DRUM);
                displayNotification ("Drum 1");
                break;
            case 1:
                this.model.getCurrentTrackBank ().setPreferredView (VIEW_DRUM4);
                this.surface.setActiveView (VIEW_DRUM4);
                displayNotification ("Drum 4");
                break;
            case 2:
                this.model.getCurrentTrackBank ().setPreferredView (VIEW_DRUM8);
                this.surface.setActiveView (VIEW_DRUM8);
                displayNotification ("Drum 8");
                break;
            default:
                this.onLowerScene (index);
                break;
        }
        return;
    }
    
    AbstractSequencerView.prototype.onScene.call (this, index, event);
};

AbstractDrumView.prototype.updateSceneButtons = function ()
{
    if (!this.model.canSelectedTrackHoldNotes ())
        return;

    if (this.surface.isShiftPressed ())
    {
        this.updateLowerSceneButtons ();
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, this.surface.isActiveView (VIEW_DRUM) ? LAUNCHPAD_COLOR_RED : LAUNCHPAD_COLOR_AMBER);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, this.surface.isActiveView (VIEW_DRUM4) ? LAUNCHPAD_COLOR_RED : LAUNCHPAD_COLOR_AMBER);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, this.surface.isActiveView (VIEW_DRUM8) ? LAUNCHPAD_COLOR_RED : LAUNCHPAD_COLOR_AMBER);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, LAUNCHPAD_COLOR_BLACK);
        return;
    }
    
    AbstractSequencerView.prototype.updateSceneButtons.call (this);
};

AbstractDrumView.prototype.updateLowerSceneButtons = function ()
{
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, LAUNCHPAD_COLOR_BLACK);
};

AbstractDrumView.prototype.onLowerScene = function (index)
{
    // Intentionally empty, for extension in sub-classes
};
