
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
/**
 * Created by elizabethdabbs on 1/4/16.
 */

// Modifies the flexslider pager controls for section 508 compliance
jQuery(document).ready(function($) {
    
    $('.node-type-opa-basic-page').find('#block-dol-impact-ilab-dol-stories-block').each(function(){
        $(this).siblings('#block-system-main').addClass('col-md-6');
        if($(window).width() >= 979){
        $('#block-system-main').attr('style', 'max-height:150px;');
        }
        else{
            $('#block-system-main').attr('style', '');
        }
       
    });

    $( ".flex-control-paging li" ).each(function( index ) {
        $(this).find("a").text(function(i) {
            return "slide " + (index + 1);
        });

    });
    
    
    //hides the play/pause button when there is only one slide on the slideshow
    if($(".flex-direction-nav").children("li.flex-nav-prev").children("a").hasClass("flex-disabled")){
        $('a.flex-pause').css("display", "none");
        $('a.flex-pause').css("height", "0px");
    }
    
    
    $(".node-opa-basic-newsletter-page").find("table").each(function(){
        var color = $(this).attr("bgcolor");
        
        $(this).css("background-color", color);
    });
    $(".content").find('.media-element').each(function(){
        if($(this).attr("style") === "float:right"||$(this).attr("style") === "float:left" ){
            $(this).closest('.media-element-container').attr("style", "overflow:visible; margin-top:0px;");
        }
    });
    $(window).load( function() {
 if($(".region-blockgroup-twitter-blocks-group").children("section").hasClass("block-twitter-block")){
        $('#twitter-widget-0').attr('title', 'Twitter Timeline for the United States Department of Labor');
        $('#twitter-widget-1').attr('title', 'Twitter Timeline of the Secretary Of Labor');
  }
});

$(window).resize( function() {
 $('.node-type-opa-basic-page').find('#block-dol-impact-ilab-dol-stories-block').each(function(){
        if($(window).width() >= 979){
        $('#block-system-main').attr('style', 'max-height:150px;');
        }
        else{
            $('#block-system-main').attr('style', '');
        }
       
    });
});
} );

;
/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
   Drupal.behaviors.setAccordionStateCookie = {
    attach: function (context, settings) {
;(function (factory) {
  var registeredInModuleLoader = false;
  if (typeof define === 'function' && define.amd) {
    define(factory);
    registeredInModuleLoader = true;
  }
  if (typeof exports === 'object') {
    module.exports = factory();
    registeredInModuleLoader = true;
  }
  if (!registeredInModuleLoader) {
    var OldCookies = window.Cookies;
    var api = window.Cookies = factory();
    api.noConflict = function () {
      window.Cookies = OldCookies;
      return api;
    };
  }
}(function () {
  function extend () {
    var i = 0;
    var result = {};
    for (; i < arguments.length; i++) {
      var attributes = arguments[ i ];
      for (var key in attributes) {
        result[key] = attributes[key];
      }
    }
    return result;
  }

  function init (converter) {
    function api (key, value, attributes) {
      var result;
      if (typeof document === 'undefined') {
        return;
      }

      // Write

      if (arguments.length > 1) {
        attributes = extend({
          path: '/'
        }, api.defaults, attributes);

        if (typeof attributes.expires === 'number') {
          var expires = new Date();
          expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
          attributes.expires = expires;
        }

        try {
          result = JSON.stringify(value);
          if (/^[\{\[]/.test(result)) {
            value = result;
          }
        } catch (e) {}

        if (!converter.write) {
          value = encodeURIComponent(String(value))
            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
        } else {
          value = converter.write(value, key);
        }

        key = encodeURIComponent(String(key));
        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
        key = key.replace(/[\(\)]/g, escape);

        return (document.cookie = [
          key, '=', value,
          attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
          attributes.path ? '; path=' + attributes.path : '',
          attributes.domain ? '; domain=' + attributes.domain : '',
          attributes.secure ? '; secure' : ''
        ].join(''));
      }

      // Read

      if (!key) {
        result = {};
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all. Also prevents odd result when
      // calling "get()"
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var rdecode = /(%[0-9A-Z]{2})+/g;
      var i = 0;

      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var cookie = parts.slice(1).join('=');

        if (cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1);
        }

        try {
          var name = parts[0].replace(rdecode, decodeURIComponent);
          cookie = converter.read ?
            converter.read(cookie, name) : converter(cookie, name) ||
            cookie.replace(rdecode, decodeURIComponent);

          if (this.json) {
            try {
              cookie = JSON.parse(cookie);
            } catch (e) {}
          }

          if (key === name) {
            result = cookie;
            break;
          }

          if (!key) {
            result[name] = cookie;
          }
        } catch (e) {}
      }

      return result;
    }

    api.set = api;
    api.get = function (key) {
      return api.call(api, key);
    };
    api.getJSON = function () {
      return api.apply({
        json: true
      }, [].slice.call(arguments));
    };
    api.defaults = {};

    api.remove = function (key, attributes) {
      api(key, '', extend(attributes, {
        expires: -1
      }));
    };

    api.withConverter = init;

    return api;
  }

  return init(function () {});
}));
}
};
(function ($) {

  Drupal.behaviors.rememberAccordionState = {
    attach: function (context, settings) {
    //when a group is shown, save it as the active accordion group
    jQuery(".field-collection-item-field-accordion-tab").on('shown.bs.collapse', function () {
      var active = jQuery(this).find(".panel-collapse").attr('id');
      Cookies.set('activeAccordionGroup', active, { path: window.location.pathname });
    });

    jQuery(".field-collection-item-field-accordion-tab").on('hidden.bs.collapse', function () {
      Cookies.remove('activeAccordionGroup', { path: window.location.pathname });
    });

    var last = Cookies.get('activeAccordionGroup');
    if (last != undefined) {
      //remove default collapse settings
      jQuery(".field-collection-item-field-accordion-tab .panel-collapse").removeClass('in');
      //show the account_last visible group
      jQuery("#" + last).addClass("in");
    }
  }
}

Drupal.behaviors.keyPersonnelScroll = {
  attach: function (context, settings) {
    jQuery('#phone-key-personnel').change( function () {
      var targetPosition = jQuery(jQuery(this).val()).offset().top;
      jQuery('html,body').animate({ scrollTop: targetPosition}, 'slow');
    });
  }
}

Drupal.behaviors.activeDatesSwitch = {
  attach: function (context, settings) {
    jQuery('#active-dates').change(function(){
      switch (jQuery('#active-dates').val()) {
        case 'on':
        jQuery('.ilab-active-dates').hide();
        jQuery('.active-on').show();
        break;
        case 'between':
        jQuery('.ilab-active-dates').show();
        jQuery('.active-on').hide();
        break;
      }
    });
  }
}

Drupal.behaviors.fundedDatesSwitch = {
  attach: function (context, settings) {
    jQuery('#funded-dates').change(function(){
      var n = jQuery(this).val();
      switch (n) {
        case 'infiscalyears':
        jQuery('.ilab-fiscal-dates').hide();
        jQuery('.ilab-fiscal-on').show();
        break;
        case 'betweenfiscalyears':
        jQuery('.ilab-fiscal-dates').show();
        jQuery('.ilab-fiscal-on').hide();
        break;
      }
    });
  }
}


Drupal.behaviors.projectSummaryExpand = {
  attach: function (context, settings) {
    $('.ilab-project-summary').hide();
    $('h2.has-attachment').after('<span class="glyphicon glyphicon-collapse-down ilab-summary-collapse ilab-summary-collapse-down"></span>');
    $('.ilab-summary-collapse', context).once().click(function(){
      $(this).siblings('.ilab-project-summary').slideToggle();
      $(this).toggleClass('glyphicon-collapse-up');
      $(this).toggleClass('glyphicon-collapse-down');
    });
  }
}

 


Drupal.behaviors.naalcSummaryExpand = {
  attach: function (context, settings) {
    $('.views-field-field-office-nalc > p').hide();
    $('h2.has-attachment').after('<span class="glyphicon glyphicon-collapse-down ilab-summary-collapse ilab-summary-collapse-down"></span>');
    $('.ilab-summary-collapse', context).click(function(){
      $(this).siblings('.views-field-field-office-nalc > p').slideToggle();
      $(this).toggleClass('glyphicon-collapse-up');
      $(this).toggleClass('glyphicon-collapse-down');
    });
  }
}

Drupal.behaviors.researchSummaryExpand = {
  attach: function (context, settings) {
     
    $('.views-field-field-research-title > p').hide();
    $('h2.has-attachment').after('<span class="glyphicon glyphicon-collapse-down ilab-summary-collapse ilab-summary-collapse-down"></span>');
    $('.ilab-summary-collapse', context).click(function(){
      $(this).siblings('.views-field-field-research-title > p').slideToggle();
      $(this).toggleClass('glyphicon-collapse-up');
      $(this).toggleClass('glyphicon-collapse-down');
    });
  }
}


Drupal.behaviors.logSummaryExpand = {
  attach: function (context, settings) {
    $('.views-field-field-good > p').hide(); 
    $('h2.has-attachment').after('<span class="glyphicon glyphicon-collapse-down ilab-summary-collapse ilab-summary-collapse-down"></span>');
    $('.ilab-summary-collapse', context).click(function(){
      $(this).siblings('.views-field-field-good > p').slideToggle();
      $(this).toggleClass('glyphicon-collapse-up');
      $(this).toggleClass('glyphicon-collapse-down');
    });
  }
}


Drupal.behaviors.lopSummaryExpand = {
  attach: function (context, settings) {
    $('.views-field-field-ilab-good > p').hide(); 
    $('h2.has-attachment').after('<span class="glyphicon glyphicon-collapse-down ilab-summary-collapse ilab-summary-collapse-down"></span>');
    $('.ilab-summary-collapse', context).click(function(){
      $(this).siblings('.views-field-field-ilab-good > p').slideToggle();
      $(this).toggleClass('glyphicon-collapse-up');
      $(this).toggleClass('glyphicon-collapse-down');
    });
  }
}})(jQuery);



 ;
