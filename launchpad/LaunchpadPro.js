// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

var LAUNCHPAD_BUTTON_UP        = 91;
var LAUNCHPAD_BUTTON_DOWN      = 92;
var LAUNCHPAD_BUTTON_LEFT      = 93;
var LAUNCHPAD_BUTTON_RIGHT     = 94;
var LAUNCHPAD_BUTTON_SESSION   = 95;
var LAUNCHPAD_BUTTON_NOTE      = 96;    // User  1 on MkII
var LAUNCHPAD_BUTTON_DEVICE    = 97;    // User  2 on MkII
var LAUNCHPAD_BUTTON_USER      = 98;    // Mixer on MkII

var LAUNCHPAD_BUTTON_SHIFT     = 80;
var LAUNCHPAD_BUTTON_CLICK     = 70;
var LAUNCHPAD_BUTTON_UNDO      = 60;
var LAUNCHPAD_BUTTON_DELETE    = 50;
var LAUNCHPAD_BUTTON_QUANTIZE  = 40;
var LAUNCHPAD_BUTTON_DUPLICATE = 30;
var LAUNCHPAD_BUTTON_DOUBLE    = 20;
var LAUNCHPAD_BUTTON_RECORD    = 10;

var LAUNCHPAD_BUTTON_REC_ARM   = 1;
var LAUNCHPAD_BUTTON_TRACK     = 2;
var LAUNCHPAD_BUTTON_MUTE      = 3;
var LAUNCHPAD_BUTTON_SOLO      = 4;
var LAUNCHPAD_BUTTON_VOLUME    = 5;
var LAUNCHPAD_BUTTON_PAN       = 6;
var LAUNCHPAD_BUTTON_SENDS     = 7;
var LAUNCHPAD_BUTTON_STOP_CLIP = 8;

var LAUNCHPAD_BUTTON_SCENE1    = 89;    // 1/4
var LAUNCHPAD_BUTTON_SCENE2    = 79;    
var LAUNCHPAD_BUTTON_SCENE3    = 69;
var LAUNCHPAD_BUTTON_SCENE4    = 59;
var LAUNCHPAD_BUTTON_SCENE5    = 49;    // ...
var LAUNCHPAD_BUTTON_SCENE6    = 39;
var LAUNCHPAD_BUTTON_SCENE7    = 29;
var LAUNCHPAD_BUTTON_SCENE8    = 19;    // 1/32T

var LAUNCHPAD_FADER_1          = 21;
var LAUNCHPAD_FADER_2          = 22;
var LAUNCHPAD_FADER_3          = 23;
var LAUNCHPAD_FADER_4          = 24;
var LAUNCHPAD_FADER_5          = 25;
var LAUNCHPAD_FADER_6          = 26;
var LAUNCHPAD_FADER_7          = 27;
var LAUNCHPAD_FADER_8          = 28;

var LAUNCHPAD_BUTTON_STATE_OFF = 0;
var LAUNCHPAD_BUTTON_STATE_ON  = 1;
var LAUNCHPAD_BUTTON_STATE_HI  = 4;

var LAUNCHPAD_BUTTONS_ALL =
[
    LAUNCHPAD_BUTTON_LEFT,
    LAUNCHPAD_BUTTON_RIGHT,
    LAUNCHPAD_BUTTON_UP,
    LAUNCHPAD_BUTTON_DOWN,
    LAUNCHPAD_BUTTON_SESSION,
    LAUNCHPAD_BUTTON_NOTE, 
    LAUNCHPAD_BUTTON_DEVICE,
    LAUNCHPAD_BUTTON_USER,
    LAUNCHPAD_BUTTON_SHIFT,
    LAUNCHPAD_BUTTON_CLICK,
    LAUNCHPAD_BUTTON_UNDO,
    LAUNCHPAD_BUTTON_DELETE,
    LAUNCHPAD_BUTTON_QUANTIZE,
    LAUNCHPAD_BUTTON_DUPLICATE,
    LAUNCHPAD_BUTTON_DOUBLE,
    LAUNCHPAD_BUTTON_RECORD,
    LAUNCHPAD_BUTTON_REC_ARM,
    LAUNCHPAD_BUTTON_TRACK,
    LAUNCHPAD_BUTTON_MUTE,
    LAUNCHPAD_BUTTON_SOLO,
    LAUNCHPAD_BUTTON_VOLUME,
    LAUNCHPAD_BUTTON_PAN,
    LAUNCHPAD_BUTTON_SENDS,
    LAUNCHPAD_BUTTON_STOP_CLIP,
    LAUNCHPAD_BUTTON_SCENE1,
    LAUNCHPAD_BUTTON_SCENE2,
    LAUNCHPAD_BUTTON_SCENE3,
    LAUNCHPAD_BUTTON_SCENE4,
    LAUNCHPAD_BUTTON_SCENE5,
    LAUNCHPAD_BUTTON_SCENE6,
    LAUNCHPAD_BUTTON_SCENE7,
    LAUNCHPAD_BUTTON_SCENE8
];

var CONTROL_MODE_OFF          = 0;
var CONTROL_MODE_REC_ARM      = 1;
var CONTROL_MODE_TRACK_SELECT = 2;
var CONTROL_MODE_MUTE         = 3;
var CONTROL_MODE_SOLO         = 4;
var CONTROL_MODE_STOP_CLIP    = 5;

var SYSEX_HEADER         = "F0 00 20 29 02 10 ";
var LAUNCHPAD_PRG_MODE   = "2C 03";
var LAUNCHPAD_FADER_MODE = "2C 02";
var LAUNCHPAD_PAN_MODE   = "2C 02";


function LaunchpadPro (output, input)
{
    AbstractControlSurface.call (this, output, input, LAUNCHPAD_BUTTONS_ALL);
    
    this.isPro = true;
    
    for (var i = 36; i < 100; i++)
        this.gridNotes.push (i);
    
    this.shiftButtonId  = LAUNCHPAD_BUTTON_SHIFT;

    this.pads = new Grid (output);
    
    this.showVU = false;
    
    this.controlMode = CONTROL_MODE_OFF;
    this.previousControlMode = CONTROL_MODE_OFF;
}
LaunchpadPro.prototype = new AbstractControlSurface ();

LaunchpadPro.prototype.setLaunchpadToStandalone = function ()
{
    this.output.sendSysex (SYSEX_HEADER + "21 01 F7");
};

LaunchpadPro.prototype.setLaunchpadToPrgMode = function ()
{
    this.output.sendSysex (SYSEX_HEADER + LAUNCHPAD_PRG_MODE + " F7");
};

LaunchpadPro.prototype.setLaunchpadToFaderMode = function ()
{
    this.output.sendSysex (SYSEX_HEADER + LAUNCHPAD_FADER_MODE + " F7");
};

LaunchpadPro.prototype.setLaunchpadToPanMode = function ()
{
    this.output.sendSysex (SYSEX_HEADER + LAUNCHPAD_PAN_MODE + " F7");
};

LaunchpadPro.prototype.setupFader = function (number, color)
{
    this.output.sendSysex (SYSEX_HEADER + "2B 0" + number + " 00 " + toHexStr ([ color ]) + " 00 F7");
};

LaunchpadPro.prototype.setupPanFader = function (number, color)
{
    this.output.sendSysex (SYSEX_HEADER + "2B 0" + number + " 01 " + toHexStr ([ color ]) + " 00 F7");
};

LaunchpadPro.prototype.setControlMode = function (mode)
{
    this.previousControlMode = this.controlMode;
    this.controlMode = mode;
};

LaunchpadPro.prototype.getControlMode = function ()
{
    return this.controlMode;
};

LaunchpadPro.prototype.getPreviousControlMode = function ()
{
    return this.previousControlMode;
};

LaunchpadPro.prototype.shutdown = function ()
{
    // Turn off front LED
    this.output.sendSysex (SYSEX_HEADER + "0A 63 00 F7");
    this.pads.turnOff ();
    // Turn off all buttons
    for (var i = 0; i < this.buttons.length; i++)
        this.setButton (this.buttons[i], LAUNCHPAD_BUTTON_STATE_OFF);
};

// Note: Weird to send to the DAW via LaunchpadPro...
LaunchpadPro.prototype.sendMidiEvent = function (status, data1, data2)
{
    this.noteInput.sendRawMidiEvent (status, data1, data2);
};

LaunchpadPro.prototype.isGridNote = function (note)
{
    return true;
};

LaunchpadPro.prototype.handleGridNote = function (note, velocity)
{
    // Handling for Mk2 Scene Buttons which send midi notes instead of CC
    if (!this.isPro)
    {
        switch (note)
        {
            case 89:
                this.callScene (0, velocity);
                return;
            case 79:
                this.callScene (1, velocity);
                return;
            case 69:
                this.callScene (2, velocity);
                return;
            case 59:
                this.callScene (3, velocity);
                return;
            case 49:
                this.callScene (4, velocity);
                return;
            case 39:
                this.callScene (5, velocity);
                return;
            case 29:
                this.callScene (6, velocity);
                return;
            case 19:
                this.callScene (7, velocity);
                return;
        }
    }

    AbstractControlSurface.prototype.handleGridNote.call (this, this.pads.translateToGrid (note), velocity);
};

LaunchpadPro.prototype.callScene = function (scene, velocity)
{
    var view = this.getActiveView ();
    if (view != null)
        view.onScene (scene, new ButtonEvent (velocity == 0 ? ButtonEvent.UP : ButtonEvent.DOWN));
};

//--------------------------------------
// ViewState
//--------------------------------------

LaunchpadPro.prototype.updateButtons = function ()
{
    var view = this.getActiveView ();
    if (view != null)
        view.updateButtons ();
};

//--------------------------------------
// Gesture
//--------------------------------------

LaunchpadPro.prototype.isDeletePressed = function ()
{
    return this.isPressed (LAUNCHPAD_BUTTON_DELETE);
};

LaunchpadPro.prototype.isMixerPressed = function ()
{
    return this.isPressed (LAUNCHPAD_BUTTON_USER);
};

//--------------------------------------
// Display
//--------------------------------------

LaunchpadPro.prototype.setButton = function (button, state)
{
    if (!this.isPro)
    {
        if (button == LAUNCHPAD_BUTTON_SCENE1 ||
            button == LAUNCHPAD_BUTTON_SCENE2 ||
            button == LAUNCHPAD_BUTTON_SCENE3 ||
            button == LAUNCHPAD_BUTTON_SCENE4 ||
            button == LAUNCHPAD_BUTTON_SCENE5 ||
            button == LAUNCHPAD_BUTTON_SCENE6 ||
            button == LAUNCHPAD_BUTTON_SCENE7 ||
            button == LAUNCHPAD_BUTTON_SCENE8)
            this.output.sendNote (button, state);
    }
    
    this.output.sendCC (button, state);
};

//--------------------------------------
// Handlers
//--------------------------------------

LaunchpadPro.prototype.handleEvent = function (cc, value)
{
    var view = this.getActiveView ();
    if (view == null)
        return;
        
    var event = this.isButton (cc) ? new ButtonEvent (this.buttonStates[cc]) : null;
    switch (cc)
    {
        // Left
        case LAUNCHPAD_BUTTON_LEFT:
            view.onLeft (event);
            break;
            
        // Right
        case LAUNCHPAD_BUTTON_RIGHT:
            view.onRight (event);
            break;

        // Up
        case LAUNCHPAD_BUTTON_UP:
            view.onUp (event);
            break;

        // Down
        case LAUNCHPAD_BUTTON_DOWN:
            view.onDown (event);
            break;

        // Session Mode
        case LAUNCHPAD_BUTTON_SESSION:
            view.onSession (event);
            break;

        // Play Note Mode
        case LAUNCHPAD_BUTTON_NOTE:
            view.onNote (event);
            break;

        // Device Mode
        case LAUNCHPAD_BUTTON_DEVICE:
            view.onDevice (event);
            break;
            
        // Browse
        case LAUNCHPAD_BUTTON_USER:
            view.onUser (event);
            break;
            
        // Scene buttons
        case LAUNCHPAD_BUTTON_SCENE1:
        case LAUNCHPAD_BUTTON_SCENE2:    
        case LAUNCHPAD_BUTTON_SCENE3:
        case LAUNCHPAD_BUTTON_SCENE4:
        case LAUNCHPAD_BUTTON_SCENE5:
        case LAUNCHPAD_BUTTON_SCENE6:
        case LAUNCHPAD_BUTTON_SCENE7:
        case LAUNCHPAD_BUTTON_SCENE8:
            view.onScene (8 - Math.floor (cc / 10), event);
            break;

        // Shift Key
        case LAUNCHPAD_BUTTON_SHIFT:
            view.onShift (event);
            break;

        // Click & Tap Tempo
        case LAUNCHPAD_BUTTON_CLICK:
            view.onClick (event);
            break;
            
        // Undo
        case LAUNCHPAD_BUTTON_UNDO:
            view.onUndo (event);
            break;
            
        // Delete
        case LAUNCHPAD_BUTTON_DELETE:
            view.onDelete (event);
            break;

        // Quantize
        case LAUNCHPAD_BUTTON_QUANTIZE:
            view.onQuantize (event);
            break;
            
        // Duplicate
        case LAUNCHPAD_BUTTON_DUPLICATE:
            view.onDuplicate (event);
            break;

        // Double
        case LAUNCHPAD_BUTTON_DOUBLE:
            view.onDouble (event);
            break;
            
        // Record
        case LAUNCHPAD_BUTTON_RECORD:
            view.onRecord (event);
            break;

        // Rec Arm
        case LAUNCHPAD_BUTTON_REC_ARM:
            view.onRecArm (event);
            break;
            
         // Track Select Mode
        case LAUNCHPAD_BUTTON_TRACK:
            view.onTrackSelect (event);
            break;
            
        // Mute
        case LAUNCHPAD_BUTTON_MUTE:
            view.onMute (event);
            break;

        // Solo
        case LAUNCHPAD_BUTTON_SOLO:
            view.onSolo (event);
            break;

        // Volume Mode
        case LAUNCHPAD_BUTTON_VOLUME:
            view.onVolume (event);
            break;
            
        // Pan Mode
        case LAUNCHPAD_BUTTON_PAN:
            view.onPan (event);
            break;
        
        // Sends Mode
        case LAUNCHPAD_BUTTON_SENDS:
            view.onSends (event);
            break;
        
        // Stop clip
        case LAUNCHPAD_BUTTON_STOP_CLIP:
            view.onStopClip (event);
            break;

        case LAUNCHPAD_FADER_1:
        case LAUNCHPAD_FADER_2:
        case LAUNCHPAD_FADER_3:
        case LAUNCHPAD_FADER_4:
        case LAUNCHPAD_FADER_5:
        case LAUNCHPAD_FADER_6:
        case LAUNCHPAD_FADER_7:
        case LAUNCHPAD_FADER_8:
            view.onFader (cc - LAUNCHPAD_FADER_1, value);
            break;
            
        default:
            println (cc);
            break;
    }
};
