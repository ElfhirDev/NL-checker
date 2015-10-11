// ==UserScript==
// @name        NL-Checker User Script
// @namespace   NL-Checker
// @description Script de vérifications Newsletter HTML
// @icon        https://github.com/Elfhir/NL-checker/tree/master/GreaseMonkey/skin/logo.png
// @downloadURL https://github.com/Elfhir/NL-checker/blob/master/GreaseMonkey/checker.user.js
// @version     2.1
// @grant       none
// @require     http://code.jquery.com/jquery-1.11.3.min.js
// @include     http://127.0.0.1:8080/nl/*
// @include     http://127.0.0.1/nl/*
// @include     http://localhost/nl/*
// ==/UserScript==

// Globals
var Checker = Checker || {};

"use strict";
// this
Checker = {
	init : function(options) {
		console.info("init Checker");
		Checker.initGreaseMonkey(options);
		if (options.responsive) {
			Checker.checkResponsive(options);
		}
		else {
			Checker.checkReporting(options);
		}
		Checker.resetGreaseMonkey(options);
	},

	initGreaseMonkey : function(options) {
		console.info("Press pipe (\"|\" to reset the settings, or close the tab.")
			if (!sessionStorage.getItem("NL-init")) {

				console.info("first init");
				options.vars_tracking = window.prompt("Enter vars_Tracking", "utm_source=neolane&utm_medium=emailing_internal&utm_campaign=campaign_name");
				sessionStorage.setItem("vars_tracking", options.vars_tracking);

				options.responsive = window.prompt("Enter if the NL is responsive (false or true) :", false);
				sessionStorage.setItem("responsive", options.responsive);

				options.target_blank = window.prompt("Enter if target blank is required (false or true) :", false);
				sessionStorage.setItem("target_blank", options.target_blank);

				options.strict = window.prompt("Do you want very strict verification (false or true) ?", false);
				sessionStorage.setItem("strict", options.strict);

				options.verbose = window.prompt("Do you want a more verbose displaying (false or true) ?", false);
				sessionStorage.setItem("verbose", options.verbose);

				sessionStorage.setItem("NL-init", "initialized");
			}
			else {
				options.vars_tracking = sessionStorage.getItem("vars_tracking");
				options.responsive = sessionStorage.getItem("responsive");
				options.target_blank = sessionStorage.getItem("target_blank");
				options.strict = sessionStorage.getItem("strict");
				options.verbose = sessionStorage.getItem("verbose");
			}
		},

		resetGreaseMonkey : function(options) {
			$(document).on("keydown", function(event) {
				if (event.which === 54) {
					sessionStorage.removeItem("NL-init");
					sessionStorage.removeItem("vars_tracking");
					sessionStorage.removeItem("responsive");
					sessionStorage.removeItem("target_blank");
					sessionStorage.removeItem("strict");
					sessionStorage.removeItem("verbose");
				}
			});
		},

	/**
	 * Display reporting of the check, in console
	 * @return void
	 */
	 checkReporting : function(options) {
	 	console.group("1) Links and Tag");
	 	console.info("Tag Tracking '"+options.vars_tracking+"'");
	 	console.log("Count " + Checker.countSpecialLink() + " special links <a> times.");
	 	console.log("Count " + Checker.countTagTracking(options) +" Tag Tracking times.");
	 	console.log("Count " + Checker.countLink() + " Links <a> times.");
	 	Checker.wrongTagTracking(options);

	 	if (options.target_blank) {
	 		console.group("Target Blank");
	 		console.log("Count " + Checker.countTargetBlank().count + " Links with target='_blank', important for Biotherm or Lancôme NLs.");
	 		console.log("Link(s) one-based index missing are " + Checker.countTargetBlank().missing_index);
	 		console.groupEnd();
	 	}

	 	console.groupEnd();

	 	console.group("2) Table Tr Td img");
	 	console.info("Count");
	 	console.log("<table> : "+ Checker.countTable() +" times");
	 	console.log("<tr> : "+ Checker.countTr() +" times");
	 	console.log("<td> : "+ Checker.countTd() +" times");
	 	console.groupCollapsed("<img> click to open");
	 	console.log("There are : "+ Checker.countImg(options) +" different images ; check your folder for the unused one!");
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("3) Td & img sizes");
	 	console.info("td should have the same size as their img content");
	 	console.groupCollapsed("<td> with <img> that size differs : click to open");
	 	Checker.displayTdAndImgSize(options);
	 	console.groupEnd();
	 	console.groupEnd();


	 	console.group("4) img alt");
	 	console.info("img should have an alt defined, unless it is a decoration, separator, blank space");
	 	console.groupCollapsed("<img> with no alt defined : click to open");
	 	Checker.checkImgAlt();
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("5) td > a style");
	 	console.info("td with link and text should have style");
	 	console.groupCollapsed("<td> with style missing : click to open");
	 	Checker.checkTdStyle(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("6) a style");
	 	console.info("link should have text-decoration and color defined");
	 	console.groupCollapsed("<a> with style missing : click to open");
	 	Checker.checkLinkStyle();
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("7) td > img style");
	 	console.info("td with img should have no style ; and img should have display:block");
	 	console.groupCollapsed("click to open");
	 	Checker.checkTdImgStyle(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("8) table > tr > td size");
	 	console.info("all td width sum up should fit the table ; we assume tr is fitting the table");
	 	console.groupCollapsed("click to open");
	 	Checker.checkTableSize(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("9) table");
	 	console.info("all table should have cellpadding='0' cellspacing='0' border='0'");
	 	console.groupCollapsed("click to open");
	 	Checker.checkTableStyle(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("10) vertical spacer ");
	 	console.info("td spacer with height less than 20px should have font-size:1px; line-height:1px;");
	 	console.groupCollapsed("click to open");
	 	Checker.checkVerticalSpacer(options);
	 	console.groupEnd();
	 	console.groupEnd();


	 },

	/**
	 * Check for NL Responsive specific rules
	 *
	 */
	 checkResponsive : function(options) {
	 	console.group("Check Responsive");
	 	console.group("1) DTD strict, Links, Tag, and Meta (viewport)");
	 	console.groupCollapsed("click to open");
	 	console.info("Tag Tracking '"+options.vars_tracking+"'");

	 	console.log("Count " + Checker.countSpecialLink() + " special links <a> times.");
	 	console.log("Count " + Checker.countTagTracking(options) +" Tag Tracking times.");
	 	console.log("Count " + Checker.countLink() + " Links <a> times.");
	 	Checker.wrongTagTracking(options);

	 	if (options.target_blank) {
	 		console.group("Target Blank");
	 		console.log("Count " + Checker.countTargetBlank().count + " Links with target='_blank', important for Biotherm or Lancôme NLs.");
	 		console.log("Link(s) one-based index missing are " + Checker.countTargetBlank().missing_index);
	 		console.groupEnd();
	 	}

	 	Checker.checkDTD(options);
	 	Checker.checkMeta(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("2) Table Tr Td img");
	 	console.groupCollapsed("<img> click to open");
	 	console.info("Count");
	 	console.log("<table> : "+ Checker.countTable() +" times");
	 	console.log("<tr> : "+ Checker.countTr() +" times");
	 	console.log("<td> : "+ Checker.countTd() +" times");
	 	console.log("There are : "+ Checker.countImg(options) +" different images ; check your folder for the unused one!");
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("3) Td & img sizes");
	 	console.info("td should have the same size as their img content");
	 	console.groupCollapsed("<td> with <img> that size differs : click to open");
	 	Checker.displayTdAndImgSize(options);
	 	console.groupEnd();
	 	console.groupEnd();


	 	console.group("4) img alt");
	 	console.info("img should have an alt defined, unless it is a decoration, separator, blank space");
	 	console.groupCollapsed("<img> with no alt defined : click to open");
	 	Checker.checkImgAlt();
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("5) td > a style");
	 	console.info("td with link and text should have style");
	 	console.groupCollapsed("<td> with style missing : click to open");
	 	Checker.checkTdStyle(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("6) a style");
	 	console.info("link should have text-decoration and color defined");
	 	console.groupCollapsed("<a> with style missing : click to open");
	 	Checker.checkLinkStyle();
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("7) td > img style");
	 	console.info("td with img should have no style ; and img should have display:block");
	 	console.groupCollapsed("click to open");
	 	Checker.checkTdImgStyle(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("8) table > tr > td size");
	 	console.info("all td width sum up should fit the table ; we assume tr is fitting the table");
	 	console.groupCollapsed("click to open");
	 	Checker.checkTableSize(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("9) table");
	 	console.info("all table should have cellpadding='0' cellspacing='0' border='0'");
	 	console.groupCollapsed("click to open");
	 	Checker.checkTableStyle(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("10) blank 20px security");
	 	console.groupCollapsed("click to open");
	 	Checker.rwd_blank_security_NL(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 	console.group("11) vertical spacer ");
	 	console.info("td spacer with height less than 20px should have font-size:1px; line-height:1px;");
	 	console.groupCollapsed("click to open");
	 	Checker.checkVerticalSpacer(options);
	 	console.groupEnd();
	 	console.groupEnd();

	 },

	 checkVerticalSpacer : function (options) {
	 	$("td").each(function(index) {
	 		if ($(this).get(0) != undefined) {
	 			if ( $(this).get(0).innerHTML == "&nbsp;") {

	 				if ($(this).attr("height") != undefined ) {
	 					if ($(this).attr("height") <= 20) {
	 						if ($(this).get(0).style.fontSize != "1px") {
	 							console.warn("td " + parseInt(index +1, 10) + " height : " + $(this).attr("height") + " px is missing font-size:1px;");
	 						}
	 						if ($(this).get(0).style.lineHeight != "1px") {
	 							console.warn("td " + parseInt(index +1, 10) + " height : " + $(this).attr("height") + " px is missing line-height:1px;");
	 						}
	 					}
	 				}
	 				else {
	 					if ($(this).height()<= 20) {
	 						if ($(this).attr("height") <= 20) {
	 							if ($(this).get(0).style.fontSize != "1px") {
	 								console.warn("td " + parseInt(index +1, 10) + " height : " + $(this).attr("height") + " px is missing font-size:1px;");
	 							}
	 							if ($(this).get(0).style.lineHeight != "1px") {
	 								console.warn("td " + parseInt(index +1, 10) + " height : " + $(this).attr("height") + " px is missing line-height:1px;");
	 							}
	 						}
	 					}
	 				}

	 			}
	 		}
	 	});
},

checkDTD : function(options) {
	var dtd = {};
	dtd.dtd = document.doctype;
	dtd.name = document.doctype.name;
	dtd.publicId = document.doctype.publicId;
	dtd.systemId = document.doctype.systemId;

		// html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
		if ((dtd.name != "html") || (dtd.publicId != "-//W3C//DTD XHTML 1.0 Strict//EN") || (dtd.systemId != "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd")) {
			console.warn("DTD not correct !");
			console.log("<!DOCTYPE " + dtd.name + " PUBLIC \"" + dtd.publicId + "\" \"" + dtd.systemId + "\">");
			console.info("DTD should be : ");
			console.log('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
		}
	},


	checkMeta: function(options) {
		$("meta").each(function() {
			if (this.name == "viewport") {
				console.info(this);
			}
			else {
				console.log(this);
			}
		});
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
	 			console.warn("table "+parseInt(index +1, 10)+" : cellpadding missing or not 0.");
	 		}
	 		if ($(this).attr("cellspacing") == undefined || $(this).attr("cellspacing") != 0 ) {
	 			console.warn("table "+parseInt(index +1, 10)+" : cellspacing missing or not 0.");
	 		}
	 		if ($(this).attr("border") == undefined || $(this).attr("border") != 0 ) {
	 			console.warn("table "+parseInt(index +1, 10)+" : border missing or not 0.");
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
							tds_width += parseInt($(this).attr("width"), 10);
						}
						else {
							console.warn("attr width not declared ; assume $(selector).width()");
							tds_width += parseInt($(this).width(), 10);
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
								tds_width += parseInt($(this).attr("width"), 10);
							}
							else {
								console.warn("attr width not declared ; assume $(selector).width()");
								tds_width += parseInt($(this).width(), 10);
							}
						});

						tables[index]["tr"]["tr_"+i] = tds_width;

						tds_width = 0;
					});

					var average = 0;
					for (var i = 0, l = tables[index]["tr"]["length"]; i < l; i++) {
						average += parseFloat(tables[index]["tr"]["tr_"+i], 10);
					}

					tables[index]["td_per_tr_width"] = parseFloat(average / parseInt(tables[index]["tr"]["length"], 10), 10);

				}

			}
		});

		//console.dir(tables);

		$.each(tables, function(index, value) {
			var ondex = parseInt(parseInt(index) + 1);
			console.group("Table "+ ondex + " of width='"+value.width+"'");

			if (options.responsive) {
				if ( value["width"] == 1 && value["height"] == 1) {
					console.warn(" ------######## Table with the 1px² technics is dangerous #######------")
				}
				else {
					console.info("has "+value.tr["length"]+" tr, with width about "+ value["td_per_tr_width"]);
				}
			}
			else {
				if ( value["width"] != value["td_per_tr_width"]) {
					console.warn("has "+value.tr["length"]+" tr, with width about "+ value["td_per_tr_width"]);
				}
				else {
					console.info("has "+value.tr["length"]+" tr, with width about "+ value["td_per_tr_width"]);
				}
			}

			console.groupEnd();
		});

	},

	/**
	 * compute and display if there are 20px blank security in a
	 * Side-by-side tables layout.
	 *
	 */
	 rwd_blank_security_NL: function(options) {
	 	$("td").each(function(index) {


	 		var $td = $(this);

	 		var td_tables = [];

			//ci($td.attr("width"));
			var children = $(this).children();
			var children_width = 0;

			$(children).each(function(i) {

				if ($(this).children().get(0) != undefined) {
					if ($(this).get(0).tagName == "TABLE") {
						if ($(this).attr("width") != $td.attr("width")) {
							children_width += parseInt($(this).attr("width"), 10);
						}
					}
				}

			});


			if (!isNaN(children_width) && children_width != 0) {
				var blank_security = parseInt($td.attr("width"), 10) - parseInt(children_width, 10);

				console.group("For td " + parseInt(index +1, 10) + ")");
				if (blank_security < 20) {
					console.warn("There are " + blank_security + "px left as blank space security.");
				}
				else if (blank_security == 20) {
					ci("There are " + blank_security + "px left as blank space security.");
				}
				else if (blank_security > 20 && blank_security < 60) {
					console.log("There are " + blank_security + "px left as blank space security. Maybe a little too much");
				}

				else if (blank_security > 60) {
					console.warn("There are " + blank_security + "px left as blank space security. TOO MUCH");
				}

				console.groupEnd();
			}

			//cl(children_width);

		});
},

	/**
	 * count the number of <a>
	 * @return integer
	 */
	 countTagTracking : function(options) {
	 	var count = 0;
	 	$("a").each(function(index) {

	 		var rg_vars_tracking = new RegExp(options.vars_tracking);

	 		if (rg_vars_tracking.test($(this).attr("href"))) {
	 			++count;
	 		}

	 		if (options.verbose === true) {
	 			console.log($(this).attr("href"));
	 		}

	 	});
	 	return count;
	 },

	/**
	 * Return an object containing URI parameters
	 *
	 * return {...{param : value}}
	 */
	 getParmsFromURL : function(url) {
	 	var parms = {}, pieces, parts, i;
	 	var hash = url.lastIndexOf("#");
	 	if (hash !== -1) {
					// remove hash value
					url = url.slice(0, hash);

					console.info(url);
				}
				var question = url.lastIndexOf("?");
				if (question !== -1) {
					url = url.slice(question + 1);
					pieces = url.split("&");
					for (i = 0; i < pieces.length; i++) {
						parts = pieces[i].split("=");
						if (parts.length < 2) {
							parts.push("");
						}
						if (parms[decodeURIComponent(parts[0])] === undefined) {
							parms[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
						}
						else {
							parms["double_" + decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
						}
					}
				}
				return parms;
			},

	/**
	 * Based on the vars_tracking,
	 * check if there are tags not changed, and warn it.
	 *
	 */
	 wrongTagTracking : function(options) {
	 	var url = {};
	 	var params = options.vars_tracking.split("&");
	 	var params_tag = {};

	 	$.each(params, function(el, value) {
	 		var couple = value.split("=");

	 		params_tag[couple[0]] = couple[1];

	 	});

	 	$("a").each(function(index) {

	 		var rg_vars_tracking = new RegExp(options.vars_tracking, 'g');
	 		var rg_mailto = new RegExp("mailto:");
	 		var rg_include = new RegExp("<%@ include");
	 		var rg_cryptedId = new RegExp("cryptedId");
	 		var rg_hash = new RegExp("^#");

	 		if (    !rg_mailto.test($(this).attr("href")) &&
	 			!rg_include.test($(this).attr("href")) &&
	 			!rg_hash.test($(this).attr("href")) &&
	 			!rg_cryptedId.test($(this).attr("href"))) {

	 			if (!rg_vars_tracking.test($(this).attr("href"))) {
	 				url = Checker.getParmsFromURL($(this).attr("href"));

	 				if (url.utm_source !== undefined && url.utm_source != params_tag.utm_source) {
	 					console.warn("link (one-index based) "+ parseInt(index +1, 10) + " has not the good utm_source.");
	 				}
	 				if (url.utm_medium !== undefined && url.utm_medium != params_tag.utm_medium) {
	 					console.warn("link (one-index based) "+ parseInt(index +1, 10) + " has not the good utm_medium.");
	 				}
	 				if (url.utm_campaign !== undefined && url.utm_campaign != params_tag.utm_campaign) {
	 					console.warn("link (one-index based) "+ parseInt(index +1, 10) + " has not the good utm_campaign.");
	 				}
	 			}
	 			else {
	 				url = Checker.getParmsFromURL($(this).attr("href"));

	 				if ($(this).attr("href").match(rg_vars_tracking).length != 1) {
	 					console.warn("<a> " + parseInt(index +1, 10) + " has " + $(this).attr("href").match(rg_vars_tracking).length + " Tag Tracking");
	 				}

	 				if (url.double_utm_campaign !== undefined || url.double_utm_medium !== undefined || url.double_utm_source !== undefined ) {
	 					console.warn("<a> " + parseInt(index +1, 10) + " has Tag Tracking in double or repeated !");
	 				}
	 			}

	 		}

	 	});
},

	/**
	 * count the number of <a> with attribute target, with the value _blank
	 * Important for some NLs, for instance Biotherm or Lancôme one.
	 * @return object
	 */
	 countTargetBlank : function() {
	 	var links = {count : 0, missing_index : []};
	 	$("a").each(function(i) {
	 		if (undefined !=  $(this).attr("target") && "_blank" == $(this).attr("target") ) {
	 			links.count++;
	 		}
	 		else {
	 			links.missing_index.push(i+1);
	 		}
	 	});
	 	return links;
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
	 	var warning, warning_width , warning_height;
	 	$("img").each(function(index)  {
	 		warning = false;
	 		warning_width = false;
	 		warning_height = false;

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

	 			if ($(this).parent().get(0).tagName == "A") {
	 				if ($(this).parent().parent().get(0).align != "center") {
	 					warning_width = true;
	 				}
	 				if ($(this).parent().parent().get(0).vAlign != "middle") {
	 					warning_height = true;
	 				}
	 			}
	 			else if ($(this).parent().get(0).tagName == "TD") {
	 				if ($(this).parent().get(0).align != "center") {
	 					warning_width = true;
	 				}
	 				if ($(this).parent().get(0).vAlign != "middle") {
	 					warning_height = true;
	 				}
	 			}

	 		}

	 		if (warning) {
	 			if (warning_width == true) {
	 				console.warn("Width differs or undefined for img " + parseInt(1+index, 10) +", with src : "+ $(this).attr("src") );
	 			}
	 			if (warning_height == true) {
	 				console.warn("Height differs or undefined for img " + parseInt(1+index, 10) +", with src : "+ $(this).attr("src") );
	 			}
	 			warning = false;
	 			warning_width = false;
	 			warning_height = false;
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
	 			console.warn("index " +parseInt(1+index, 10) + " img src : " +$(this).attr("src"));
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
	 				console.group("index " + parseInt(1+index, 10) + " a : " +$(this).html());
	 				console.info("Text Decoration missing ?");
	 				console.warn(cssText);
	 				console.log(" ");
	 				console.groupEnd();
	 			}

	 			if (!rg_color.test(cssText)) {
	 				console.group("index " + parseInt(1+index, 10) + " a : " +$(this).html());
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
	 checkTdStyle : function(options) {

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
	 			var diff = (parseFloat(lineHeight, 10) - parseFloat(fontSize, 10));
	 			if (diff < 2) {
	 				console.group("index " + parseInt(1+index, 10)  + " a : " +$(this).html());
	 				console.warn("index " + parseInt(1+index, 10)  + " a : " + $(this).html() + " should have a line-height 2px higher than font-size minimum !");
	 				console.groupEnd();
	 			}

	 			if (!rg_font_family.test(cssText)) {
	 				console.group("index " + parseInt(1+index, 10)  + " a : " +$(this).html());
	 				console.info("Font Family missing ?");
	 				console.warn(cssText);
	 				console.log(" ");
	 				console.groupEnd();
	 			}

	 			if (!rg_font_size.test(cssText)) {
	 				console.group("index " + parseInt(1+index, 10)  + " a : " +$(this).html());
	 				console.info("Font Size missing ?");
	 				console.warn(cssText);
	 				console.log(" ");
	 				console.groupEnd();
	 			}

	 			if (!rg_line_height.test(cssText)) {
	 				console.group("index " + parseInt(1+index, 10)  + " a : " +$(this).html());
	 				console.info("Line Height missing ?");
	 				console.warn(cssText);
	 				console.log(" ");
	 				console.groupEnd();
	 			}
	 			if (options.strict === true) {
	 				if (!rg_text_decoration.test(cssText)) {
	 					console.group("index " + parseInt(1+index, 10)  + " a : " +$(this).html());
	 					console.info("Text Decoration missing ?");
	 					console.warn(cssText);
	 					console.log(" ");
	 					console.groupEnd();
	 				}

	 				if (!rg_color.test(cssText)) {
	 					console.group("index " + parseInt(1+index, 10)  + " a : " +$(this).html());
	 					console.info("Color missing ?");
	 					console.warn(cssText);
	 					console.log(" ");
	 					console.groupEnd();
	 				}
	 			}
	 		}
	 	});
},

	/**
	 * display if a TD containing an img and link have a no style ; and img have
	 * display:block;
	 * @return void
	 */
	 checkTdImgStyle : function(options) {

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
				if ($(this).parent().get(0).style.cssText !== "" && !options.responsive) {
					console.warn("td with img "+ $(this).attr("src") +" should not have any style");
				}
			}

			// td > a > img
			if ($(this).parent().parent().get(0).tagName == "TD" && !options.responsive) {
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