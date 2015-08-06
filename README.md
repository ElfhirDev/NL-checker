# NL-checker

A Firebug checker for HTML Newsletter: only the good practices !
This checker may be not complete. I (We) can improve it !
Stable for static
Currently improved the Responsive checking

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

## [Licence : Artistic-2.0] (http://opensource.org/licenses/Artistic-2.0)