// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractView.prototype.stopPressed = false;
AbstractView.prototype.showDevices = true;
AbstractView.prototype.lastAbstractDeviceMode = 0;
AbstractView.prototype.cursorColor = LAUNCHPAD_COLOR_OCEAN_HI;

AbstractView.firstRowUsed  = false;
AbstractView.temporaryView = false;

AbstractView.prototype.updateIndication = function ()
{
    var isVolume = this.surface.isActiveView (VIEW_VOLUME);
    var isPan    = this.surface.isActiveView (VIEW_PAN);
    var isSends  = this.surface.isActiveView (VIEW_SENDS);
    var isDevice = this.surface.isActiveView (VIEW_DEVICE);
    var view     = this.surface.getActiveView ();

    var tb = this.model.getCurrentTrackBank ();
    for (var i = 0; i < 8; i++)
    {
        tb.setVolumeIndication (i, isVolume);
        tb.setPanIndication (i, isPan);
        for (var j = 0; j < 8; j++)
            tb.setSendIndication (i, j, isSends && view.selectedSend == j);

        var cd = this.model.getCursorDevice ();
        cd.getParameter (i).setIndication (isDevice && view.isParamMode);
        cd.getMacro (i).getAmount ().setIndication (isDevice && !view.isParamMode);
    }
};

//--------------------------------------
// Buttons on left side
//--------------------------------------

AbstractView.prototype.onShift = function (event)
{
    if (!event.isLong ())
        this.updateButtons ();
};

AbstractView.prototype.onClick = function (event)
{
    if (!event.isDown ())
        return;
    if (this.surface.isShiftPressed ())
        this.model.getTransport ().tapTempo ();
    else
        this.model.getTransport ().toggleClick ();
};

AbstractView.prototype.onUndo = function (event)
{
    if (!event.isDown ())
        return;
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().redo ();
    else
        this.model.getApplication ().undo ();
};

AbstractView.prototype.onDelete = function (event)
{
    if (event.isUp ())
        this.model.getApplication ().deleteSelection ();
};

AbstractView.prototype.onQuantize = function (event)
{
    if (!event.isDown ())
        return;

    // We can use any cursor clip, e.g. the one of the drum view
    var view = this.surface.getView (VIEW_DRUM);
    view.clip.quantize (Config.quantizeAmount / 100);
};

AbstractView.prototype.onDuplicate = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLoop ();
    else
        this.model.getApplication ().duplicate ();
};

AbstractView.prototype.onDouble = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
    {
        this.handlePlayOptions ();
        return;
    }

    this.newClip ();
};

AbstractView.prototype.newClip = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    var track = tb.getSelectedTrack ();
    if (track == null)
    {
        displayNotification ("Please select an Instrument track first.");
        return;
    }

    var selectedSlot = tb.getSelectedSlot (track.index);
    var slotIndex = selectedSlot == null ? 0 : selectedSlot.index;
    var slot = tb.getEmptySlot (track.index, slotIndex);
    if (slot == null)
    {
        displayNotification ("In the current selected grid view there is no empty slot. Please scroll down.");
        return;
    }

    var slots = tb.getClipLauncherSlots (track.index);
    if (slotIndex != slot.index)
        slots.select (slot.index);
    slots.launch (slot.index);
    this.model.getTransport ().setLauncherOverdub (true);
};

AbstractView.prototype.onRecord = function (event)
{
    if (!event.isDown ())
        return;
    if (this.surface.isShiftPressed ())
        this.model.getTransport ().record ();
    else
        this.recordClip()
};

AbstractView.prototype.recordClip = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    var track = tb.getSelectedTrack ();
    if (track == null)
    {
        displayNotification ("Please select an Instrument track first.");
        return;
    }

    var selectedSlot = tb.getSelectedSlot (track.index);
    var slotIndex = selectedSlot == null ? 0 : selectedSlot.index;
    var slot = track.slots[slotIndex];
    var slots = tb.getClipLauncherSlots (track.index);

    if (slot.hasContent){
        if (slot.isRecording){
            slots.launch (slotIndex);
            this.model.getTransport ().setLauncherOverdub (false);
        }
        else{
            this.model.getTransport ().toggleLauncherOverdub ();
        }
    }
    else {
        if (!slot.isRecording){
            slots.launch (slotIndex);
            this.model.getTransport ().setLauncherOverdub (true);
        }
    }
};

//--------------------------------------
// Buttons on right side
//--------------------------------------

AbstractView.prototype.onScene = function (index) {};

//--------------------------------------
// Buttons on bottom
//--------------------------------------

AbstractView.prototype.onRecArm = function (event)
{
    this.onModeButton (event, CONTROL_MODE_REC_ARM, "Record Arm");
};

AbstractView.prototype.onTrackSelect = function (event)
{
    this.onModeButton (event, CONTROL_MODE_TRACK_SELECT, "Track Select");
};

AbstractView.prototype.onMute = function (event)
{
    this.onModeButton (event, CONTROL_MODE_MUTE, "Mute");
};

AbstractView.prototype.onSolo = function (event)
{
    this.onModeButton (event, CONTROL_MODE_SOLO, "Solo");
};

AbstractView.prototype.onVolume = function (event)
{
    this.onFaderModeButton (event, VIEW_VOLUME, "Volume");
};

AbstractView.prototype.onPan = function (event)
{
    this.onFaderModeButton (event, VIEW_PAN, "Pan");
};

AbstractView.prototype.onSends = function (event)
{
    this.onFaderModeButton (event, VIEW_SENDS, "Sends");
};

AbstractView.prototype.onStopClip = function (event)
{
    if (this.surface.isShiftPressed ())
    {
        this.model.getCurrentTrackBank ().getClipLauncherScenes ().stop ();
        return;
    }

    this.onModeButton (event, CONTROL_MODE_STOP_CLIP, "Stop Clip");
};

AbstractView.prototype.onModeButton = function (event, controlMode, notification)
{
    if (event.isDown ())
    {
        AbstractView.firstRowUsed = false;
        this.surface.setControlMode (controlMode);
        this.surface.setActiveView (VIEW_SESSION);
        displayNotification (notification);
    }
    else if (event.isLong ())
        AbstractView.firstRowUsed = true;
    else if (event.isUp ())
    {
        if (AbstractView.firstRowUsed || this.surface.getPreviousControlMode () == controlMode)
            this.surface.setControlMode (CONTROL_MODE_OFF);
    }
};

AbstractView.prototype.onFaderModeButton = function (event, view, notification)
{
    if (event.isDown ())
    {
        if (this.surface.isActiveView (view))
        {
            this.surface.restoreView ();
        }
        else
        {
            AbstractView.temporaryView = false;
            this.surface.setControlMode (CONTROL_MODE_OFF);
            this.surface.setActiveView (view);
            displayNotification (notification);
        }
    }
    else if (event.isLong ())
        AbstractView.temporaryView = true;
    else if (event.isUp ())
    {
        if (AbstractView.temporaryView)
        {
            this.surface.restoreView ();
            AbstractView.temporaryView = false;
        }
    }
};

//--------------------------------------
// Top button row
//--------------------------------------

AbstractView.prototype.scrollLeft = function (event)
{
    var tb = this.model.getCurrentTrackBank ();
    var sel = tb.getSelectedTrack ();
    var index = sel == null ? 0 : sel.index - 1;
    if (index == -1 || this.surface.isShiftPressed ())
    {
        if (!tb.canScrollTracksUp ())
            return;
        tb.scrollTracksPageUp ();
        var newSel = index == -1 || sel == null ? 7 : sel.index;
        scheduleTask (doObject (this, this.selectTrack), [ newSel ], 75);
        return;
    }
    this.selectTrack (index);
};

AbstractView.prototype.scrollRight = function (event)
{
    var tb = this.model.getCurrentTrackBank ();
    var sel = tb.getSelectedTrack ();
    var index = sel == null ? 0 : sel.index + 1;
    if (index == 8 || this.surface.isShiftPressed ())
    {
        if (!tb.canScrollTracksDown ())
            return;
        tb.scrollTracksPageDown ();
        var newSel = index == 8 || sel == null ? 0 : sel.index;
        scheduleTask (doObject (this, this.selectTrack), [ newSel ], 75);
        return;
    }
    this.selectTrack (index);
};

AbstractView.prototype.onSession = function (event)
{
    if (event.isDown ())
        this.surface.setActiveView (VIEW_SESSION);
};

AbstractView.prototype.onNote = function (event)
{
    if (!event.isDown ())
        return;

    var viewID = VIEW_PLAY;
    if (this.isNoteViewActive ())
    {
        if (this.surface.isShiftPressed ())
            viewID = this.surface.isActiveView (VIEW_SEQUENCER) ? VIEW_RAINDROPS : VIEW_SEQUENCER;
        else
            viewID = this.surface.isActiveView (VIEW_PLAY) ? VIEW_DRUM : VIEW_PLAY;
    }
    else
    {
        var tb = this.model.getCurrentTrackBank ();
        var sel = tb.getSelectedTrack ();
        if (sel != null)
        {
            viewID = tb.getPreferredView (sel.index);
            if (viewID == null)
                viewID = this.surface.isShiftPressed () ? VIEW_SEQUENCER : VIEW_PLAY;
        }
    }
    this.surface.setActiveView (viewID);
    this.model.getCurrentTrackBank ().setPreferredView (viewID);
};

AbstractView.prototype.isNoteViewActive = function ()
{
    return this.surface.isActiveView (VIEW_PLAY) ||
           this.surface.isActiveView (VIEW_DRUM) ||
           this.surface.isActiveView (VIEW_SEQUENCER) ||
           this.surface.isActiveView (VIEW_RAINDROPS) ||
           (this.surface.isActiveView (VIEW_SHIFT) &&
               (this.surface.previousViewId == VIEW_PLAY ||
                this.surface.previousViewId == VIEW_DRUM ||
                this.surface.previousViewId == VIEW_SEQUENCER ||
                this.surface.previousViewId == VIEW_RAINDROPS)
           );
};

AbstractView.prototype.onDevice = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isActiveView (VIEW_DEVICE))
    {
        this.model.getBrowser ().browseForPresets ();
        scheduleTask (doObject (this, this.switchToBrowseView), [], 150);
        return;
    }

    if (this.surface.isActiveView (VIEW_BROWSER))
        this.model.getBrowser ().stopBrowsing (false);

    this.surface.setActiveView (VIEW_DEVICE);
};

AbstractView.prototype.onUser = function (event)
{
    if (this.surface.isPro)
        return;
    if (event.isDown ())
        this.surface.setActiveView (VIEW_SHIFT);
    else if (event.isUp () && this.surface.isActiveView (VIEW_SHIFT))
        this.surface.restoreView ();
};

AbstractView.prototype.switchToBrowseView = function ()
{
    if (this.model.getBrowser ().getPresetSession ().isActive)
        this.surface.setActiveView (VIEW_BROWSER);
};

//--------------------------------------
// Protected API
//--------------------------------------

AbstractView.prototype.updateButtons = function ()
{
    if (!this.surface.isPro)
    {
        this.surface.setButton (LAUNCHPAD_BUTTON_USER, this.surface.isMixerPressed () ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_BLACK);
        return;
    }
    this.surface.setButton (LAUNCHPAD_BUTTON_USER, LAUNCHPAD_COLOR_BLACK);

    var isShift = this.surface.isShiftPressed ();
    var selTrack = this.model.getCurrentTrackBank ().getSelectedTrack ();
    var index = selTrack == null ? -1 : selTrack.index;
    var mode = this.surface.getControlMode ();

    this.surface.setButton (LAUNCHPAD_BUTTON_SHIFT, isShift ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_CLICK, isShift ? LAUNCHPAD_COLOR_GREEN_SPRING : LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_UNDO, isShift ? LAUNCHPAD_COLOR_GREEN_SPRING : LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_DELETE, isShift ? LAUNCHPAD_COLOR_BLACK : LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_QUANTIZE, isShift ? LAUNCHPAD_COLOR_BLACK : LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_DUPLICATE, isShift ? LAUNCHPAD_COLOR_GREEN_SPRING : LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_DOUBLE, isShift ? LAUNCHPAD_COLOR_GREEN_SPRING : LAUNCHPAD_COLOR_GREEN);
    this.surface.setButton (LAUNCHPAD_BUTTON_RECORD, isShift ? LAUNCHPAD_COLOR_ROSE : LAUNCHPAD_COLOR_RED);

    this.surface.setButton (LAUNCHPAD_BUTTON_REC_ARM, mode == CONTROL_MODE_REC_ARM ? LAUNCHPAD_COLOR_RED : (index == 0 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));
    this.surface.setButton (LAUNCHPAD_BUTTON_TRACK, mode == CONTROL_MODE_TRACK_SELECT ? LAUNCHPAD_COLOR_GREEN : (index == 1 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));
    this.surface.setButton (LAUNCHPAD_BUTTON_MUTE, mode == CONTROL_MODE_MUTE ? LAUNCHPAD_COLOR_YELLOW : (index == 2 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));
    this.surface.setButton (LAUNCHPAD_BUTTON_SOLO, mode == CONTROL_MODE_SOLO ? LAUNCHPAD_COLOR_BLUE : (index == 3 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));
    this.surface.setButton (LAUNCHPAD_BUTTON_VOLUME, this.surface.isActiveView (VIEW_VOLUME) ? LAUNCHPAD_COLOR_CYAN : (index == 4 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));
    this.surface.setButton (LAUNCHPAD_BUTTON_PAN, this.surface.isActiveView (VIEW_PAN) ? LAUNCHPAD_COLOR_SKY : (index == 5 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));
    this.surface.setButton (LAUNCHPAD_BUTTON_SENDS, this.surface.isActiveView (VIEW_SENDS) ? LAUNCHPAD_COLOR_ORCHID : (index == 6 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));
    this.surface.setButton (LAUNCHPAD_BUTTON_STOP_CLIP, mode == CONTROL_MODE_STOP_CLIP ? LAUNCHPAD_COLOR_ROSE : (index == 7 ? LAUNCHPAD_COLOR_WHITE : LAUNCHPAD_COLOR_GREY_LO));

    // Update the front LED with the color of the current track
    var track = this.model.getCurrentTrackBank ().getTrack (index);
    var color = track ? track.color : 0;
    this.surface.output.sendSysex (SYSEX_HEADER + "0A 63 " + toHexStr ([ color ? color : 0 ]) + " F7");
};

AbstractView.prototype.updateArrowStates = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    var sel = tb.getSelectedTrack ();
    this.canScrollLeft = sel != null && sel.index > 0 || tb.canScrollTracksUp ();
    this.canScrollRight = sel != null && (sel.index < 7 && tb.getTrack (sel.index + 1).exists) || tb.canScrollTracksDown ();
};

AbstractView.prototype.updateArrows = function ()
{
    this.updateArrowStates ();
    this.surface.setButton (LAUNCHPAD_BUTTON_LEFT, this.canScrollLeft ? this.cursorColor : LAUNCHPAD_BUTTON_STATE_OFF);
    this.surface.setButton (LAUNCHPAD_BUTTON_RIGHT, this.canScrollRight ? this.cursorColor : LAUNCHPAD_BUTTON_STATE_OFF);
    this.surface.setButton (LAUNCHPAD_BUTTON_UP, this.canScrollUp ? this.cursorColor : LAUNCHPAD_BUTTON_STATE_OFF);
    this.surface.setButton (LAUNCHPAD_BUTTON_DOWN, this.canScrollDown ? this.cursorColor : LAUNCHPAD_BUTTON_STATE_OFF);
    this.updateSceneButtons ();
};

AbstractView.prototype.setShowDevices = function (enable)
{
    this.showDevices = enable;
    for (var i = 0; i < DEVICE_MODES.length; i++)
        this.surface.getMode (DEVICE_MODES[i]).setShowDevices (enable);
};

AbstractView.prototype.onFader = function (index, value) {};
