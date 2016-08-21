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
        if (this.surface.isShiftPressed ())
            this.onGridNoteBankSelection (note, velocity, false);
        else
            AbstractSessionView.prototype.onGridNote.call (this, note, velocity);
        return;
    }
    
    // Block 1st row
    if (note >= 44)
    {
        // Translate the 7 other rows down
        if (this.surface.isShiftPressed ())
            this.onGridNoteBankSelection (note, velocity, true);
        else
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

SessionView.prototype.onGridNoteBankSelection = function (note, velocity, isOffset)
{
    if (velocity == 0)
        return;
    
    if (isOffset)
        note = note - 8;

    var index = note - 36;
    var x = index % this.columns;
    var y = (this.rows - 1) - Math.floor (index / this.columns);

    var tb = this.model.getCurrentTrackBank ();
    
    // Calculate page offsets
    var trackPosition = Math.floor (tb.getTrack (0).position / tb.numTracks);
    var scenePosition = Math.floor (tb.getScenePosition () / tb.numScenes);
    var selX = this.flip ? scenePosition : trackPosition;
    var selY = this.flip ? trackPosition : scenePosition;
    var padsX = this.flip ? this.rows : this.columns;
    var padsY = this.flip ? this.columns : (isOffset ? this.rows + 1 : this.rows);
    var offsetX = Math.floor (selX / padsX) * padsX;
    var offsetY = Math.floor (selY / padsY) * padsY;
    tb.scrollToChannel (offsetX * tb.numTracks + (this.flip ? y : x) * padsX);
    tb.scrollToScene (offsetY * tb.numScenes + (this.flip ? x : y) * padsY);
};

SessionView.prototype.doSelectClipOnLaunch = function ()
{
    return Config.selectClipOnLaunch;
};

SessionView.prototype.drawGrid = function ()
{
    // Draw 8 block clip navigation
    if (this.surface.isShiftPressed ())
    {
        var tb = this.model.getCurrentTrackBank ();
        var maxScenePads = Math.ceil (this.model.getSceneBank ().getSceneCount () / tb.numScenes);
        var maxTrackPads = Math.ceil (tb.getTrackCount () / tb.numTracks);
        var trackPosition = Math.floor (tb.getTrack (0).position / tb.numTracks);
        var scenePosition = Math.floor (tb.getScenePosition () / tb.numScenes);
        var selX = this.flip ? scenePosition : trackPosition;
        var selY = this.flip ? trackPosition : scenePosition;
        var padsX = this.flip ? this.rows : this.columns;
        var padsY = this.flip ? this.columns : this.rows;
        var offsetX = Math.floor (selX / padsX) * padsX;
        var offsetY = Math.floor (selY / padsY) * padsY;
        var maxX = (this.flip ? maxScenePads : maxTrackPads) - offsetX; 
        var maxY = (this.flip ? maxTrackPads : maxScenePads) - offsetY;
        selX -= offsetX;
        selY -= offsetY;
        
        var color = null;
        for (var x = 0; x < this.columns; x++)
        {
            var rowColor = x < maxX ? AbstractSessionView.CLIP_COLOR_HAS_CONTENT : AbstractSessionView.CLIP_COLOR_NO_CONTENT; 
            for (var y = 0; y < this.rows; y++)
            {
                color = y < maxY ? rowColor : AbstractSessionView.CLIP_COLOR_NO_CONTENT;
                if (selX == x && selY == y)
                    color = AbstractSessionView.CLIP_COLOR_IS_PLAYING;
                this.surface.pads.lightEx (x, y, color.color, color.blink, color.fast);
            }
        }
    }
    else
        AbstractSessionView.prototype.drawGrid.call (this);
    
    var controlMode = this.surface.getControlMode ();
    var isOff = controlMode == CONTROL_MODE_OFF;
    this.rows = isOff ? 8 : 7;
    
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
