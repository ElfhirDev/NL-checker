NL-checker
==========

#### What it is ?
This script aims to help you create HTML Newsletters
that will have the best qualities : cross-browsers code, W3C compliance,
Responsive web design and static best practices.

#### How does it work ?
It will help you on searching what it is missing in the code you are inspecting. See at the *Version 1.0* what it is mainly checked.
It will display in your web console (**firebug**) what it is missing, where it is missing, and informations about choices you or someone has made in the Newsletter.

#### Is it safe ?
**Version 2.0** and before needs you to add a script at the end of your HTML code ; you used to modify yourself your "tracking code" (url parameters as Google Analytics *utm_campaign*), and of course, if you forget to remove it before giving your works to other people in your team, it's a little bit messy (not really a bug that will crash software).

In the future **version 3.0**, it will be fully used in a User Script (with **GreaseMonkey**), and right now in **version 2.1** it is already testing in GreaseMonkey. Thus, it will not pollute your code anymore !

#### Is it trustworthy ?
Even if it is a wonderful tool, that I have been developing across more than 20 Newsletters,
sometimes you will have to inspect yourself your code, because :

- It inspect the HTML rendering ; browser add tbody element, auto-close html tag you forget (in the way it thinks it good.

- font-families are sometimes wrongly written, forgotten line-heights are sometimes auto-calculating

- It will not say if your image name respect your enterprise convention

- It has to be improved if I forgotten some edge cases.

#### How can I install it ?
I developed using Firefox only. I don't know how it works in Google Chrome, Safari, Opera, IE, I don't care for it. I will look in the future how to improve the Cross-Browser feature.
###### Version >= 2.3

1. Environment

You will need a **Firefox + Firebug + GreaseMonkey** environment.

Installs these plugins if not already there ; I always used the most up-to-date one :
https://addons.mozilla.org/fr/firefox/addon/firebug/
https://addons.mozilla.org/fr/firefox/addon/greasemonkey/

2. User Script

Go on : https://gist.github.com/Elfhir/a0d77af0497fa46b1e86#file-checker-user-js
And click on "raw" button. A *GreaseMonkey* window will prompt and ask you if you want
to install the user script. Install Now.

You can manage user script with *GreaseMonkey* here at Firefox url : *about:addons*

3. Settings

The script intends to run on localhost urls :
- http://127.0.0.1:8091/nl/*
- http://127.0.0.1:8080/nl/*
- http://127.0.0.1/nl/*
- http://localhost/nl/*

Are the one that I have set up. You should have the same process as me, using a localhost WAMP (or LAMP or others, I recommend **Bitnami** stacks : https://bitnami.com/stacks), because GreaseMonkey user script can't inspect locale file (Such as "file//Users/Name/NL/NL01/index.html"), because of security policy.

I have no other idea right now about other way, so if you wants other URLs to run with, open an issue in the *Github Repository of this project*.

Your Newsletters must be in the **nl** folders.

###### Version < 2.1

Copy the file *checker.js* in your computer.
In this file, copy line between 19 and 36 at the end of the body of your HTML Newsletter, and change the **"NAME/PATH_TO_THE_FILE"** for your case


> <script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
> <script src="//C:/Users/NAME/PATH_TO_THE_FILE/checker.js"></script>

and :

```
<script>
    // Local file call is better
    
    $(document).ready(function() {
    	var options = {
    		vars_tracking : "utm_source=neolane&utm_medium=emailing_internal&utm_campaign=campaign_name",
    		strict : false,
    		verbose : false,
    		responsive : false,
    		target_blank : false
    	};
    	Checker.init(options);
    });
    
</script>
```

#### How can I use it ?

Go on your HTML Newsletter page, open firebug, go to Console tab.
You will see ConsoleGroup and infos
######Version >= 2.1
At first initialisation, the script will prompt you windows about your Tracking Code, the Strictness level of you inspection, if the NL should be Responsive, if it should have Target Blank on link, etc ...
Fill it with precision.
Close the tab or press "|" (pipe) for reset the process.
######Version < 2.1
The same things have to be filled in the script code added at the end of your HTML.

# Roadmap :
The main ideas are :
V3 : 
- stable GreaseMonkey user script
V4 :
- adapt the script for being a real firefox plugin !
V5 :
- Propose to download an autocorrected file, nearly perfect.

# Versions

## Version 2.3

- GreaseMonkey user script : Rewrite test because sessionStorage use strings

## Version 2.2

- GreaseMonkey user script : Add location.reload() for reset ; add documentation

## Version 2.1

- GreaseMonkey user script created

## Version 2.0

- Cleaning, secure features

## Version 1.9.3

- wrongTagTracking() improve for detecting repetition of tag

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
