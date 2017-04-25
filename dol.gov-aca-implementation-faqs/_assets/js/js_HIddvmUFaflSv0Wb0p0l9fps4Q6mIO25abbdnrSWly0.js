/*
    TimelineJS - ver. 2.36.0 - 2015-05-12
    Copyright (c) 2012-2013 Northwestern University
    a project of the Northwestern University Knight Lab, originally created by Zach Wise
    https://github.com/NUKnightLab/TimelineJS
    This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
LazyLoad=function(doc){var env,head,pending={},pollCount=0,queue={css:[],js:[]},styleSheets=doc.styleSheets;function createNode(name,attrs){var node=doc.createElement(name),attr;for(attr in attrs){if(attrs.hasOwnProperty(attr)){node.setAttribute(attr,attrs[attr])}}return node}function finish(type){var p=pending[type],callback,urls;if(p){callback=p.callback;urls=p.urls;urls.shift();pollCount=0;if(!urls.length){callback&&callback.call(p.context,p.obj);pending[type]=null;queue[type].length&&load(type)}}}function getEnv(){var ua=navigator.userAgent;env={async:doc.createElement("script").async===true};(env.webkit=/AppleWebKit\//.test(ua))||(env.ie=/MSIE/.test(ua))||(env.opera=/Opera/.test(ua))||(env.gecko=/Gecko\//.test(ua))||(env.unknown=true)}function load(type,urls,callback,obj,context){var _finish=function(){finish(type)},isCSS=type==="css",nodes=[],i,len,node,p,pendingUrls,url;env||getEnv();if(urls){urls=typeof urls==="string"?[urls]:urls.concat();if(isCSS||env.async||env.gecko||env.opera){queue[type].push({urls:urls,callback:callback,obj:obj,context:context})}else{for(i=0,len=urls.length;i<len;++i){queue[type].push({urls:[urls[i]],callback:i===len-1?callback:null,obj:obj,context:context})}}}if(pending[type]||!(p=pending[type]=queue[type].shift())){return}head||(head=doc.head||doc.getElementsByTagName("head")[0]);pendingUrls=p.urls;for(i=0,len=pendingUrls.length;i<len;++i){url=pendingUrls[i];if(isCSS){node=env.gecko?createNode("style"):createNode("link",{href:url,rel:"stylesheet"})}else{node=createNode("script",{src:url});node.async=false}node.className="lazyload";node.setAttribute("charset","utf-8");if(env.ie&&!isCSS){node.onreadystatechange=function(){if(/loaded|complete/.test(node.readyState)){node.onreadystatechange=null;_finish()}}}else if(isCSS&&(env.gecko||env.webkit)){if(env.webkit){p.urls[i]=node.href;pollWebKit()}else{node.innerHTML='@import "'+url+'";';pollGecko(node)}}else{node.onload=node.onerror=_finish}nodes.push(node)}for(i=0,len=nodes.length;i<len;++i){head.appendChild(nodes[i])}}function pollGecko(node){var hasRules;try{hasRules=!!node.sheet.cssRules}catch(ex){pollCount+=1;if(pollCount<200){setTimeout(function(){pollGecko(node)},50)}else{hasRules&&finish("css")}return}finish("css")}function pollWebKit(){var css=pending.css,i;if(css){i=styleSheets.length;while(--i>=0){if(styleSheets[i].href===css.urls[0]){finish("css");break}}pollCount+=1;if(css){if(pollCount<200){setTimeout(pollWebKit,50)}else{finish("css")}}}}return{css:function(urls,callback,obj,context){load("css",urls,callback,obj,context)},js:function(urls,callback,obj,context){load("js",urls,callback,obj,context)}}}(this.document);LoadLib=function(doc){var loaded=[];function isLoaded(url){var i=0,has_loaded=false;for(i=0;i<loaded.length;i++){if(loaded[i]==url){has_loaded=true}}if(has_loaded){return true}else{loaded.push(url);return false}}return{css:function(urls,callback,obj,context){if(!isLoaded(urls)){LazyLoad.css(urls,callback,obj,context)}},js:function(urls,callback,obj,context){if(!isLoaded(urls)){LazyLoad.js(urls,callback,obj,context)}}}}(this.document);var WebFontConfig;if(typeof embed_path=="undefined"){var _tmp_script_path=getEmbedScriptPath("storyjs-embed.js");var embed_path=_tmp_script_path.substr(0,_tmp_script_path.lastIndexOf("js/"))}function getEmbedScriptPath(scriptname){var scriptTags=document.getElementsByTagName("script"),script_path="",script_path_end="";for(var i=0;i<scriptTags.length;i++){if(scriptTags[i].src.match(scriptname)){script_path=scriptTags[i].src}}if(script_path!=""){script_path_end="/"}return script_path.split("?")[0].split("/").slice(0,-1).join("/")+script_path_end}(function(){if(typeof url_config=="object"){createStoryJS(url_config)}else if(typeof timeline_config=="object"){createStoryJS(timeline_config)}else if(typeof storyjs_config=="object"){createStoryJS(storyjs_config)}else if(typeof config=="object"){createStoryJS(config)}else{}})();function createStoryJS(c,src){var storyjs_embedjs,t,te,x,isCDN=false,js_version="2.24",jquery_version_required="1.7.1",jquery_version="",ready={timeout:"",checks:0,finished:false,js:false,css:false,jquery:false,has_jquery:false,language:false,font:{css:false,js:false}},path={base:embed_path,css:embed_path+"css/",js:embed_path+"js/",locale:embed_path+"js/locale/",jquery:"//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",font:{google:false,css:embed_path+"css/themes/font/",js:"//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"}},storyjs_e_config={version:js_version,debug:false,type:"timeline",id:"storyjs",embed_id:"timeline-embed",embed:true,width:"100%",height:"100%",source:"https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html",lang:"en",font:"default",css:path.css+"timeline.css?"+js_version,js:"",api_keys:{google:"",flickr:"",twitter:""},gmap_key:""},font_presets=[{name:"Merriweather-NewsCycle",google:["News+Cycle:400,700:latin","Merriweather:400,700,900:latin"]},{name:"NewsCycle-Merriweather",google:["News+Cycle:400,700:latin","Merriweather:300,400,700:latin"]},{name:"PoiretOne-Molengo",google:["Poiret+One::latin","Molengo::latin"]},{name:"Arvo-PTSans",google:["Arvo:400,700,400italic:latin","PT+Sans:400,700,400italic:latin"]},{name:"PTSerif-PTSans",google:["PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"PT",google:["PT+Sans+Narrow:400,700:latin","PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"DroidSerif-DroidSans",google:["Droid+Sans:400,700:latin","Droid+Serif:400,700,400italic:latin"]},{name:"Lekton-Molengo",google:["Lekton:400,700,400italic:latin","Molengo::latin"]},{name:"NixieOne-Ledger",google:["Nixie+One::latin","Ledger::latin"]},{name:"AbrilFatface-Average",google:["Average::latin","Abril+Fatface::latin"]},{name:"PlayfairDisplay-Muli",google:["Playfair+Display:400,400italic:latin","Muli:300,400,300italic,400italic:latin"]},{name:"Rancho-Gudea",google:["Rancho::latin","Gudea:400,700,400italic:latin"]},{name:"Bevan-PotanoSans",google:["Bevan::latin","Pontano+Sans::latin"]},{name:"BreeSerif-OpenSans",google:["Bree+Serif::latin","Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin"]},{name:"SansitaOne-Kameron",google:["Sansita+One::latin","Kameron:400,700:latin"]},{name:"Lora-Istok",google:["Lora:400,700,400italic,700italic:latin","Istok+Web:400,700,400italic,700italic:latin"]},{name:"Pacifico-Arimo",google:["Pacifico::latin","Arimo:400,700,400italic,700italic:latin"]}];if(typeof c=="object"){for(x in c){if(Object.prototype.hasOwnProperty.call(c,x)){storyjs_e_config[x]=c[x]}}}if(typeof src!="undefined"){storyjs_e_config.source=src}if(typeof url_config=="object"){isCDN=true;if(storyjs_e_config.source.match("docs.google.com")||storyjs_e_config.source.match("json")||storyjs_e_config.source.match("storify")){}else{storyjs_e_config.source="https://docs.google.com/spreadsheet/pub?key="+storyjs_e_config.source+"&output=html"}}if(storyjs_e_config.js.match("locale")){storyjs_e_config.lang=storyjs_e_config.js.split("locale/")[1].replace(".js","");storyjs_e_config.js=path.js+"timeline-min.js?"+js_version}if(storyjs_e_config.js.match("/")){}else{storyjs_e_config.css=path.css+storyjs_e_config.type+".css?"+js_version;storyjs_e_config.js=path.js+storyjs_e_config.type;if(storyjs_e_config.debug){storyjs_e_config.js+=".js?"+js_version}else{storyjs_e_config.js+="-min.js?"+js_version}storyjs_e_config.id="storyjs-"+storyjs_e_config.type}if(storyjs_e_config.lang.match("/")){path.locale=storyjs_e_config.lang}else{path.locale=path.locale+storyjs_e_config.lang+".js?"+js_version}createEmbedDiv();LoadLib.css(storyjs_e_config.css,onloaded_css);if(storyjs_e_config.font=="default"){ready.font.js=true;ready.font.css=true}else{var fn;if(storyjs_e_config.font.match("/")){fn=storyjs_e_config.font.split(".css")[0].split("/");path.font.name=fn[fn.length-1];path.font.css=storyjs_e_config.font}else{path.font.name=storyjs_e_config.font;path.font.css=path.font.css+storyjs_e_config.font+".css?"+js_version}LoadLib.css(path.font.css,onloaded_font_css);for(var i=0;i<font_presets.length;i++){if(path.font.name==font_presets[i].name){path.font.google=true;WebFontConfig={google:{families:font_presets[i].google}}}}if(path.font.google){LoadLib.js(path.font.js,onloaded_font_js)}else{ready.font.js=true}}try{ready.has_jquery=jQuery;ready.has_jquery=true;if(ready.has_jquery){var jquery_version_array=jQuery.fn.jquery.split(".");var jquery_version_required_array=jquery_version_required.split(".");ready.jquery=true;for(i=0;i<2;i++){var have=jquery_version_array[i],need=parseFloat(jquery_version_required_array[i]);if(have!=need){ready.jquery=have>need;break}}}}catch(err){ready.jquery=false}if(!ready.jquery){LoadLib.js(path.jquery,onloaded_jquery)}else{onloaded_jquery()}function onloaded_jquery(){LoadLib.js(storyjs_e_config.js,onloaded_js)}function onloaded_js(){ready.js=true;if(storyjs_e_config.lang!="en"){LazyLoad.js(path.locale,onloaded_language)}else{ready.language=true}onloaded_check()}function onloaded_language(){ready.language=true;onloaded_check()}function onloaded_css(){ready.css=true;onloaded_check()}function onloaded_font_css(){ready.font.css=true;onloaded_check()}function onloaded_font_js(){ready.font.js=true;onloaded_check()}function onloaded_check(){if(ready.checks>40){return;alert("Error Loading Files")}else{ready.checks++;if(ready.js&&ready.css&&ready.font.css&&ready.font.js&&ready.language){if(!ready.finished){ready.finished=true;buildEmbed()}}else{ready.timeout=setTimeout("onloaded_check_again();",250)}}}this.onloaded_check_again=function(){onloaded_check()};function createEmbedDiv(){var embed_classname="storyjs-embed";t=document.createElement("div");if(storyjs_e_config.embed_id!=""){te=document.getElementById(storyjs_e_config.embed_id)}else{te=document.getElementById("timeline-embed")}te.appendChild(t);t.setAttribute("id",storyjs_e_config.id);if(storyjs_e_config.width.toString().match("%")){te.style.width=storyjs_e_config.width.split("%")[0]+"%"}else{storyjs_e_config.width=storyjs_e_config.width-2;te.style.width=storyjs_e_config.width+"px"}if(storyjs_e_config.height.toString().match("%")){te.style.height=storyjs_e_config.height;embed_classname+=" full-embed";te.style.height=storyjs_e_config.height.split("%")[0]+"%"}else if(storyjs_e_config.width.toString().match("%")){embed_classname+=" full-embed";storyjs_e_config.height=storyjs_e_config.height-16;te.style.height=storyjs_e_config.height+"px"}else{embed_classname+=" sized-embed";storyjs_e_config.height=storyjs_e_config.height-16;te.style.height=storyjs_e_config.height+"px"}te.setAttribute("class",embed_classname);te.setAttribute("className",embed_classname);t.style.position="relative"}function buildEmbed(){VMM.debug=storyjs_e_config.debug;storyjs_embedjs=new VMM.Timeline(storyjs_e_config.id);storyjs_embedjs.init(storyjs_e_config);if(isCDN){VMM.bindEvent(global,onHeadline,"HEADLINE")}}};
/**
 * @file
 * Invokes the timeline js plugin.
 */
var embed_path;

(function ($) {
  Drupal.behaviors.timelineJS = {
    attach: function(context, settings) {
      $.each(Drupal.settings.timelineJS, function(key, timeline) {
        embed_path = timeline['embed_path'];

        if (timeline['processed'] != true) {
          createStoryJS(timeline);
        }
        timeline['processed'] = true;
      });
    }
  }
})(jQuery);
;

(function($) {

/**
 * Drupal FieldGroup object.
 */
Drupal.FieldGroup = Drupal.FieldGroup || {};
Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
Drupal.FieldGroup.groupWithfocus = null;

Drupal.FieldGroup.setGroupWithfocus = function(element) {
  element.css({display: 'block'});
  Drupal.FieldGroup.groupWithfocus = element;
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processFieldset = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.fieldset', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('legend span.fieldset-legend', $(this)).eq(0).append(' ').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('legend span.fieldset-legend', $(this)).eq(0).addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processAccordion = {
  execute: function (context, settings, type) {
    $('div.field-group-accordion-wrapper', context).once('fieldgroup-effects', function () {
      var wrapper = $(this);

      wrapper.accordion({
        autoHeight: false,
        active: '.field-group-accordion-active',
        collapsible: true,
        changestart: function(event, ui) {
          if ($(this).hasClass('effect-none')) {
            ui.options.animated = false;
          }
          else {
            ui.options.animated = 'slide';
          }
        }
      });

      if (type == 'form') {

        var $firstErrorItem = false;

        // Add required fields mark to any element containing required fields
        wrapper.find('div.field-group-accordion-item').each(function(i) {

          if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
            $('h3.ui-accordion-header a').eq(i).append(' ').append($('.form-required').eq(0).clone());
          }
          if ($('.error', $(this)).length) {
            // Save first error item, for focussing it.
            if (!$firstErrorItem) {
              $firstErrorItem = $(this).parent().accordion("activate" , i);
            }
            $('h3.ui-accordion-header').eq(i).addClass('error');
          }
        });

        // Save first error item, for focussing it.
        if (!$firstErrorItem) {
          $('.ui-accordion-content-active', $firstErrorItem).css({height: 'auto', width: 'auto', display: 'block'});
        }

      }
    });
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processHtabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('fieldset.horizontal-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('horizontalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('horizontalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('horizontalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processTabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.vertical-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('verticalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('verticalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('verticalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 *
 * TODO clean this up meaning check if this is really
 *      necessary.
 */
Drupal.FieldGroup.Effects.processDiv = {
  execute: function (context, settings, type) {

    $('div.collapsible', context).once('fieldgroup-effects', function() {
      var $wrapper = $(this);

      // Turn the legend into a clickable link, but retain span.field-group-format-toggler
      // for CSS positioning.

      var $toggler = $('span.field-group-format-toggler:first', $wrapper);
      var $link = $('<a class="field-group-format-title" href="#"></a>');
      $link.prepend($toggler.contents());

      // Add required field markers if needed
      if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
        $link.append(' ').append($('.form-required').eq(0).clone());
      }

      $link.appendTo($toggler);

      // .wrapInner() does not retain bound events.
      $link.click(function () {
        var wrapper = $wrapper.get(0);
        // Don't animate multiple times.
        if (!wrapper.animating) {
          wrapper.animating = true;
          var speed = $wrapper.hasClass('speed-fast') ? 300 : 1000;
          if ($wrapper.hasClass('effect-none') && $wrapper.hasClass('speed-none')) {
            $('> .field-group-format-wrapper', wrapper).toggle();
          }
          else if ($wrapper.hasClass('effect-blind')) {
            $('> .field-group-format-wrapper', wrapper).toggle('blind', {}, speed);
          }
          else {
            $('> .field-group-format-wrapper', wrapper).toggle(speed);
          }
          wrapper.animating = false;
        }
        $wrapper.toggleClass('collapsed');
        return false;
      });

    });
  }
};

/**
 * Behaviors.
 */
Drupal.behaviors.fieldGroup = {
  attach: function (context, settings) {
    settings.field_group = settings.field_group || Drupal.settings.field_group;
    if (settings.field_group == undefined) {
      return;
    }

    // Execute all of them.
    $.each(Drupal.FieldGroup.Effects, function (func) {
      // We check for a wrapper function in Drupal.field_group as
      // alternative for dynamic string function calls.
      var type = func.toLowerCase().replace("process", "");
      if (settings.field_group[type] != undefined && $.isFunction(this.execute)) {
        this.execute(context, settings, settings.field_group[type]);
      }
    });

    // Fixes css for fieldgroups under vertical tabs.
    $('.fieldset-wrapper .fieldset > legend').css({display: 'block'});
    $('.vertical-tabs fieldset.fieldset').addClass('default-fallback');


    // Add a new ID to each fieldset.
    $('.group-wrapper fieldset').each(function() {
      // Tats bad, but we have to keep the actual id to prevent layouts to break.
      var fieldgorupID = 'field_group-' + $(this).attr('id') + ' ' + $(this).attr('id');
      $(this).attr('id', fieldgorupID);
    })
    // Set the hash in url to remember last userselection.
    $('.group-wrapper ul li').each(function() {
      var fieldGroupNavigationListIndex = $(this).index();
      $(this).children('a').click(function() {
        var fieldset = $('.group-wrapper fieldset').get(fieldGroupNavigationListIndex);
        // Grab the first id, holding the wanted hashurl.
        var hashUrl = $(fieldset).attr('id').replace(/^field_group-/, '').split(' ')[0];
        window.location.hash = hashUrl;
      });
    });
  }
};

})(jQuery);;
(function ($) {

Drupal.googleanalytics = {};

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      // Is the clicked URL internal?
      if (Drupal.googleanalytics.isInternal(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox')) {
          // Do nothing here. The custom event will handle all tracking.
          //console.info("Click on .colorbox item has been detected.");
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
          // Download link clicked.
          ga("send", "event", "Downloads", Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(), Drupal.googleanalytics.getPageUrl(this.href));
        }
        else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          ga("send", "pageview", { "page": Drupal.googleanalytics.getPageUrl(this.href) });
        }
      }
      else {
        if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          ga("send", "event", "Mails", "Click", this.href.substring(7));
        }
        else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (Drupal.settings.googleanalytics.trackDomainMode != 2 || (Drupal.settings.googleanalytics.trackDomainMode == 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains))) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", "event", "Outbound links", "Click", this.href);
          }
        }
      }
    });
  });

  // Track hash changes as unique pageviews, if this option has been enabled.
  if (Drupal.settings.googleanalytics.trackUrlFragments) {
    window.onhashchange = function() {
      ga('send', 'pageview', location.pathname + location.search + location.hash);
    }
  }

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  $(document).bind("cbox_complete", function () {
    var href = $.colorbox.element().attr("href");
    if (href) {
      ga("send", "pageview", { "page": Drupal.googleanalytics.getPageUrl(href) });
    }
  });

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
Drupal.googleanalytics.isCrossDomain = function (hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
};

/**
 * Check whether this is a download URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isDownload = function (url) {
  var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  return isDownload.test(url);
};

/**
 * Check whether this is an absolute internal URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternal = function (url) {
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return isInternal.test(url);
};

/**
 * Check whether this is a special URL or not.
 *
 * URL types:
 *  - gotwo.module /go/* links.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternalSpecial = function (url) {
  var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
  return isInternalSpecial.test(url);
};

/**
 * Extract the relative internal URL from an absolute internal URL.
 *
 * Examples:
 * - http://mydomain.com/node/1 -> /node/1
 * - http://example.com/foo/bar -> http://example.com/foo/bar
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   Internal website URL
 */
Drupal.googleanalytics.getPageUrl = function (url) {
  var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return url.replace(extractInternalUrl, '');
};

/**
 * Extract the download file extension from the URL.
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   The file extension of the passed url. e.g. "zip", "txt"
 */
Drupal.googleanalytics.getDownloadExtension = function (url) {
  var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  var extension = extractDownloadextension.exec(url);
  return (extension === null) ? '' : extension[1];
};

})(jQuery);
;
