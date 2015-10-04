// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

BrowserView.COLUMN_ORDER = [ 1, 0, 4, 5, 2, 3 ];

var COLUMN_COLORS = [ 
    LAUNCHPAD_COLOR_WHITE,  
    LAUNCHPAD_COLOR_GREY_MD,  
    LAUNCHPAD_COLOR_GREY_LO,  
    LAUNCHPAD_COLOR_ROSE,  
    LAUNCHPAD_COLOR_SPRING,  
    LAUNCHPAD_COLOR_OCEAN,  
    LAUNCHPAD_COLOR_BLACK,  
    LAUNCHPAD_COLOR_YELLOW,  
];
    
function BrowserView (model)
{
    if (model == null)
        return;
    
    AbstractView.call (this, model);
}
BrowserView.prototype = new AbstractView ();

BrowserView.prototype.updateArrowStates = function ()
{
    this.canScrollUp = false;
    this.canScrollDown = false;
    this.canScrollLeft = false;
    this.canScrollRight = false;
};

BrowserView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToPrgMode ();

    AbstractView.prototype.onActivate.call (this);

    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_TURQUOISE);

    this.model.getCurrentTrackBank ().setIndication (false);
    this.updateSceneButtons ();
    this.updateIndication ();
};

BrowserView.prototype.updateSceneButtons = function (buttonID)
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

BrowserView.prototype.drawGrid = function ()
{
    this.surface.pads.light (36, LAUNCHPAD_COLOR_RED, null, false);
    this.surface.pads.light (37, LAUNCHPAD_COLOR_BLACK, null, false);
    for (var i = 38; i < 42; i++)
        this.surface.pads.light (i, LAUNCHPAD_COLOR_ORCHID_LO, null, false);
    this.surface.pads.light (42, LAUNCHPAD_COLOR_BLACK, null, false);
    this.surface.pads.light (43, LAUNCHPAD_COLOR_GREEN_HI, null, false);
    for (var i = 44; i < 52; i++)
        this.surface.pads.light (i, LAUNCHPAD_COLOR_BLACK, null, false);
    
    for (var i = 52; i < 60; i++)
        this.surface.pads.light (i, COLUMN_COLORS[i - 52], null, false);
    for (var i = 60; i < 68; i++)
        this.surface.pads.light (i, COLUMN_COLORS[i - 60], null, false);
    for (var i = 68; i < 76; i++)
        this.surface.pads.light (i, COLUMN_COLORS[i - 68], null, false);
    for (var i = 76; i < 84; i++)
        this.surface.pads.light (i, COLUMN_COLORS[i - 76], null, false);
    
    for (var i = 84; i < 100; i++)
        this.surface.pads.light (i, LAUNCHPAD_COLOR_BLACK, null, false);
};

BrowserView.prototype.onGridNote = function (note, velocity)
{
    var session = this.model.getBrowser ().getPresetSession ();
    if (!session.isActive)
        return;
    
    switch (note)
    {
        // Cancel
        case 36:
            if (velocity == 0)
                return;
            this.model.getBrowser ().stopBrowsing (false);
            this.surface.restoreView ();
            break;
            
        // OK
        case 43:
            if (velocity == 0)
                return;
            this.model.getBrowser ().stopBrowsing (true);
            this.surface.restoreView ();
            break;
            
        case 38:
            this.surface.noteInput.sendRawMidiEvent (0x90, 48, velocity);
            break;
        case 39:
            this.surface.noteInput.sendRawMidiEvent (0x90, 60, velocity);
            break;
        case 40:
            this.surface.noteInput.sendRawMidiEvent (0x90, 72, velocity);
            break;
        case 41:
            this.surface.noteInput.sendRawMidiEvent (0x90, 84, velocity);
            break;
    }
    
    if (velocity == 0)
        return;

    if (note >= 52 && note < 84)
    {
        var n = note - 52;
        var row = Math.floor (n / 8);
        var col = n % 8;
        
        switch (col)
        {
            case 6:
                return;
                
            case 7:
                if (row == 0)
                    session.selectNextResult ();
                else if (row == 1)
                {
                    for (var i = 0; i < 8; i++)
                        session.selectNextResult ();
                }
                else if (row == 2)
                {
                    for (var i = 0; i < 8; i++)
                        session.selectPreviousResult ();
                }
                else if (row == 3)
                    session.selectPreviousResult ();
                break;
                
            default:
                if (row == 0)
                    session.selectNextFilterItem (BrowserView.COLUMN_ORDER[col]);
                else if (row == 1)
                {
                    for (var i = 0; i < 8; i++)
                        session.selectNextFilterItem (BrowserView.COLUMN_ORDER[col]);
                }
                else if (row == 2)
                {
                    for (var i = 0; i < 8; i++)
                        session.selectPreviousFilterItem (BrowserView.COLUMN_ORDER[col]);
                }
                else if (row == 3)
                    session.selectPreviousFilterItem (BrowserView.COLUMN_ORDER[col]);
                break;
        }
        
        return;
    }
};

BrowserView.prototype.onScene = function (scene, event)
{
    if (!event.isDown ())
        return;
};

BrowserView.prototype.scrollUp = function (event)
{
};

BrowserView.prototype.scrollDown = function (event)
{
};

BrowserView.prototype.scrollLeft = function (event)
{
};

BrowserView.prototype.scrollRight = function (event)
{
};
