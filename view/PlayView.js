// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayView (model)
{
    if (model == null)
        return;
    
    AbstractView.call (this, model);

    this.scales = model.getScales ();
    this.noteMap = this.scales.getEmptyMatrix ();
    this.pressedKeys = initArray (0, 128);
    this.defaultVelocity = [];
    for (var i = 0; i < 128; i++)
        this.defaultVelocity.push (i);

    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        for (var i = 0; i < 128; i++)
        {
            if (this.noteMap[i] == note)
                this.pressedKeys[i] = pressed ? velocity : 0;
        }
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));

    this.scrollerInterval = Config.trackScrollInterval;
}
PlayView.prototype = new AbstractView ();

PlayView.prototype.updateNoteMapping = function ()
{
    // Workaround: https://github.com/git-moss/Push4Bitwig/issues/7
    scheduleTask (doObject (this, PlayView.prototype.delayedUpdateNoteMapping), null, 100);
};

PlayView.prototype.updateArrowStates = function ()
{
    var octave = this.scales.getOctave ();
    this.canScrollUp = octave < 3;
    this.canScrollDown = octave > -3;
    var scale = this.scales.getSelectedScale ();
    this.canScrollLeft = scale > 0;
    this.canScrollRight = scale < Scales.INTERVALS.length - 1;
};

PlayView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToPrgMode ();

    AbstractView.prototype.onActivate.call (this);

    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, LAUNCHPAD_COLOR_OCEAN_HI);
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_GREY_LO);

    this.model.getCurrentTrackBank ().setIndication (false);
    this.updateSceneButtons ();
    this.updateIndication ();
};

PlayView.prototype.updateSceneButtons = function (buttonID)
{
    if (this.canSelectedTrackHoldNotes ())
    {
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, LAUNCHPAD_COLOR_OCEAN_HI);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, LAUNCHPAD_COLOR_OCEAN_HI);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, LAUNCHPAD_COLOR_BLACK);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, LAUNCHPAD_COLOR_WHITE);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, LAUNCHPAD_COLOR_OCEAN_HI);
        this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, LAUNCHPAD_COLOR_OCEAN_HI);
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

PlayView.prototype.drawGrid = function ()
{
    var isKeyboardEnabled = this.canSelectedTrackHoldNotes ();
    var isRecording = this.model.hasRecordingState ();

    for (var i = 36; i < 100; i++)
    {
        this.surface.pads.light (i, isKeyboardEnabled ? (this.pressedKeys[i] > 0 ?
            (isRecording ? LAUNCHPAD_COLOR_RED_HI : LAUNCHPAD_COLOR_GREEN_HI) :
            this.scales.getColor (this.noteMap, i)) : LAUNCHPAD_COLOR_BLACK, null, false);
    }
};

PlayView.prototype.onGridNote = function (note, velocity)
{
    if (!this.canSelectedTrackHoldNotes () || this.noteMap[note] == -1)
        return;
    
    // Mark selected notes
    for (var i = 0; i < 128; i++)
    {
        if (this.noteMap[note] == this.noteMap[i])
            this.pressedKeys[i] = velocity;
    }
};

PlayView.prototype.onPolyAftertouch = function (note, value)
{
    switch (Config.convertAftertouch)
    {
        case -3:
            // Filter poly aftertouch
            break;
        
        case -2:
            // Translate notes of Poly aftertouch to current note mapping
            this.surface.sendMidiEvent (0xA0, this.noteMap[note], value);
            break;
        
        case -1:
            // Convert to Channel Aftertouch
            this.surface.sendMidiEvent (0xD0, value, 0);
            break;
            
        default:
            // Midi CC
            this.surface.sendMidiEvent (0xB0, Config.convertAftertouch, value);
            break;
    }
};

PlayView.prototype.onScene = function (scene, event)
{
    if (!event.isDown ())
        return;
    if (!this.canSelectedTrackHoldNotes ())
        return;
    switch (scene)
    {
        case 0:
            this.scales.setScaleLayout (this.scales.getScaleLayout () + 1);
            this.updateNoteMapping ();
            var name = Scales.LAYOUT_NAMES[this.scales.getScaleLayout ()];
            Config.setScaleLayout (name);
            displayNotification (name);
            break;
        case 1:
            this.scales.setScaleLayout (this.scales.getScaleLayout () - 1);
            this.updateNoteMapping ();
            var name = Scales.LAYOUT_NAMES[this.scales.getScaleLayout ()];
            Config.setScaleLayout (name);
            displayNotification (name);
            break;
		case 5:
			this.scales.toggleChromatic ();
			var isChromatic = this.scales.isChromatic ();
			Config.setScaleInScale (!isChromatic);
            displayNotification (isChromatic ? "Chromatic" : "In Key");
			break;
		case 6:
            this.scales.setScaleOffset (this.scales.getScaleOffset () + 1);
            displayNotification (Scales.BASES[this.scales.getScaleOffset ()]);
            break;
		case 7:
            this.scales.setScaleOffset (this.scales.getScaleOffset () - 1);
            displayNotification (Scales.BASES[this.scales.getScaleOffset ()]);
            break;
    }
    this.updateNoteMapping ();
};

PlayView.prototype.onOctaveDown = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.decOctave ();
    this.updateNoteMapping ();
    displayNotification (this.scales.getRangeText ());
};

PlayView.prototype.onOctaveUp = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.incOctave ();
    this.updateNoteMapping ();
    displayNotification (this.scales.getRangeText ());
};

PlayView.prototype.scrollUp = function (event)
{
    this.onOctaveUp (event);
};

PlayView.prototype.scrollDown = function (event)
{
    this.onOctaveDown (event);
};

PlayView.prototype.scrollLeft = function (event)
{
    this.scales.prevScale ();
    Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
    displayNotification (this.scales.getName (this.scales.getSelectedScale ()));
};

PlayView.prototype.scrollRight = function (event)
{
    this.scales.nextScale ();
    Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
    displayNotification (this.scales.getName (this.scales.getSelectedScale ()));
};

PlayView.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};

PlayView.prototype.delayedUpdateNoteMapping = function ()
{
    this.noteMap = this.canSelectedTrackHoldNotes () ? this.scales.getNoteMatrix () : this.scales.getEmptyMatrix ();
    this.surface.setKeyTranslationTable (this.scales.translateMatrixToGrid (this.noteMap));
};
