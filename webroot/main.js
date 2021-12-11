var ua=navigator.userAgent.toLowerCase(),isSafartiIos=device.ios(),isChrome=ua.indexOf("chrome")>-1,isWindow=-1!==ua.indexOf("windows"),isFirefox="undefined"!=typeof InstallTrigger,isMac=navigator.platform.toUpperCase().indexOf("MAC")>=0,isDesktop=jQuery("html").hasClass("desktop"),isIOS=device.ios(),isAndroid=device.android(),cssTransEnd="webkitTransitionEnd transitionend ",cssAniEnd="animationend webkitAnimationEnd",isIE=detectIE(),isIE8=isIE&&8==isIE,isIE9=isIE&&9==isIE,prefix=function(){if(isIE8)return{dom:"",lowercase:"",css:"",js:""};var e=window.getComputedStyle(document.documentElement,""),n=(Array.prototype.slice.call(e).join("").match(/-(moz|webkit|ms)-/)||""===e.OLink&&["","o"])[1];return{dom:"WebKit|Moz|MS|O".match(new RegExp("("+n+")","i"))[1],lowercase:n,css:"-"+n+"-",js:n[0].toUpperCase()+n.substr(1)}}();function getLang(){var e=$("body");return e.hasClass("lang-en")?"en":e.hasClass("lang-tc")?"tc":e.hasClass("lang-sc")?"sc":"en"}!function(e,n,t){e(function(){e("html").removeClass("no-js"),isIE&&e("html").addClass("isIE isIE-"+isIE),isIE>0&&isIE<10&&e("html").addClass("isIE-10"),isFirefox&&e("html").addClass("isFF"),cancelMouseFocusOutline.init(),skip2content.init(),jsNav.init(),jsHeaderMenu.init(),jsAAA.init()})}(jQuery);var jsIframeWrap=function(){var e,n;return{init:function(){(e=$(".inner__content iframe")).each(function(){var e=$(this);e.attr("data-ori-width",e.attr("width")),e.attr("data-ori-height",e.attr("height"))}),$(window).on("resize",function(){n&&(clearTimeout(n),n=null),setTimeout(function(){var n;n=e.parent().width(),e.each(function(){var e=$(this),t=e.attr("data-ori-height"),s=e.attr("data-ori-width");ratio=t/s;var i=e.attr("src").match(/docs.google.com\/a\//),a=Math.min(n,s);e.css({width:a,height:i?t:a*ratio})})},100)}).resize()}}}(),jsAAA=function(e){var n,t;return{init:function(){n=e("html"),t=e(".fs-list a"),readCookie("aaa"),t.on("click",function(t){t.preventDefault();var s=e(this).attr("class");n.removeClass("text-m text-l text-s").addClass(s),createCookie("aaa",s)})}}}(jQuery),jsNav=function(e){var n,t,s,i,a,o,r,c,u=250;return{init:function(){n=e(".mn__nav"),t=n.find("li"),a=n.find("a"),s=n.find(".mn__itm--1"),o=n.find(".mn__link--1"),i=n.find(".mn__list--2"),Modernizr.touchevents||(s.on("mouseenter",function(){var n;n=e(this),r&&clearTimeout(r),r=setTimeout(function(){c&&clearTimeout(c),s.addClass("inactive").removeClass("active").off(cssTransEnd).one(cssTransEnd,function(){e(this).removeClass("active-leaving")}),n.removeClass("inactive").addClass("active "),isIE8&&(s.addClass("ie8--change"),setTimeout(function(){s.removeClass("ie8--change")},120))},u)}),s.on("mouseleave",function(){var n;n=e(this),r&&clearTimeout(r),c=setTimeout(function(){n.hasClass("active")&&n.hasClass("to-sub")&&n.addClass("active-leaving"),n.removeClass("active").off(cssTransEnd).one(cssTransEnd,function(){n.removeClass("active-leaving")}),s.removeClass("inactive"),isIE8&&(s.addClass("ie8--change"),setTimeout(function(){s.removeClass("ie8--change")},120))},u)}),i.on("mouseenter",function(){e(this),c&&clearTimeout(c)})),a.on("focus",function(){t.removeClass("active"),e(this).parentsUntil(n).addClass("active")}),a.on("blur",function(){e(this).parentsUntil(n).removeClass("active")}),a.add(i).on("touchstart",function(e){e.stopPropagation()}),a.on("focus mouseover",function(){t.removeClass("hover-active"),e(this).parent().addClass("hover-active")}),a.on("blur mouseleave",function(){e(this).parent().removeClass("hover-active")}),o.on("touchstart",function(n){var t=e(this);n.stopPropagation(),t.data("clicked")||(n.preventDefault(),s.removeClass("active"),o.removeData("clicked"),t.data("clicked",!0),t.parent().addClass("active"))}),e(document).on("touchstart",function(e){s.removeClass("active"),o.removeData("clicked")})}}}(jQuery),jsHeaderMenu=function(){var e,n,t,s,i,a,o,r=$('<div class="mb-mn__wrap visible-xs visible-sm"><div class="mb-mn__wrap-inner"></div></div>'),c=r.find(".mb-mn__wrap-inner"),u=$('<div class="js-menuCover" />'),l=null,d=Modernizr.touchevents?"touchstart":"click",m=200;function v(e){!function(e){var n=$(".lang-list"),t=$(".fs-list"),s=$(".head__block"),i=$(".mb-mn__top"),a=$(".search__form"),o=$(".mb-mn__wrap-inner");"js-mobile"===e||"js-tablet"===e?(i.append(n,t),a.appendTo(o)):(n.appendTo(s.eq(0)),t.appendTo(s.eq(1)),a.appendTo(s.eq(2)))}(e)}function f(){$("body").removeClass("slideIn-mn")}return{init:function(){isIE8||($(".page-head"),$(".wrapper"),o="mn",n=$("nav."+o+"__nav"),n=$("nav.mn__nav"),t=$(".mMenu__trigger"),s=$("body"),i=$("main"),v(a=jsQueryTest.getCurrentState()),function(){(e=n.clone(!0)).appendTo(c),r.insertBefore(i);var t='<span class="i-arrow i-arrow-down"><span class="sr-only">'+langArg({en:"Open / Close",tc:"打開 / 關閉",sc:"打开 / 关闭"})+'</span><span class="circle--oc-indicator" aria-hidden="true"></span></span>';c.find('[class*="'+o+'__"]').each(function(){var e=$(this),n=e.attr("class"),t=new RegExp(o+"__","gi");e.attr("class",n.replace(t,"mb-mn__"))}),c.find(".has-sub").each(function(){var e=$(this);e.find(">a").append(t)}),c.find(".i-arrow-down").on(d,function(e){e.preventDefault(),e.stopPropagation();var n=$(this),t=n.closest("li");t.hasClass("mb-active")?(t.removeClass("mb-active"),t.find("> ul").slideUp(m)):(t.addClass("mb-active"),t.find("> ul").slideDown(m))}),e.removeClass("hidden-xs hidden-sm");var u=$('<div class="mb-mn__top" />'),l=($(".mb-mn__nav"),$('<button class="mb-mn__close"><span class="ico-close ico" aria-hidden="true"></span><span class="sr-only">'+langArg({en:"Close Main menu",sc:"關閉選單",tc:"關閉選單"})+"</span></button>"));c.prepend(l),c.prepend(u),v(a),c.find(".mb-mn__close").on(d,function(e){e.preventDefault(),s.removeClass("slideIn-mn"),c.find(".mb-this-lv2-active").removeClass("mb-this-lv2-active")})}(),i.append(u),t.on(d+".mTrigger",function(e){e.stopPropagation(),e.preventDefault(),s.hasClass("slideIn-mn")?(s.removeClass("slideIn-mn"),f()):s.addClass("slideIn-mn")}),u.on(d+".mTrigger",function(e){s.removeClass("slideIn-mn")}),$(window).on("resize load",function(){null!==l&&(clearTimeout(l),l=null),l=setTimeout(function(){var e=a,n=jsQueryTest.getCurrentState();e!==n&&v(n),a=n},30)}))},restoreMenuClass:f}}(),skip2content=function(){var e,n;return{init:function(){e=$("#skip-to-content"),n=$("#skip-start"),e.on("click",function(e){e.preventDefault(),n.focus(),$("html, body").scrollTop(n.offset().top)})}}}(),cancelMouseFocusOutline=function(){var e=$("body");return{init:function(){e.addClass("mouse-down-remove-outline"),$(document).on("mousedown.cancel-outline",function(n){e.addClass("mouse-down-remove-outline")}).on("keydown.cancel-outline",function(n){9==n.which&&e.removeClass("mouse-down-remove-outline")})}}}();function ckSTab(e){return 9==e.which&&e.shiftKey}function ckTab(e){return 9==e.which&&!e.shiftKey}function ckEsc(e){return 27==e.which&&!e.shiftKey}function getSite(){return window.getComputedStyle(document.querySelector("body"),":before").getPropertyValue("content")}function detectIE(){var e=window.navigator.userAgent,n=e.indexOf("MSIE ");if(n>0)return parseInt(e.substring(n+5,e.indexOf(".",n)),10);if(e.indexOf("Trident/")>0){var t=e.indexOf("rv:");return parseInt(e.substring(t+3,e.indexOf(".",t)),10)}var s=e.indexOf("Edge/");return s>0&&parseInt(e.substring(s+5,e.indexOf(".",s)),10)}!function(e){e.fn.nextOrFirst=function(e){var n=this.next(e);return n.length?n:this.prevAll(e).last()}}(jQuery),function(e){e.fn.prevOrLast=function(e){var n=this.prev(e);return n.length?n:this.nextAll(e).last()}}(jQuery),Number.prototype.between=function(e,n){var t=Math.min.apply(Math,[e,n]),s=Math.max.apply(Math,[e,n]);return this>t&&this<s},jQuery.fn.reverse=[].reverse;var jsQueryTest=function(e){var n,t,s=e(".query-crt-mobile"),i=e(".query-crt-tablet"),a=e(".query-crt-desktop");function o(){s.length||(e("body").append('<div class="query-crt-mobile query-crt"/>','<div class="query-crt-tablet query-crt"/>','<div class="query-crt-desktop query-crt"/>'),s=e(".query-crt-mobile"),i=e(".query-crt-tablet"),a=e(".query-crt-desktop")),c(n=r()),u(n,!0),e(window).on("resize load",function(){(t=r())!==n&&(c(t),u(t)),n=t})}function r(){var e;return"block"==s.css("display")?e="js-mobile":"block"==i.css("display")?e="js-tablet":"block"==a.css("display")&&(e="js-desktop"),isIE8&&(e="js-desktop"),e}function c(n){e("body").removeClass("js-wide js-desktop js-mobile js-tablet").addClass(n)}function u(e,n){}return o(),{init:function(){o()},getCurrentState:function(){return r()},isMobile:function(){return"js-mobile"==r()},isTablet:function(){return"js-tablet"==r()},isDesktop:function(){return"js-desktop"==r()},argF:function(e){var n=r();return"js-mobile"==n?e.mobile:"js-tablet"==n?e.edsktop:"js-desktop"==n?e.desktop:void 0}}}(jQuery);function xpRender(){}function youtube_parser(e){var n=e.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);return!(!n||11!=n[7].length)&&n[7]}function langArg(e){return e[getLang()]}

var captcha_err_en = "Please check the box above to confirm that you are not an automatic program.";
var captcha_err_tc = "請剔選以上方格，確認您不是自動程式。";
var captcha_err_sc = "请剔选以上方格，确认您不是自动程式。";

var pics_err_en = "Please accept the above statement.";
var pics_err_tc = "請您同意上述條款。";
var pics_err_sc = "请您同意上述条款。";

var hkid_err_en = "Invalid Hong Kong identity document number.";
var hkid_err_tc = "身份證明文件號碼不正確。";
var hkid_err_sc = "身份证明文件号码不正确。";

var purpose_of_entry_display_en = "Special circumstances (attending funeral, medical emergency, seeking medical treatment)";
var purpose_of_entry_display_tc = "特殊情況（奔喪、緊急醫療情況、就醫）";
var purpose_of_entry_display_sc = "特殊情况（奔丧、紧急医疗情况、就医）";

var a_dom = "";
if (location.hostname == "pbqc.quotabooking.gov.hk") {
    a_dom = "https://pbqcbookingform.quotabooking.gov.hk";
}

function mask_fullname(fullname) {
    var fullname_arr = fullname.trim().split(" ");

    if (fullname_arr.length == 0) {
        //error
        return "";
    }
    if (fullname_arr.length == 1) {
        fullname = fullname.trim().slice(0, -4) + "****";
    }

    if (fullname_arr.length > 1) {
        fullname = fullname_arr[0];
        for (var i = 1; i < fullname_arr.length; i++) {
            fullname += " " + fullname_arr[i].slice(0, 1) + fullname_arr[i].replace(/./g, '*').slice(0, -1);
        }
    }
    return fullname;
}

$(function() {
	$('.print').click(function() {
        window.print();
    });

    $(".cancel_reload_button").click(function(e) {
        location.reload();
    });

	$('.btnScreenShot').click(function() {
	    $("header").addClass("print_header");
	    $("footer").addClass("print_footer");
	    $(".head__top, .mn__nav, .mMenu__trigger, .mb-mn__wrap").hide();
	    var inner_bg = $(".inner").css("background");
	    $(".inner").css("background", "white");
	    $("#result_button_group").hide();
	    $('.mMenu__trigger>.ico').hide()
	    window.scrollTo(0, 0);
	    var print_width = 1500;
	    if (lang == "en") {
	        print_width = 2500;
	    }
	    if(navigator.userAgent.indexOf('Firefox') !== -1)
	    {
	    	$("#booking_result .bold_underline, #booking_result .underline").addClass("remove_underline");
	    }

	    $(".html2canvas-container").css("width", print_width + "px");
	    $("body").css("width", print_width + "px");
	    $(".container").css("max-width", print_width + "px");
	    $(".logo").css("width", print_width + "px");
	    html2canvas(document.body, {
	        width: $("body").width(),
	        height: $("body").height()
	    }).then(function(canvas) {
	        if (window.navigator.msSaveOrOpenBlob) {
	            var blobObject = canvas.msToBlob();
	            window.navigator.msSaveOrOpenBlob(blobObject, 'download.png');
	        } else {
	        	var img = new Image();
	        	img.crossOrigin = "Anonymous";
	        	img.id = "getshot";
	        	img.src = canvas.toDataURL("image/png");
	        	document.body.appendChild(img);

	            var a = document.createElement('a');
	            a.href = getshot.src;
	            a.download = 'download.png';
	            a.click();

	            document.body.removeChild(img);
	        }
	    });
	    $("body").css("width", "initial");
	    $(".logo").css("width", "initial");
	    $(".container").css("max-width", "");
	    $("#booking_result .bold_underline, #booking_result .underline").removeClass("remove_underline");
	    $("header").removeClass("print_header");
	    $("footer").removeClass("print_footer");
	    $(".head__top, .mn__nav, .mMenu__trigger, .mb-mn__wrap").show();
	    $(".inner").css("background", inner_bg);
	    $("#result_button_group").show();
	    $('.mMenu__trigger>.ico').show();
	});
});

function download_text(downloadElement)
{
	var filename = "text-version.txt";
	var elHtml = $(downloadElement+":visible  > *:visible").text().replace(/(^[ \t]*\n)/gm, "").replace(/^\s*/gm, '').replace(/(?:\\[rn]|[\r\n])/g,"\r\n");
    var link = document.createElement('a');
    var mimeType = 'text/plain';

    if(window.navigator.msSaveOrOpenBlob) {
    	var fileData = [elHtml];
        blobObject = new Blob(fileData);
    	window.navigator.msSaveOrOpenBlob(blobObject, filename);
    }
    else
    {
    	link.setAttribute('download', filename);
	    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
	    link.click();
    }
}

function is_underAgeValidate(birthday) {
    birthday = new Date(birthday.replace(/-/g, "/"));
    var year = birthday.getFullYear();
    var month = birthday.getMonth();
    var day = birthday.getDate();
    return !(new Date(year + 18, month, day) < new Date());
}

function is_validateDate(year, month, day) {

    day = Number(day);
    month = Number(month) - 1; //bloody 0-indexed month
    year = Number(year);

    let d = new Date(year, month, day);

    if (new Date().getTime() - d.getTime() < 0) {
        return false;
    }

    let yearMatches = d.getFullYear() === year;
    let monthMatches = d.getMonth() === month;
    let dayMatches = d.getDate() === day;

    return yearMatches && monthMatches && dayMatches;
}

function handleTimeout() {
    if(lang == "en")
	{
    	alert("The page is expired.");
	}
	if(lang == "tc")
	{
		alert("頁面已過期");
	}
	if(lang == "sc")
	{
		alert("页面已过期");
	}
	location.reload();
}

function handleReminderTimeout() {
    if(lang == "en")
	{
    	alert("3 minutes is remaining before the page expired.");
	}
	if(lang == "tc")
	{
		alert("距離頁面過期還有 3 分鐘。");
	}
	if(lang == "sc")
	{
		alert("距离页面过期还有 3 分钟。");
	}
}

function step_2_documentId_HKIC_prefix_paste()
{
	var text = $("#step_2_documentId_HKIC_prefix").val();
	$("#step_2_documentId_HKIC_prefix").val(text.slice(0, text.length-1));
	$("#step_2_documentId_HKIC_check_digit").val(text[text.length -1]);
}
function step_1_documentId_HKIC_prefix_paste()
{
	var text = $("#step_1_documentId_HKIC_prefix").val();
	$("#step_1_documentId_HKIC_prefix").val(text.slice(0, text.length-1));
	$("#step_1_documentId_HKIC_check_digit").val(text[text.length -1]);
}
function step_2_child_documentId_HKIC_prefix_paste()
{
	$.each($("input[name*=step_2_child_documentId_HKIC_prefix_]"), function(index){
		if($("input[name=step_2_child_documentId_HKIC_check_digit_" + (index+1) + "]").val() == "")
		{
			var text = $("input[name=step_2_child_documentId_HKIC_prefix_" + (index+1) + "]").val();
			$("input[name=step_2_child_documentId_HKIC_prefix_" + (index+1) + "]").val(text.slice(0, text.length-1));
			$("input[name=step_2_child_documentId_HKIC_check_digit_" + (index+1) + "]").val(text[text.length -1]);
		}
	});

}
function IsHKID(str){
    var strValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (str.length < 8)
    {
        return false;
    }
    str = str.toUpperCase();
    var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
    var matchArray = str.match(hkidPat);
    if (matchArray == null)
    {
        return false;
   	}
    var charPart = matchArray[1];
    var numPart = matchArray[2];
    var checkDigit = matchArray[3];
    var checkSum = 0;
    if (charPart.length == 2) {
        checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
        checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
    } else {
        checkSum += 9 * 36;
        checkSum += 8 * (10 + strValidChars.indexOf(charPart));
    }

    for (var i = 0, j = 7; i < numPart.length; i++, j--)
	{
    	checkSum += j * numPart.charAt(i);
	}
    var remaining = checkSum % 11;
    var verify = remaining == 0 ? 0 : 11 - remaining;
    return verify == checkDigit || (verify == 10 && checkDigit == 'A');
}

(function ($) {
    var defaults = {
        callback: function () { },
        runOnLoad: true,
        frequency: 100,
        previousVisibility : null
    };

    var methods = {};
    methods.checkVisibility = function (element, options) {
        if (jQuery.contains(document, element[0])) {
            var previousVisibility = options.previousVisibility;
            var isVisible = element.is(':visible');
            options.previousVisibility = isVisible;
            var initialLoad = previousVisibility == null
            if (initialLoad) {
                if (options.runOnLoad) {
                    options.callback(element, isVisible, initialLoad);
                }
            } else if (previousVisibility !== isVisible) {
                options.callback(element, isVisible, initialLoad);
            }

            setTimeout(function() {
                methods.checkVisibility(element, options);
            }, options.frequency);
        }
    };

    $.fn.visibilityChanged = function (options) {
        var settings = $.extend({}, defaults, options);
        return this.each(function () {
            methods.checkVisibility($(this), settings);
        });
    };
})(jQuery);
