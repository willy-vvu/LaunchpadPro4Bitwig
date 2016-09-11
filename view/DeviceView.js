// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DeviceView (model)
{
    if (model == null)
        return;
    
    AbstractView.call (this, model);
    
    this.cursorColor = LAUNCHPAD_COLOR_AMBER;
    this.cursorDevice = this.model.getCursorDevice ();
    
    this.isParamMode = true;
}
DeviceView.prototype = new AbstractView ();

DeviceView.prototype.updateNoteMapping = function () {};

DeviceView.prototype.updateArrowStates = function ()
{
    this.canScrollUp = false;
    this.canScrollDown = false;
    this.canScrollLeft = this.cursorDevice.hasPreviousParameterPage ();
    this.canScrollRight = this.cursorDevice.hasNextParameterPage ();
};

DeviceView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToFaderMode ();

    AbstractView.prototype.onActivate.call (this);

    this.updateIndication ();
    
    for (var i = 0; i < 8; i++)
        this.setupFader (i);
  
    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_USER, LAUNCHPAD_COLOR_GREY_LO);

    // Workaround for pressed button getting turned off in Fader mode
    scheduleTask (doObject (this, DeviceView.prototype.updateViewButtons), null, 100);    
};

DeviceView.prototype.updateViewButtons = function ()
{
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_AMBER);
};

DeviceView.prototype.setupFader = function (index)
{
    this.surface.setupFader (index, BITWIG_INDICATOR_COLORS[index]);
};

DeviceView.prototype.onFader = function (index, value)
{
    if (this.isParamMode)
        this.cursorDevice.setParameter (index, value);
    else
        this.cursorDevice.getMacro (index).getAmount ().set (value, Config.maxParameterValue);
};

DeviceView.prototype.updateSceneButtons = function (buttonID)
{
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE1, this.isParamMode ? LAUNCHPAD_COLOR_AMBER : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE2, !this.isParamMode ? LAUNCHPAD_COLOR_AMBER : LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE3, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE4, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE5, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE6, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE7, LAUNCHPAD_COLOR_BLACK);
    this.surface.setButton (LAUNCHPAD_BUTTON_SCENE8, LAUNCHPAD_COLOR_BLACK);
};

DeviceView.prototype.drawGrid = function ()
{
    for (var i = 0; i < 8; i++)
    {
        var param = this.isParamMode ? this.cursorDevice.getFXParam (i) : 
                                       this.cursorDevice.getMacroParam (i);
        this.surface.output.sendCC (LAUNCHPAD_FADER_1 + i, param.value);
    }
};

DeviceView.prototype.onGridNote = function (note, velocity)
{
};

DeviceView.prototype.onScene = function (scene, event)
{
    this.updateIndication ();
    
    if (!event.isDown ())
        return;
    
    switch (scene)
    {
        case 0:
            this.isParamMode = true;
            break;
        case 1:
            this.isParamMode = false;
            break;
    }
};

DeviceView.prototype.scrollUp = function (event)
{
};

DeviceView.prototype.scrollDown = function (event)
{
};

DeviceView.prototype.scrollLeft = function (event)
{
    this.cursorDevice.previousParameterPage ();
};

DeviceView.prototype.scrollRight = function (event)
{
    this.cursorDevice.nextParameterPage ();
};
