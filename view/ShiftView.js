// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ShiftView (model)
{
    if (model == null)
        return;
    
    AbstractView.call (this, model);
}
ShiftView.prototype = new AbstractView ();

ShiftView.prototype.updateArrowStates = function ()
{
    this.canScrollUp = false;
    this.canScrollDown = false;
    this.canScrollLeft = false;
    this.canScrollRight = false;
};

ShiftView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToPrgMode ();

    AbstractView.prototype.onActivate.call (this);

    this.model.getCurrentTrackBank ().setIndication (false);
    this.updateSceneButtons ();
    this.updateIndication ();
};

ShiftView.prototype.updateSceneButtons = function (buttonID)
{
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, LAUNCHPAD_COLOR_CYAN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, LAUNCHPAD_COLOR_SKY);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, LAUNCHPAD_COLOR_ORCHID);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, LAUNCHPAD_COLOR_ROSE);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, LAUNCHPAD_COLOR_YELLOW);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, LAUNCHPAD_COLOR_BLUE);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, LAUNCHPAD_COLOR_RED);
};

ShiftView.prototype.drawGrid = function ()
{
    for (var i = 46; i < 100; i++)
        this.surface.pads.light (i, LAUNCHPAD_COLOR_BLACK, null, false);

    this.surface.pads.light (92, LAUNCHPAD_COLOR_GREEN, null, false);
    this.surface.pads.light (93, LAUNCHPAD_COLOR_GREEN_SPRING, null, false);
    this.surface.pads.light (84, LAUNCHPAD_COLOR_GREEN, null, false);
    this.surface.pads.light (85, LAUNCHPAD_COLOR_GREEN_SPRING, null, false);
    this.surface.pads.light (76, LAUNCHPAD_COLOR_GREEN, null, false);
    this.surface.pads.light (77, LAUNCHPAD_COLOR_BLACK, null, false);
    this.surface.pads.light (68, LAUNCHPAD_COLOR_GREEN, null, false);
    this.surface.pads.light (69, LAUNCHPAD_COLOR_BLACK, null, false);
    this.surface.pads.light (60, LAUNCHPAD_COLOR_GREEN, null, false);
    this.surface.pads.light (61, LAUNCHPAD_COLOR_GREEN_SPRING, null, false);
    this.surface.pads.light (52, LAUNCHPAD_COLOR_GREEN, null, false);
    this.surface.pads.light (53, LAUNCHPAD_COLOR_GREEN_SPRING, null, false);
    this.surface.pads.light (44, LAUNCHPAD_COLOR_RED, null, false);
    this.surface.pads.light (45, LAUNCHPAD_COLOR_ROSE, null, false);
    
    this.surface.pads.light (36, LAUNCHPAD_COLOR_RED, null, false);
    this.surface.pads.light (37, LAUNCHPAD_COLOR_GREEN, null, false);
    this.surface.pads.light (38, LAUNCHPAD_COLOR_YELLOW, null, false);
    this.surface.pads.light (39, LAUNCHPAD_COLOR_BLUE, null, false);
    this.surface.pads.light (40, LAUNCHPAD_COLOR_CYAN, null, false);
    this.surface.pads.light (41, LAUNCHPAD_COLOR_SKY, null, false);
    this.surface.pads.light (42, LAUNCHPAD_COLOR_ORCHID, null, false);
    this.surface.pads.light (43, LAUNCHPAD_COLOR_ROSE, null, false);
    this.surface.pads.light (51, LAUNCHPAD_COLOR_RED, null, false);
};

ShiftView.prototype.onGridNote = function (note, velocity)
{
    if (this.handleControlModes (note, velocity))
        return;
    if (velocity > 0)
        this.handleFunctions (note);
};

ShiftView.prototype.handleControlModes = function (note, velocity)
{
    var event = new ButtonEvent (velocity == 0 ? ButtonEvent.UP : ButtonEvent.DOWN);
    
    switch (note)
    {
        case 36:
            this.onRecArm (event);
            break;
        case 37:
            this.onTrackSelect (event);
            break;
        case 38:
            this.onMute (event);
            break;
        case 39:
            this.onSolo (event);
            break;
        case 40:
            this.onVolume (event);
            break;
        case 41:
            this.onPan (event);
            break;
        case 42:
            this.onSends (event);
            break;
        case 43:
            this.onModeButton (event, CONTROL_MODE_STOP_CLIP, "Stop Clip");
            break;
        default:
            return false;
    }
    if (this.surface.getPreviousControlMode () == this.surface.getControlMode ())
        this.surface.setControlMode (CONTROL_MODE_OFF);
    return true;
};

ShiftView.prototype.handleFunctions = function (note, velocity)
{
    switch (note)
    {
        case 92:
            this.model.getTransport ().toggleClick ();
            break;
        case 93:
            this.model.getTransport ().tapTempo ();
            break;
        case 84:
            this.model.getApplication ().undo ();
            break;
        case 85:
            this.model.getApplication ().redo ();
            break;
        case 76:
            this.model.getApplication ().deleteSelection ();
            break;
        case 68:
            this.model.getApplication ().quantize ();
            break;
        case 60:
            this.model.getApplication ().duplicate ();
            break;
        case 61:
            this.model.getTransport ().toggleLoop ();
            break;
        case 52:
            this.newClip ();
            break;
        case 53:
            this.handlePlayOptions ();
            break;
        case 44:
            this.model.getTransport ().record ();
            break;
        case 45:
            this.model.getTransport ().toggleLauncherOverdub ();
            break;
        case 51:
            this.model.getCurrentTrackBank ().getClipLauncherScenes ().stop ();
            break;
    }
};

ShiftView.prototype.onScene = function (scene, event)
{
    if (!event.isDown ())
        return;
    switch (scene)
    {
        case 0:
            this.handleControlModes (40, 127);
            break;
        case 1:
            this.handleControlModes (41, 127);
            break;
        case 2:
            this.handleControlModes (42, 127);
            break;
        case 3:
            this.handleControlModes (37, 127);
            break;
        case 4:
            this.handleControlModes (43, 127);
            break;
        case 5:
            this.handleControlModes (38, 127);
            break;
        case 6:
            this.handleControlModes (39, 127);
            break;
        case 7:
            this.handleControlModes (36, 127);
            break;
    }
};

ShiftView.prototype.scrollUp = function (event)
{
};

ShiftView.prototype.scrollDown = function (event)
{
};

ShiftView.prototype.scrollLeft = function (event)
{
};

ShiftView.prototype.scrollRight = function (event)
{
};
