// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Display Views
var VIEW_PLAY       = 0;
var VIEW_SESSION    = 1;
var VIEW_SEQUENCER  = 2;
var VIEW_DRUM       = 3;
var VIEW_RAINDROPS  = 4;
var VIEW_VOLUME     = 5;
var VIEW_PAN        = 6;
var VIEW_SENDS      = 7;
var VIEW_DEVICE     = 8;
var VIEW_BROWSER    = 9;
var VIEW_SHIFT      = 10;
var VIEW_DRUM4      = 11;
var VIEW_DRUM8      = 12;

load ("AbstractViewExtensions.js");
load ("AbstractSequencerViewExtensions.js");
load ("AbstractDrumViewExtensions.js");
load ("PlayView.js");
load ("SessionView.js");
load ("SequencerView.js");
load ("DrumView.js");
load ("DrumView4.js");
load ("DrumView8.js");
load ("RaindropsView.js");
load ("AbstractFaderView.js");
load ("VolumeView.js");
load ("PanView.js");
load ("SendsView.js");
load ("DeviceView.js");
load ("BrowserView.js");
load ("ShiftView.js");
