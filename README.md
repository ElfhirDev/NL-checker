# NL-checker

A Firebug checker for HTML Newsletter: only the good practices !
This checker may be not complete. I (We) can improve it !
Stable for static
Currently improved the Responsive checking

# Roadmap :

V2
-1 Add check for font-family wrong written, and colors too

V3 :
- 1 after activation with a shortcut, sizes of element on hover are displayed
- 2 adapt the script for being a real firefox plugin !

V4 :
- Propose to download an autocorrected file, nearly perfect.

## Version 1.9.2

-	checkVerticalSpacer() ; check for td height spacer without font-size:1px; line-height: 1px;

## Version 1.9.1

- Little improvement on displayTdAndImgSize()

## Version 1.9

- rewrite 20px blank security

## Version 1.8

- rewrite displayTdAndImgSize() for taking into account of parent's attribute center or middle

## Version 1.7.5

- Modify 20px check ; 1-index based error displaying

## Version 1.7

- Add Checking for wrong URL paramaters

- Cleaning, some little refactors

## Version 1.6

- Add *target='_blank'* checking, merging into section 1)

## Version 1.5

- 10) *DTD Strict*

- 11) *Meta Viewport*

- 12) 20px blank space security in *side-by-side* tables layout.

## Version 1.0

It checks on static NL:
- 1) The number of Links, Special Links (mirror page, anchor #) and Links with emailing tags.

- 2) The number of images called; thus, the number of images in your folder should match.

- 3) The declared size of td and img should match.

- 4) Images should have an alt defined, unless it is a "decoration" image, such as separator.

- 5) TD that contains a link with text inside should have Style.

- 6) Link style should have some properties defined : *color* and *text-decoration*.

- 7) Img should have *Display: block* and their TD should have no style.

- 8) Check for Table > tr > td size consistency.

- 9) Check if Table have the right attributes.

- 10) Check for td with height less than 20px have font-size:1px;line-height:1px; (Outlook)

- 11) 20px blank space security in *side-by-side* tables layout (bug Outlook)

## [Licence : Artistic-2.0] (http://opensource.org/licenses/Artistic-2.0)