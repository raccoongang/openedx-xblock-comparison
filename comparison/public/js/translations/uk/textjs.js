
            (function(global){
                var СomparisonXBlockI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "Please check over your questions.": "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0441\u0432\u043e\u0457 \u0437\u0430\u0432\u0434\u0430\u043d\u043d\u044f.",
    "Please check the settings for your answers.": "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f \u0441\u0432\u043e\u0457\u0445 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u0435\u0439.",
    "Saving": "\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043d\u043d\u044f",
    "There was an error with your form.": "\u041f\u0456\u0434 \u0447\u0430\u0441 \u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043d\u043d\u044f \u0441\u0442\u0430\u043b\u0430\u0441\u044f \u043f\u043e\u043c\u0438\u043b\u043a\u0430.",
    "This may be happening because of an error with our server or your internet connection. Try refreshing the page or making sure you are online.": "\u0426\u0435 \u043c\u043e\u0436\u0435 \u0441\u0442\u0430\u0442\u0438\u0441\u044f \u0447\u0435\u0440\u0435\u0437 \u043f\u043e\u043c\u0438\u043b\u043a\u0443 \u0437 \u043d\u0430\u0448\u0438\u043c \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c \u0430\u0431\u043e \u0432\u0430\u0448\u0438\u043c \u0406\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u0437'\u0454\u0434\u043d\u0430\u043d\u043d\u044f\u043c. \u0421\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043e\u043d\u043e\u0432\u0438\u0442\u0438 \u0441\u0442\u043e\u0440\u0456\u043d\u043a\u0443 \u0430\u0431\u043e \u043f\u0435\u0440\u0435\u043a\u043e\u043d\u0430\u0439\u0442\u0435\u0441\u044f, \u0449\u043e \u0432\u0438 \u0432 \u043c\u0435\u0440\u0435\u0436\u0456.",
    "Unable to update settings": "\u041d\u0435 \u0432\u0434\u0430\u0454\u0442\u044c\u0441\u044f \u043e\u043d\u043e\u0432\u0438\u0442\u0438 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f",
    "Your response has been sent successfully.": "\u0412\u0430\u0448\u0430 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c \u0443\u0441\u043f\u0456\u0448\u043d\u043e \u043d\u0430\u0434\u0456\u0441\u043b\u0430\u043d\u0430.",
    "answer 1": "\u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c 1",
    "answer 2": "\u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c 2",
    "answer 3": "\u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c 3",
    "answer 4": "\u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c 4",
    "answer 5": "\u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c 5",
    "answer 6": "\u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u044c 6",
    "question 1": "\u043f\u0438\u0442\u0430\u043d\u043d\u044f 1",
    "question 2": "\u043f\u0438\u0442\u0430\u043d\u043d\u044f 2",
    "question 3": "\u043f\u0438\u0442\u0430\u043d\u043d\u044f 3",
    "question 4": "\u043f\u0438\u0442\u0430\u043d\u043d\u044f 4"
  };
  for (var key in newcatalog) {
    django.catalog[key] = newcatalog[key];
  }
  

  if (!django.jsi18n_initialized) {
    django.gettext = function(msgid) {
      var value = django.catalog[msgid];
      if (typeof(value) == 'undefined') {
        return msgid;
      } else {
        return (typeof(value) == 'string') ? value : value[0];
      }
    };

    django.ngettext = function(singular, plural, count) {
      var value = django.catalog[singular];
      if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value.constructor === Array ? value[django.pluralidx(count)] : value;
      }
    };

    django.gettext_noop = function(msgid) { return msgid; };

    django.pgettext = function(context, msgid) {
      var value = django.gettext(context + '\x04' + msgid);
      if (value.indexOf('\x04') != -1) {
        value = msgid;
      }
      return value;
    };

    django.npgettext = function(context, singular, plural, count) {
      var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.indexOf('\x04') != -1) {
        value = django.ngettext(singular, plural, count);
      }
      return value;
    };

    django.interpolate = function(fmt, obj, named) {
      if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
      } else {
        return fmt.replace(/%s/g, function(match){return String(obj.shift())});
      }
    };


    /* formatting library */

    django.formats = {
    "DATETIME_FORMAT": "d E Y \u0440. H:i",
    "DATETIME_INPUT_FORMATS": [
      "%d.%m.%Y %H:%M:%S",
      "%d.%m.%Y %H:%M:%S.%f",
      "%d.%m.%Y %H:%M",
      "%d.%m.%Y",
      "%d %B %Y %H:%M:%S",
      "%d %B %Y %H:%M:%S.%f",
      "%d %B %Y %H:%M",
      "%d %B %Y",
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d"
    ],
    "DATE_FORMAT": "d E Y \u0440.",
    "DATE_INPUT_FORMATS": [
      "%d.%m.%Y",
      "%d %B %Y",
      "%Y-%m-%d"
    ],
    "DECIMAL_SEPARATOR": ",",
    "FIRST_DAY_OF_WEEK": 1,
    "MONTH_DAY_FORMAT": "d F",
    "NUMBER_GROUPING": 3,
    "SHORT_DATETIME_FORMAT": "d.m.Y H:i",
    "SHORT_DATE_FORMAT": "d.m.Y",
    "THOUSAND_SEPARATOR": "\u00a0",
    "TIME_FORMAT": "H:i",
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S",
      "%H:%M:%S.%f",
      "%H:%M"
    ],
    "YEAR_MONTH_FORMAT": "F Y"
  };

    django.get_format = function(format_type) {
      var value = django.formats[format_type];
      if (typeof(value) == 'undefined') {
        return format_type;
      } else {
        return value;
      }
    };

    /* add to global namespace */
    globals.pluralidx = django.pluralidx;
    globals.gettext = django.gettext;
    globals.ngettext = django.ngettext;
    globals.gettext_noop = django.gettext_noop;
    globals.pgettext = django.pgettext;
    globals.npgettext = django.npgettext;
    globals.interpolate = django.interpolate;
    globals.get_format = django.get_format;

    django.jsi18n_initialized = true;
  }

}(this));


                  }
                };
                СomparisonXBlockI18N.init();
                global.СomparisonXBlockI18N = СomparisonXBlockI18N;
            }(this));
        