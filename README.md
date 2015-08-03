# NL-checker

- Version 1.5
Stable for static
Currently improved the Responsive checking

A Firebug checker for HTML Newsletter: only the good practices !


This checker may be not complete. I (We) can improve it !

It checks on static NL:
  1) The number of Links, Special Links (mirror page, anchor #) and Links with emailing tags.

  2) The number of images called; thus, the number of images in your folder should match.

  3) The declared size of td and img should match.

  4) Images should have an alt defined, unless it is a "decoration" image, such as separator.

  5) TD that contains a link with text inside should have Style.

  6) Link style should have some properties defined : color and text-decoration.

  7) Img should have Display: block and their TD should have no style.

  8) Check for Table > tr > td size consistency.

  9) Check if Table have the right attributes.

It checks on RWD NL:

The same as above plus :

10) DTD Strict

11) Meta Viewport

12) 20px blank space security in side-by-side tables layout.


Licence : Artistic-2.0.
