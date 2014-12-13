// version 0.11 by Daniel Rench
// More information: http://dren.ch/strftime/
// This is public domain software
//
// Some modification by tokuhirom.
// Tokuhirom's modifications are public domain, too.
(function () {
    "use strict";

function pad (d, n, p) {
    var s = '' + d;
    p = p || '0';
    while (s.length < n) s = p + s;
    return s;
}

var locales = {
	fa: {
		A: "یکشنبه دوشنبه سه‌شنبه چهارشنبه پنج‌شنبه جمعه شنبه".split(' '),
		a: "۱ش ۲ش ۳ش ۴ش ۵ش جمعه شنبه".split(' '),
		B: 'فروردین اردیبشهت خرداد تیر مرداد شهریور مهر آبان آذر دی بهمن اسفند'.split(' '),
	},
    en: {
        A: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(' '),
        a: "Sun Mon Tue Wed Thu Fri Sat".split(' '),
        B: "January February March April May June July August September October November December".split(' '),
        b:  "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ')
    }
};
locales.fa.b = locales.fa.B;

var formats = {
		A: function (d, locale) { return locales[locale].A[d.getDay()]; },
		a: function (d, locale) { return locales[locale].a[d.getDay()]; },
		B: function (d, locale) { return locales[locale].B[d.getMonth()]; },
		b: function (d, locale) { return locales[locale].b[d.getMonth()]; },
		C: function (d) { return Math.floor(d.getFullYear()/100); },
		c: function (d) { return d.toString(); },
		D: function (d) {
				return formats.m(d) + '/' +
					formats.d(d) + '/' + formats.y(d);
			},
		d: function (d) { return pad(d.getDate(), 2,'0'); },
		e: function (d) { return pad(d.getDate(), 2,' '); },
		F: function (d) {
				return formats.Y(d) + '-' + formats.m(d) + '-' +
					formats.d(d);
			},
		H: function (d) { return pad(d.getHours(), 2,'0'); },
		I: function (d) { return pad((d.getHours() % 12 || 12), 2); },
        /*
%g
like %G, but without the century
%G
The 4-digit year corresponding to the ISO week number
%j
day of the year as a decimal number (range 001 to 366)
%U
week number of the current year as a decimal number, starting with the first Sunday as the first day of the first week
%V
The ISO 8601:1988 week number of the current year as a decimal number, range 01 to 53, where week 1 is the first week that has at least 4 days in the current year, and with Monday as the first day of the week.
%W
week number of the current year as a decimal number, starting with the first Monday as the first day of the first week
%Z
time zone name or abbreviation

		j: function (d) {
				var t = d.getDate();
				var m = d.getMonth() - 1;
				if (m > 1) {
					var y = d.getYear();
					if (((y % 100) == 0) && ((y % 400) == 0)) ++t;
					else if ((y % 4) == 0) ++t;
				}
				while (m > -1) t += d.dpm[m--];
				return t.pad(3,'0');
			},
            */
		k: function (d) { return pad(d.getHours(), 2,' '); },
		l: function (d) { return pad((d.getHours() % 12 || 12), 2,' '); },
		M: function (d) { return pad(d.getMinutes(), 2,'0'); },
		m: function (d) { return pad((d.getMonth()+1), 2,'0'); },
		n: function (d) { return "\n"; },
		p: function (d) { return (d.getHours() > 11) ? 'PM' : 'AM'; },
		P: function (d) { return formats.p(d).toLowerCase(); },
		R: function (d) { return formats.H(d) + ':' + formats.M(d); },
		r: function (d) {
				return formats.I(d) + ':' + formats.M(d) + ':' +
					formats.S(d) + ' ' + formats.p(d);
			},
		S: function (d) { return pad(d.getSeconds(), 2,'0'); },
		s: function (d) { return Math.floor(d.getTime()/1000); },
		T: function (d) {
				return formats.H(d) + ':' + formats.M(d) + ':' +
					formats.S(d);
			},
		t: function (d) { return "\t"; },
/*		U: function (d) { return false; }, */
		u: function (d) { return(d.getDay() || 7); },
/*		V: function (d) { return false; }, */
		v: function (d) {
				return formats.e(d) + '-' + formats.b(d) + '-' +
					formats.Y(d);
			},
/*		W: function (d) { return false; }, */
		w: function (d) { return d.getDay(); },
		X: function (d) { return d.toTimeString(); }, // wrong?
		x: function (d) { return d.toDateString(); }, // wrong?
		Y: function (d) { return d.getFullYear(); },
		y: function (d) { return pad((d.getYear() % 100), 2); },
//		Z: function (d) { return d.toString().match(/\((.+)\)$/)[1]; },
//		z: function (d) { return d.getTimezoneOffset(); }, // wrong
//		z: function (d) { return d.toString().match(/\sGMT([+-]\d+)/)[1]; },
		'%': function (d) { return '%'; }
	};

formats['+'] = formats.c;
formats.h = formats.b;

var defaultLocale = 'en';

function strftime(date, fmt, locale) {
    var r = '';
    var n = 0;
    if (!locale) { locale = defaultLocale; }
    while(n < fmt.length) {
        var c = fmt.substring(n, n+1);
        if (c == '%') {
            c = fmt.substring(++n, n+1);
            r += (formats[c]) ? formats[c](date, locale) : c;
        } else r += c;
        ++n;
    }
    return r;
}

Date.prototype.strftime = function (fmt, locale) {
    return strftime(this, fmt, locale);
};

Date.prototype.strftime.formats = formats;
Date.prototype.strftime.setDefaultLocale = function (locale) {
    defaultLocale = locale;
};
Date.prototype.strftime.locales = locales;

})();
