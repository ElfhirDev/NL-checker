/**
 * checker.js
 * Creator : Jérémy Ta
 * Company : Datawords
 * License : Artistic-2.0 (PERL)
 * Url License	http://opensource.org/licenses/Artistic-2.0
 * Version : 1.0
 * Usage : Auto check if a Newletter is valid among the criteria chosen.
 *
 */
/*

Include these tags at the end of the Body

<!-- Experimental -->
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="./js/checker.js"></script>

<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="//C:/Users/jta/Work/Perso/checker/checker.js"></script>

*/
// Globals
var Checker = Checker || {};


// Local file call is better
/*
$(document).ready(function() {
	var options = {
		vars_tracking : "utm_source=neolane&utm_medium=emailing_internal&utm_campaign=campaign_name",
		verbose : false
	};
	Checker.init(options);
});
*/


// this
Checker = {
	init : function(options) {
		console.info("init Checker");
		this.checkReporting(options);

	},

	/**
	 * Display reporting of the check, in console
	 * @return void
	 */
	checkReporting : function(options) {
		console.group("1) Links and Tag");
		console.info("Tag Tracking '"+options.vars_tracking+"'");
		console.log("Count " + this.countSpecialLink() + " special links <a> times.");
		console.log("Count " + this.countTagTracking(options.vars_tracking) +" Tag Tracking times.");
		console.log("Count " + this.countLink() + " Links <a> times.");
		console.groupEnd();

		console.group("2) Table Tr Td img");
		console.info("Count");
		console.log("<table> : "+ this.countTable() +" times");
		console.log("<tr> : "+ this.countTr() +" times");
		console.log("<td> : "+ this.countTd() +" times");
		console.log("There are : "+ this.countImg(options) +" different images ; check your folder for the unused one!");
		console.groupEnd();

		console.group("3) Td & img sizes");
		console.info("td should have the same size as their img content");
		this.displayTdAndImgSize(options);
		console.groupEnd();

		console.group("4) img alt");
		console.info("img should have an alt defined, unless it is a decoration, separator, blank space");
		this.checkImgAlt();
		console.groupEnd();

		console.group("5) td > a style");
		console.info("td with link and text should have style");
		this.checkTdStyle();
		console.groupEnd();

		console.group("6) a style");
		console.info("link should have text-decoration and color defined");
		this.checkLinkStyle();
		console.groupEnd();

		console.group("7) td > img style");
		console.info("td with img should have no style ; and img should have display:block");
		this.checkTdImgStyle();
		console.groupEnd();

		console.group("8) table > tr > td size");
		console.warn("This check may be not reliable yet for deep table structure. Check yourself !");
		console.info("all td width sum up should fit the table ; we assume tr is fitting the table");
		this.checkTableSize(options);
		console.groupEnd();

		console.group("9) table");
		console.info("all table should have cellpadding='0' cellspacing='0' border='0'");
		this.checkTableStyle(options);
		console.groupEnd();

	},

	/**
	 * count the number of image, without repetition
	 * @return integer
	 */
	countImg : function(options) {
		var count = 0;
		var imgsrc = [];
		var cursrc = "";

		$('img').each(function(index) {
			cursrc = $(this).attr("src");

			if (-1 === ($.inArray(cursrc, imgsrc))) {

				imgsrc.push(cursrc);
				count++;
			}

			cl(count +"   "+ cursrc);

		});

		return count;
	},

	/**
	 * display when a table does not have mandatory attributes :
	 * cellpadding="0" cellspacing="0" border="0"
	 * @return void
	 */
	checkTableStyle : function(options) {
		$("table").each(function(index) {
			if ($(this).attr("cellpadding") == undefined || $(this).attr("cellpadding") != 0 ) {
				console.warn("table "+index+" : cellpadding missing or not 0.");
			}
			if ($(this).attr("cellspacing") == undefined || $(this).attr("cellspacing") != 0 ) {
				console.warn("table "+index+" : cellspacing missing or not 0.");
			}
			if ($(this).attr("border") == undefined || $(this).attr("border") != 0 ) {
				console.warn("table "+index+" : border missing or not 0.");
			}
		});
	},

	/**
	 * display when a table does have td with not good size
	 * tr have no size
	 * @return void
	 */
	checkTableSize : function(options) {
		var tables = {};
		var tds_width = 0;

		var table_height = 0;


		$("table").each(function(index) {
			// don't check global or responsive table, for the moment
			if ($(this).attr("width") !== "100%") {
				tables[index] = {
					'width': $(this).attr("width"),
					'tr': {
						"length" : $(this).children().children().length
					},
					'td': {
						"length" : $(this).children().children().children().length
					}
				};

			}
		});

		$("table").each(function(index) {
			if ($(this).attr("width") !== "100%") {

				// table with one tr
				if (tables[index]["tr"]["length"] == 1) {

					// td
					$($(this).children().children().children()).each(function(i) {
						if ($(this).attr("width") != "" || $(this).attr("width") != undefined) {
							tds_width += parseInt($(this).attr("width"));
						}
						else {
							console.warn("attr width not declared ; assume $(selector).width()");
							tds_width += parseInt($(this).width());
						}
					});

					tables[index]["td_per_tr_width"] = tds_width;
					tds_width = 0;
				}

				else {

					// tr
					$($(this).children().children()).each(function(i) {

						// td
						$($(this).children()).each(function(j) {

							if ($(this).attr("width") != "" || $(this).attr("width") != undefined || $(this).attr("width") == "100%") {
								tds_width += parseInt($(this).attr("width"));
							}
							else {
								console.warn("attr width not declared ; assume $(selector).width()");
								tds_width += parseInt($(this).width());
							}
						});

						tables[index]["tr"]["tr_"+i] = tds_width;

						tds_width = 0;
					});

					var average = 0;
					for (var i = 0, l = tables[index]["tr"]["length"]; i < l; i++) {
						average += parseFloat(tables[index]["tr"]["tr_"+i]);
					}

					tables[index]["td_per_tr_width"] = parseFloat(average / parseInt(tables[index]["tr"]["length"]));

				}

			}
		});

		//console.dir(tables);

		$.each(tables, function(index, value) {
			console.group("Table "+index+ " of width='"+value.width+"'");

			if ( value["width"] != value["td_per_tr_width"]) {
				console.warn("has "+value.tr["length"]+" tr, with width about "+ value["td_per_tr_width"]);
			}
			else {
				console.info("has "+value.tr["length"]+" tr, with width about "+ value["td_per_tr_width"]);
			}

			console.groupEnd();
		});

	},

	/**
	 * count the number of <a>
	 * @return integer
	 */
	countTagTracking : function(vars_tracking) {
		var count = 0;
		$("a").each(function(index) {

			var rg_vars_tracking = new RegExp(vars_tracking);

			if (rg_vars_tracking.test($(this).attr("href"))) {
				++count;
			}
		});
		return count;
	},

	/**
	 * count the number of <a>
	 * @return integer
	 */
	countLink : function() {
		return $("a").length;
	},

	/**
	 * display width and height of img and its td container
	 * @return void
	 */
	displayTdAndImgSize : function(options) {
		var warning = false;
		$("img").each(function(index)  {

			if (options.verbose === true) {
				console.info("img src : " +$(this).attr("src")+ " & alt : " + $(this).attr("alt"));
			}

			if ($(this).parent().get(0).tagName == "A") {
				if (options.verbose === true) {
					console.log(index + " : td width = " + $(this).parent().parent().attr("width") +  " & height = " + $(this).parent().parent().attr("height") );
					console.log(index + " : img width = " + $(this).attr("width") +  " & height = " + $(this).attr("height"));
				}
				if ($(this).parent().parent().attr("width") !== $(this).attr("width") || $(this).parent().parent().attr("height") !== $(this).attr("height")) {
					warning = true;
				}
			}
			else if ($(this).parent().get(0).tagName == "TD") {
				if (options.verbose === true) {
					console.log(index + " : td width = " + $(this).parent().attr("width") +  " & height = " + $(this).parent().attr("height") );
					console.log(index + " : img width = " + $(this).attr("width") +  " & height = " + $(this).attr("height"));
				}
				if ($(this).parent().attr("width") !== $(this).attr("width") || $(this).parent().attr("height") !== $(this).attr("height")) {
					warning = true;
				}
			}

			if (warning) {
				console.warn("size differs or undefined for img " + index +", with src : "+ $(this).attr("src") );
				warning = false;
			}
		});
	},

	/**
	 * display alt for img
	 * @return void
	 */
	checkImgAlt : function() {
		$("img").each(function(index)  {
			if ($(this).attr("alt") === "" || $(this).attr("alt") === undefined) {
				console.warn("index " +index + " img src : " +$(this).attr("src"));
			}
		});
	},

	/**
	 * display if a Link has no color and text-decoration
	 * @return void
	 */
	checkLinkStyle : function() {
		var cssText;
		var rg_img = new RegExp("<img");
		var rg_text_decoration = new RegExp("text-decoration");
		var rg_color = new RegExp("color");

		$("a").each(function(index)  {

			if (!rg_img.test($(this).html())) {

				cssText = $(this).get(0).style.cssText;

				if (!rg_text_decoration.test(cssText)) {
					console.group("index " +index + " a : " +$(this).html());
					console.info("Text Decoration missing ?");
					console.warn(cssText);
					console.log(" ");
					console.groupEnd();
				}

				if (!rg_color.test(cssText)) {
					console.group("index " +index + " a : " +$(this).html());
					console.info("Color");
					console.warn(cssText);
					console.log(" ");
					console.groupEnd();
				}
			}
		});
	},

	/**
	 * display if a TD containing a link text have a the style
	 * @return void
	 */
	checkTdStyle : function() {

		var rg_img = new RegExp("<img");
		var rg_font_family = new RegExp("font-family");
		var rg_font_size = new RegExp("font-size");
		var rg_line_height = new RegExp("line-height");
		var rg_text_decoration = new RegExp("text-decoration");
		var rg_color = new RegExp("color");

		var cssText = "";
		$("a").each(function(index)  {

			if (!rg_img.test($(this).html())) {

				cssText = $(this).parent().get(0).style.cssText;

				var fontSize = $(this).parent().get(0).style.fontSize.replace(/px/g, '');
				var lineHeight = $(this).parent().get(0).style.lineHeight.replace(/px/g, '');
				var diff = (parseFloat(lineHeight) - parseFloat(fontSize));
				if (diff < 2) {
					console.group("index " +index + " a : " +$(this).html());
					console.warn("index " +index + " a : " + $(this).html() + " should have a line-height 2px higher than font-size minimum !");
					console.groupEnd();
				}

				if (!rg_font_family.test(cssText)) {
					console.group("index " +index + " a : " +$(this).html());
					console.info("Font Family missing ?");
					console.warn(cssText);
					console.log(" ");
					console.groupEnd();
				}

				if (!rg_font_size.test(cssText)) {
					console.group("index " +index + " a : " +$(this).html());
					console.info("Font Size missing ?");
					console.warn(cssText);
					console.log(" ");
					console.groupEnd();
				}

				if (!rg_line_height.test(cssText)) {
					console.group("index " +index + " a : " +$(this).html());
					console.info("Line Height missing ?");
					console.warn(cssText);
					console.log(" ");
					console.groupEnd();
				}

				if (!rg_text_decoration.test(cssText)) {
					console.group("index " +index + " a : " +$(this).html());
					console.info("Text Decoration missing ?");
					console.warn(cssText);
					console.log(" ");
					console.groupEnd();
				}

				if (!rg_color.test(cssText)) {
					console.group("index " +index + " a : " +$(this).html());
					console.info("Color missing ?");
					console.warn(cssText);
					console.log(" ");
					console.groupEnd();
				}
			}
		});
	},

	/**
	 * display if a TD containing an img and link have a no style ; and img have
	 * display:block;
	 * @return void
	 */
	checkTdImgStyle : function() {

		var cssText = "";
		// maybe the regex is not 100% efficient (because of blank space)
		var rg_display_block = new RegExp("display: block;");

		$("img").each(function(index) {
			console.group(index);

			if (!rg_display_block.test($(this).get(0).style.cssText)) {
				console.warn("img src : "+ $(this).attr("src") +" should have style display block;");
			}

			if ($(this).attr("border") === undefined) {
				console.warn("img src : "+ $(this).attr("src") +" should have style border=0, or defined at least");
			}

			// td > img
			if ($(this).parent().get(0).tagName == "TD") {
				if ($(this).parent().get(0).style.cssText !== "") {
					console.warn("td with img "+ $(this).attr("src") +" should not have any style");
				}
			}

			// td > a > img
			if ($(this).parent().parent().get(0).tagName == "TD") {
				if ($(this).parent().parent().get(0).style.cssText !== "") {
					console.warn("td with img "+ $(this).attr("src") +" should not have any style");
				}
			}
			console.groupEnd();
		});
	},


	/**
	 * count the number of <table>
	 * @return integer
	 */
	countTable : function() {
		return $("table").length;
	},

	/**
	 * count the number of <table>
	 * @return integer
	 */
	countTr : function() {
		return $("tr").length;
	},


	/**
	 * count the number of <table>
	 * @return integer
	 */
	countTd : function() {
		return $("td").length;
	},


	/**
	 * count the number of <a> special (mailto, mirror, unsuscribe, etc)
	 * @return integer
	 */
	countSpecialLink : function() {
		var count = 0;
		$("a").each(function(index)  {

			var rg_mailto = new RegExp("mailto:");
			var rg_include = new RegExp("<%@ include");
			var rg_hash = new RegExp("^#");

			if (rg_mailto.test($(this).attr("href")) || rg_include.test($(this).attr("href")) || rg_hash.test($(this).attr("href"))) {
				++count;
			}
		});
		return count;
	}

};

// Aliases
function dbg(arg) {
	console.info(typeof arg);
	console.log(arg);
	console.dir(arg);
}

function cl(arg) {
	console.log(arg);
}

function ci(arg) {
	console.info(arg);
}