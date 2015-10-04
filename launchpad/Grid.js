// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

Grid.TRANSLATE_MATRIX =
[
    11, 12, 13, 14, 15, 16, 17, 18,
    21, 22, 23, 24, 25, 26, 27, 28,
    31, 32, 33, 34, 35, 36, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48,
    51, 52, 53, 54, 55, 56, 57, 58,
    61, 62, 63, 64, 65, 66, 67, 68,
    71, 72, 73, 74, 75, 76, 77, 78,
    81, 82, 83, 84, 85, 86, 87, 88
];


function Grid (output)
{
    this.output = output;

    // Note: The grid contains only 64 pads but is more efficient to use 
    // the 128 note values the pads understand
    this.currentButtonColors = initArray (LAUNCHPAD_COLOR_BLACK, 128);
    this.buttonColors = initArray (LAUNCHPAD_COLOR_BLACK, 128);
    this.currentBlinkColors = initArray (LAUNCHPAD_COLOR_BLACK, 128);
    this.blinkColors = initArray (LAUNCHPAD_COLOR_BLACK, 128);
    this.currentBlinkFast = initArray (false, 128);
    this.blinkFast = initArray (false, 128);
}

Grid.prototype.redraw = function ()
{
    for (var i = 0; i < this.currentButtonColors.length; i++)
        this.currentButtonColors[i] = -1;
};

Grid.prototype.light = function (note, color, blinkColor, fast)
{
    this.setLight (note, color, blinkColor, fast);
};

Grid.prototype.lightEx = function (x, y, color, blinkColor, fast)
{
    this.setLight (92 + x - 8 * y, color, blinkColor, fast);
};

Grid.prototype.setLight = function (index, color, blinkColor, fast)
{
    if (blinkColor)
    {
        this.buttonColors[index] = color;
        this.blinkColors[index] = blinkColor;
    }
    else
    {
        this.buttonColors[index] = color;
        this.blinkColors[index]  = LAUNCHPAD_COLOR_BLACK;
    }
    this.blinkFast[index] = fast;
};

Grid.prototype.flush = function ()
{
    for (var i = 36; i < 100; i++)
    {
        var baseChanged = false;
        if (this.currentButtonColors[i] != this.buttonColors[i])
        {
            this.currentButtonColors[i] = this.buttonColors[i];
            this.output.sendNote (this.translateToLaunchpad (i), this.buttonColors[i]);
            baseChanged = true;
        }
        // No "else" here: Blinking color needs a base color
        if (baseChanged || this.currentBlinkColors[i] != this.blinkColors[i] || this.currentBlinkFast[i] != this.blinkFast[i])
        {
            this.currentBlinkColors[i] = this.blinkColors[i];
            this.currentBlinkFast[i] = this.blinkFast[i];

            this.output.sendNote (this.translateToLaunchpad (i), this.currentButtonColors[i]);
            if (this.blinkColors[i] != LAUNCHPAD_COLOR_BLACK)
                this.output.sendSysex (SYSEX_HEADER + "23 " + toHexStr ([ this.translateToLaunchpad (i) ]) + " " + toHexStr ([ this.blinkColors[i] ]) + " F7");
        }
    }
};

Grid.prototype.turnOff = function ()
{
    for (var i = 36; i < 100; i++)
        this.light (i, LAUNCHPAD_COLOR_BLACK, null, false);
    this.flush ();
};

// Translates note range 36-100 to launchpad grid (11-18, 21-28, ...)
Grid.prototype.translateToLaunchpad = function (note)
{
    return Grid.TRANSLATE_MATRIX[note - 36];
};

// Translate from Launchpad grid to range 36-100
Grid.prototype.translateToGrid = function (note)
{
    return 36 + (Math.floor (note / 10) - 1) * 8 + (note % 10 - 1);
};

Scales.prototype.translateMatrixToGrid = function (matrix)
{
    var gridMatrix = this.getEmptyMatrix ();
    for (var i = 36; i < 100; i++)
        gridMatrix[Grid.TRANSLATE_MATRIX[i - 36]] = matrix[i];
    return gridMatrix;
};
