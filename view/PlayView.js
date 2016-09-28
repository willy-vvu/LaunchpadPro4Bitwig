// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayView (model)
{
    if (model == null)
        return;
    
    AbstractPlayView.call (this, model);
}
PlayView.prototype = new AbstractPlayView ();

PlayView.prototype.onActivate = function ()
{
    this.surface.setLaunchpadToPrgMode ();

    AbstractPlayView.prototype.onActivate.call (this);

    this.surface.setButton (LAUNCHPAD_BUTTON_SESSION, LAUNCHPAD_COLOR_GREY_LO);
    this.surface.setButton (LAUNCHPAD_BUTTON_NOTE, LAUNCHPAD_COLOR_OCEAN_HI);
    this.surface.setButton (LAUNCHPAD_BUTTON_DEVICE, LAUNCHPAD_COLOR_GREY_LO);

    this.updateSceneButtons ();
    this.updateIndication ();
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

PlayView.prototype.updateArrowStates = function ()
{
    var octave = this.scales.getOctave ();
    this.canScrollUp = octave < 3;
    this.canScrollDown = octave > -3;
    var scale = this.scales.getSelectedScale ();
    this.canScrollLeft = scale > 0;
    this.canScrollRight = scale < Scales.INTERVALS.length - 1;
};

PlayView.prototype.updateSceneButtons = function (buttonID)
{
    if (this.model.canSelectedTrackHoldNotes ())
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

PlayView.prototype.onScene = function (scene, event)
{
    if (!event.isDown ())
        return;
    if (!this.model.canSelectedTrackHoldNotes ())
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
