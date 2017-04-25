(function($, Drupal){
    var previous;
    var previousYear;
    var previousYearAdvanced;
    
    function validateStandardSelectField(){
        var selectMain = $('#dol-browse-releases-form').find("#edit-select-main");
        if(selectMain.val() === '0'){
            selectMain.css("border-color", "#900");
            
            return false;
        }if($('#dol-browse-releases-form').find('#edit-select-' + previous+'--2').val() === '0'){
            $('#dol-browse-releases-form').find('#edit-select-' + previous+'--2').css("border-color", "#900");
            
            return false;
        }
        if(previous === 'year' && $('#dol-browse-releases-form').find('#edit-select-month-' + previousYear+'--2').val() === '0'){
            $('#dol-browse-releases-form').find('#edit-select-month-' + previousYear+'--2').css("border-color", "#900");
            
            return false;
        }
        return true;
    }
    
    function validateAdvancedSelectField(){
        var flag = false;
        var year = $('#edit-select-year').val();
       $('#dol-browse-releases-advanced-form').find('[name*="select"] :selected').each(function(){
           var val = $(this).val();
           if(val !== '0'){
               flag = true;
           }
       });
       
       
        
        if(flag === true){
            return true;
        }
        else{
            document.getElementById('error-msg').innerHTML="Please select at least one filter option.";
            return false;
        }
         
    }

    function submitListener(){

        $("#edit-submit-filter--2").once("dol-browse-releases-form", function(){
            $(this).click(function(e){
                if(!validateStandardSelectField()){
                    e.preventDefault();
                }else{
                    var browse_type = $('#edit-select-main').val();
                    var value = $('#edit-select-'+browse_type+'--2').val();
                    
                    if(browse_type === 'year'){
                        browse_type = 'date';
                        var month = $('#edit-select-month-'+value+'--2').val();
                        value += '/' + month;
                    }else if(browse_type === 'state'){
                        browse_type = 'region';
                    }
                    
                    var href = '/newsroom/releases/'+browse_type+'/'+value;
                    $(location).attr('href', href)
                }
            });
        });
        
         $("#edit-submit-filter").once("dol-browse-releases-advanced-form", function(){
            $(this).click(function(e){
                if(!validateAdvancedSelectField()){
                    
                    e.preventDefault();
                }else{
                    //var browse_type = $('#edit-select-main').val();
                    var agency = $('#edit-select-agency').val();
                    var year = $('#edit-select-year').val();
                    var state = $('#edit-select-state').val();
                    var topic = $('#edit-select-topic').val();
                    
                    
                    
                    var href = '/newsroom/releases/filter'
                    
                    if(agency !== '0'){
                        href += '/' + agency;
                    }
                    if(year !== '0'){
                        //browse_type = 'date';
                        var month = $('#edit-select-month-'+year).val();
                        if(month !== '0'){
                        year += '-' + month;
                    }
                    
                        
                        href += '/' + year;
                    }
                    if(state !== '0'){
                        href += '/' + state;
                    }
                    if(topic !== '0'){
                        href += '/' + topic;
                    }
                    $(location).attr('href', href)
                }
            });
        });
    }
    
    function selectListener(){
        
        $('#dol-browse-releases-form').find("#edit-select-main").on('change', function () {
            $('#dol-browse-releases-form').find('.form-item-select-' + previous).css('display','none');
            $('#dol-browse-releases-form').find('.form-item-select-month-' + previousYear).css('display','none');
            var nextSelect = $(this).find(":selected").val();
            $('#dol-browse-releases-form').find('.form-item-select-' + nextSelect).css('display','block');
            
            if($(this).val()!== '0'){
                $(this).css('border-color','');
            }
            
            previous = this.value;
        });
        
        $('#dol-browse-releases-form').find(".form-select").on('change', function () {
            
            if($(this).val()!== '0'){
                $(this).css('border-color','');
            }
            
        });
        
        
        $('#dol-browse-releases-form').find("#edit-select-year--2").on('change', function () {
            $('#dol-browse-releases-form').find('.form-item-select-month-' + previousYear).css('display','none');
            var nextYear = $(this).find(":selected").val();
            $('#dol-browse-releases-form').find('.form-item-select-month-' + nextYear).css('display','block');
            
            if($(this).val()!== '0'){
                $(this).css('border-color','');
            }
            
            previousYear = this.value;
        });
        
        $('#dol-browse-releases-advanced-form').find("#edit-select-year").on('change', function () {
            $('#dol-browse-releases-advanced-form').find('.form-item-select-month-' + previousYearAdvanced).css('display','none');
            var nextYear = $(this).find(":selected").val();
            $('#dol-browse-releases-advanced-form').find('.form-item-select-month-' + nextYear).css('display','block');
            
            
            previousYearAdvanced = this.value;
        });
    }
    
    Drupal.behaviors.browseReleasesFormValidation = {
        attach:function(){
            
            $('button[value="Advanced Filter"]').on('click', function () {
                $('#block-dol-browse-releases-dol-advanced-filter-widget').find('.panel-default').removeAttr("style");
                $('#block-dol-browse-releases-dol-browse-releases-widget').find('.panel-default').attr("style", "display:none;");
            });
            $('button[value="Standard Filter"]').on('click', function () {
                $('#block-dol-browse-releases-dol-browse-releases-widget').find('.panel-default').removeAttr("style");
                $('#block-dol-browse-releases-dol-advanced-filter-widget').find('.panel-default').attr("style", "display:none;");
            });
            
            $('#dol-browse-releases-form').find('.form-type-select:not(.form-item-select-main)').css('display','none');
            $('#dol-browse-releases-advanced-form').find('[class*="form-item-select-month"]').css('display','none');
            selectListener();
            submitListener();
        }
    };
    
})(jQuery, Drupal);;
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
