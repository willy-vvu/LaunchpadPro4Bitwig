// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function Controller ()
{
    Config.init ();

    var output = new MidiOutput ();
    output.setShouldSendMidiBeatClock (true);    
    var input = new LaunchpadMidiInput ();

    this.scales = new Scales (36, 100, 8, 8);
    this.model = new Model (-1, this.scales, 8, 8, 8, 6, 16, 16, true);

    this.model.getTrackBank ().addTrackSelectionListener (doObject (this, Controller.prototype.handleTrackChange));
    
    this.surface = new LaunchpadPro (output, input);
    
    this.surface.setLaunchpadToStandalone ();
    
    this.surface.addViewChangeListener (doObject (this, function (prevViewID, viewID)
    {
        this.surface.pads.redraw ();
    }));
    
    Config.addPropertyListener (Config.SCALES_SCALE, doObject (this, function ()
    {
        this.scales.setScaleByName (Config.scale);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_BASE, doObject (this, function ()
    {
        this.scales.setScaleOffsetByName (Config.scaleBase);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_IN_KEY, doObject (this, function ()
    {
        this.scales.setChromatic (!Config.scaleInKey);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_LAYOUT, doObject (this, function ()
    {
        this.scales.setScaleLayoutByName (Config.scaleLayout);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
    
    this.surface.addView (VIEW_PLAY, new PlayView (this.model));
    this.surface.addView (VIEW_SESSION, new SessionView (this.model));
    this.surface.addView (VIEW_SEQUENCER, new SequencerView (this.model));
    this.surface.addView (VIEW_DRUM, new DrumView (this.model));
    this.surface.addView (VIEW_DRUM4, new DrumView4 (this.model));
    this.surface.addView (VIEW_DRUM8, new DrumView8 (this.model));
    this.surface.addView (VIEW_RAINDROPS, new RaindropsView (this.model));
    this.surface.addView (VIEW_VOLUME, new VolumeView (this.model));
    this.surface.addView (VIEW_PAN, new PanView (this.model));
    this.surface.addView (VIEW_SENDS, new SendsView (this.model));
    this.surface.addView (VIEW_DEVICE, new DeviceView (this.model));
    this.surface.addView (VIEW_BROWSER, new BrowserView (this.model));
    this.surface.addView (VIEW_SHIFT, new ShiftView (this.model));
    
    scheduleTask (doObject (this, function ()
    {
        this.surface.setActiveView (VIEW_PLAY);
    }), null, 100);
}
Controller.prototype = new AbstractController ();

Controller.prototype.handleTrackChange = function (index, isSelected)
{
    if (!isSelected)
        return;
    
    // Recall last used view (if we are not in session mode)
    var activeView = this.surface.getActiveView ();
    if (activeView == null || activeView.isNoteViewActive ())
    {
        var viewID = this.model.getCurrentTrackBank ().getPreferredView (index);
        this.surface.setActiveView (viewID == null ? VIEW_PLAY : viewID);
    }
    if (this.surface.isActiveView (VIEW_PLAY))
        this.surface.getActiveView ().updateNoteMapping ();
     
    // Reset drum octave because the drum pad bank is also reset
    this.scales.setDrumOctave (0);
    this.surface.getView (VIEW_DRUM).updateNoteMapping ();
};
