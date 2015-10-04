// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SessionView (model)
{
    AbstractSessionView.call (this, model, 8, 8);
    
    this.cursorColor = LAUNCHPAD_COLOR_LIME;
}
SessionView.prototype = new AbstractSessionView ();

SessionView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToPrgMode ();

    AbstractSessionView.prototype.onActivate.call (this);
    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_LIME);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_GREY_LO);

    this.updateIndication ();
};

SessionView.prototype.drawSceneButtons = function ()
{
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, LAUNCHPAD_COLOR_GREEN);
};

SessionView.prototype.onSession = function (event)
{
    if (event.isLong ())
        this.isTemporary = true;
    else if (event.isUp ())
    {
        if (this.isTemporary)
        {
            this.isTemporary = false;
            var tb = this.model.getTrackBank ();
            var viewId = tb.getPreferredView (tb.getSelectedTrack ().index);
            if (viewId != null)
                this.surface.setActiveView (viewId);
        }
    }
};

SessionView.prototype.onScene = function (scene, event)
{
    if (event.isDown ())
        this.model.getCurrentTrackBank ().launchScene (scene);
};

SessionView.prototype.onGridNote = function (note, velocity)
{
    if (this.surface.getControlMode () == CONTROL_MODE_OFF)
    {
        AbstractSessionView.prototype.onGridNote.call (this, note, velocity);
        return;
    }
    
    // Block 1st row
    if (note >= 44)
    {
        // Translate the 7 other rows down
        AbstractSessionView.prototype.onGridNote.call (this, note - 8, velocity);
        return;
    }
    
    if (velocity == 0)
        return;

    this.firstRowUsed = true;
    
    var index = note - 36;
    var tb = this.model.getCurrentTrackBank ();
    switch (this.surface.getControlMode ())
    {
        case CONTROL_MODE_REC_ARM:
            tb.toggleArm (index);
            break;
            
        case CONTROL_MODE_TRACK_SELECT:
            tb.select (index);
            break;
            
        case CONTROL_MODE_MUTE:
            tb.toggleMute (index);
            break;
            
        case CONTROL_MODE_SOLO:
            tb.toggleSolo (index);
            break;
            
        case CONTROL_MODE_STOP_CLIP:
            tb.stop (index);
            break;
    }
};

SessionView.prototype.drawGrid = function ()
{
    var controlMode = this.surface.getControlMode ();
    var isOff = controlMode == CONTROL_MODE_OFF;
    this.rows = isOff ? 8 : 7;
    
    AbstractSessionView.prototype.drawGrid.call (this);
    
    if (isOff)
        return;

    var tb = this.model.getCurrentTrackBank ();
    
    switch (controlMode)
    {
        case CONTROL_MODE_REC_ARM:
            for (var x = 0; x < this.columns; x++)
            {
                var track = tb.getTrack (x);
                this.surface.pads.lightEx (x, 7, track.exists ? (track.recarm ? LAUNCHPAD_COLOR_RED_HI : LAUNCHPAD_COLOR_RED_LO) : LAUNCHPAD_COLOR_BLACK, false, false);
            }
            break;

        case CONTROL_MODE_TRACK_SELECT:
            for (var x = 0; x < this.columns; x++)
            {
                var track = tb.getTrack (x);
                this.surface.pads.lightEx (x, 7, track.exists ? (track.selected ? LAUNCHPAD_COLOR_GREEN_HI : LAUNCHPAD_COLOR_GREEN_LO) : LAUNCHPAD_COLOR_BLACK, false, false);
            }
            break;

        case CONTROL_MODE_MUTE:
            for (var x = 0; x < this.columns; x++)
            {
                var track = tb.getTrack (x);
                this.surface.pads.lightEx (x, 7, track.exists ? (track.mute ? LAUNCHPAD_COLOR_YELLOW_HI : LAUNCHPAD_COLOR_YELLOW_LO) : LAUNCHPAD_COLOR_BLACK, false, false);
            }
            break;

        case CONTROL_MODE_SOLO:
            for (var x = 0; x < this.columns; x++)
            {
                var track = tb.getTrack (x);
                this.surface.pads.lightEx (x, 7, track.exists ? (track.solo ? LAUNCHPAD_COLOR_BLUE_HI : LAUNCHPAD_COLOR_BLUE_LO) : LAUNCHPAD_COLOR_BLACK, false, false);
            }
            break;
            
        case CONTROL_MODE_STOP_CLIP:
            for (var x = 0; x < this.columns; x++)
            {
                var track = tb.getTrack (x);
                this.surface.pads.lightEx (x, 7, track.exists ? LAUNCHPAD_COLOR_ROSE : LAUNCHPAD_COLOR_BLACK, false, false);
            }
            break;
    }
};
