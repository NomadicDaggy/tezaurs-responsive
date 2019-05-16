var MorphologyTables = (function() {
	var cases = [
		[ 'Nominatīvs', 'Nom.' ],
		[ 'Ģenitīvs', 'Ģen.' ],
		[ 'Datīvs', 'Dat.' ],
		[ 'Akuzatīvs', 'Akuz.' ],
		[ 'Lokatīvs', 'Lok.' ]
	];
	var numbers_1 = [ [ 'Daudzskaitlis', 'Dsk.' ] ];
	var numbers_2 = [ [ 'Vienskaitlis', 'Vsk.' ], [ 'Daudzskaitlis', 'Dsk.' ] ];
	var numbers_3 = [ [ 'Vienskaitlis', 'Vsk.' ], [ 'Daudzskaitlis', 'Dsk.' ], [ 'Nepiemīt', '' ] ];
	var defs_all = [ [ 'Nenoteiktā', 'Nenot.' ], [ 'Noteiktā', 'Not.' ] ];
	var genders_all = [ [ 'Vīriešu', 'Vīr.' ], [ 'Sieviešu', 'Siev.' ] ];
	var tenses = [ [ 'Tagadne', 'Tag.' ], [ 'Pagātne', 'Pag.' ], [ 'Nākotne', 'Nāk.' ] ];

	var LONG = 0;
	var SHORT = 1;

	function add_word(words, key, value) {
		var previous_value = words[key];
		if (!previous_value) words[key] = value;
		else if (
			previous_value != value &&
			!(previous_value.substr(-(value.length + 1)) === ' ' + value) &&
			previous_value.indexOf(value + ', ') == -1
		) {
			words[key] = previous_value + ', ' + value;
		}
	}

	function formatInflections(data, paradigm, pluralEntryWord, secondThirdConj) {
		var expand =
			'<img src="img/expand.svg" id="toggle_Morphology" class="expand_SVG" width="14" height="14" alt="+"/>';

		if (paradigm == 0) {
			return null;
		}

		var disclaimer = "<div class='disclaimer'>Locījumu tabula ir ģenerēta automātiski un var būt kļūdaina.</div>";

		if (
			(paradigm >= 1 && paradigm <= 11) ||
			(paradigm >= 31 && paradigm <= 35) ||
			paradigm == 44 ||
			paradigm == 47 ||
			paradigm == 48
		) {
			// Declinable nouns
			var gender = data[0]['Dzimte'].toLowerCase();
			var decl = data[0]['Deklinācija'];
			var morph = '<span class="summary">' + 'lietvārds, ' + gender + ' dzimte, ';
			if (/^\d+$/.test(decl)) morph = morph + decl + '. deklinācija';
			else morph = morph + ' deklinācija: ' + decl.toLowerCase();
			morph = morph + '</span>';
			var table = '<div class="items">' + formatNoun(data, pluralEntryWord) + disclaimer + '</div>';
			return morph + ' ' + expand + table;
		}

		// 12 - nelokāmie lietvārdi, kurus attiecīgi neloka
		if (paradigm == 13 || paradigm == 14) {
			// Adjectives
			var morph = '<span class="summary">' + 'īpašības vārds' + '</span>';
			var table =
				'<div class="items">' +
				formatAdjective(data, 'Pamata') +
				formatAdjective(data, 'Pārākā') +
				formatAdjective(data, 'Vispārākā') +
				disclaimer +
				'</div>';
			return morph + ' ' + expand + table;
		}

		if (paradigm == 42) {
			// Adjectives
			var morph = '<span class="summary">' + 'adjektivizējies darāmās kārtas pagātnes divdabis' + '</span>';
			var table =
				'<div class="items">' +
				formatAdjective(data, 'Pamata') +
				formatAdjective(data, 'Pārākā') +
				formatAdjective(data, 'Vispārākā') +
				disclaimer +
				'</div>';
			return morph + ' ' + expand + table;
		}

		if (paradigm == 43) {
			// Adjectives
			var morph = '<span class="summary">' + 'adjektivizējies darāmās kārtas pagātnes divdabis' + '</span>';
			var table = '<div class="items">' + formatAdjective(data, 'Pamata') + disclaimer + '</div>';
			return morph + ' ' + expand + table;
		}

		if (paradigm == 30) {
			// Adjectives
			var morph =
				'<span class="summary">' +
				'substantivizējies īpašības vārds, pamata pakāpe, noteiktā galotne, vīriešu dzimte' +
				'</span>';
			var table = '<div class="items">' + formatNoun(data, false) + disclaimer + '</div>';
			return morph + ' ' + expand + table;
		}

		if (paradigm == 40 || paradigm == 41) {
			// Adjectives
			var morph =
				'<span class="summary">' +
				'substantivizējies īpašības vārds, pamata pakāpe, noteiktā galotne, sieviešu dzimte' +
				'</span>';
			var table = '<div class="items">' + formatNoun(data, false) + disclaimer + '</div>';
			return morph + ' ' + expand + table;
		}

		if ((paradigm >= 15 && paradigm <= 20) || paradigm == 45 || paradigm == 46) {
			// Verbs, non-reflexive and reflexive
			var conj = data[0]['Konjugācija'];
			if (!conj || conj == 'Nekārtns') conj = 'nekārtns';
			else if (secondThirdConj) conj = '2. un 3. konjugācija';
			else conj = conj + '. konjugācija';

			// hack - atgriezeniskuma detektēšana pēc -šanās formas pazīmes. TODO - izmainīt webservisu, lai to pasaka pie verba formām.
			var atgriezeniskums = '';
			for (var i = 0; i < data.length; i++) {
				if (data[i]['Deklinācija'] == 'Atgriezenisks') atgriezeniskums = ', atgriezenisks';
			}
			var morph = '<span class="summary">' + 'darbības vārds, ' + conj + atgriezeniskums + '</span>';
			var table = '<div class="items">' + formatVerb(data) + disclaimer + '</div>';
			return morph + ' ' + expand + table;
		}

		// 21 - apstākļa vārdi, nelokāmi

		if (paradigm >= 22 && paradigm <= 24) {
			// Numeral
			var noteiktiiba = '';
			if (data[0]['Noteiktība'] == 'Noteiktā') noteiktiiba = ', noteiktais';
			if (data[0]['Noteiktība'] == 'Nenoteiktā') noteiktiiba = ', nenoteiktais';

			var morph = '<span class="summary">skaitļa vārds' + noteiktiiba + '</span>';

			var singular = false;
			var plural = false;
			for (var i = 0; i < data.length; i++) {
				if (data[i]['Skaitlis'] == 'Vienskaitlis') singular = true;
				if (data[i]['Skaitlis'] == 'Daudzskaitlis') plural = true;
			}
			var table;
			if (singular && plural) {
				table = '<div class="items">' + formatNumber(data) + disclaimer + '</div>';
			} else {
				table = '<div class="items">' + formatNumberOnePlurality(data) + disclaimer + '</div>';
			}
			return morph + ' ' + expand + table;
		}

		if (paradigm == 25) {
			// Pronouns
			var morph = '<span class="summary">Vietniekvārds</span>';
			var table = '<div class="items">' + formatNoun(data) + disclaimer + '</div>';
			return morph + ' ' + expand + table;
		}

		// 26-29 - nelokāmās vārdu grupas

		return null; // ja nesaprotam, tad nerādam neko lai nav teksts kas ir masīvi no objektiem
	}

	function formatNoun(data, pluralEntryWord) {
		var words = {};

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var key = item['Skaitlis'] + '-' + item['Locījums'];
			var value = item['Vārds'];
			add_word(words, key, value);
		}

		return formatNumCaseTable(words, null, null, true, pluralEntryWord);
	}

	function formatNumCaseTable(words, caption, prefix, tags, pluralOnly) {
		var result = '<table class="inflections"><thead>';
		var numbers = pluralOnly ? numbers_1 : numbers_2;

		if (caption != null) {
			result += '<tr>';
			if (tags) {
				result += '<th>&nbsp;</th>';
			}
			result += '<th colspan="2"><div class="sub-title">' + caption + '</div></th></tr>';
		}

		result += '<tr>';

		if (tags) {
			result += '<th class="case-indent">&nbsp;</th>';
		}

		for (var num = 0; num < numbers.length; num++) {
			result += '<th>' + numbers[num][SHORT] + '</th>';
		}

		result += '</tr></thead><tbody>';

		for (var c = 0; c < cases.length; c++) {
			result += '<tr>';

			if (tags) {
				result += '<th scope="row">' + cases[c][SHORT] + '</th>';
			}

			for (var num = 0; num < numbers.length; num++) {
				var key = numbers[num][LONG] + '-' + cases[c][LONG];
				if (prefix != null) {
					key = prefix + key;
				}

				var word = words[key];
				if (word == null) {
					word = '&mdash;';
				}

				result += '<td>' + word + '</td>';
			}

			result += '</tr>';
		}

		return result + '</tbody></table>';
	}

	function formatAdjective(data, degree) {
		var head = '<div class="sub-morphology">' + degree + ' pakāpe: ';

		if (degree == 'Pārākā') {
			return head + '<span class="sub-text">piedēklis <span class="inflection">-āk-</span></span></div>';
		}

		if (degree == 'Vispārākā') {
			return (
				head +
				'<span class="sub-text">priedēklis <span class="inflection">vis-</span>, ' +
				'piedēklis <span class="inflection">-āk-</span> ' +
				'un noteiktā galotne</span></div>'
			);
		}

		var words = {};

		for (var i = 0; i < data.length; i++) {
			item = data[i];

			if (item['Vārdšķira'] == 'Apstākļa vārds') continue;
			if (item['Pakāpe'] != null && item['Pakāpe'] != degree) continue;

			var key = item['Noteiktība'] + '-' + item['Dzimte'] + '-' + item['Skaitlis'] + '-' + item['Locījums'];
			add_word(words, key, item['Vārds']);
		}

		var result = head + '<div>';

		for (var def = 0; def < defs_all.length; def++) {
			result += '<div class="sub-morphology" style="display:inline-block">';
			result += '<div class="sub-indent tab-title">' + defs_all[def][LONG] + ' galotne</div><div>';

			for (var gend = 0; gend < genders_all.length; gend++) {
				if ($(window).width() > 768) {
					var tags = gend == 0 ? true : false;
				} else {
					var tags = true;
				}
				result += '<div style="display:inline-block">';
				result += formatNumCaseTable(
					words,
					genders_all[gend][LONG] + ' dzimte',
					defs_all[def][LONG] + '-' + genders_all[gend][LONG] + '-',
					tags
				);
				result += '</div>';
			}

			result += '</div></div>';
		}

		return result + '</div></div>';
	}

	function formatNumber(data) {
		var words = {};

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var key = item['Dzimte'] + '-' + item['Skaitlis'] + '-' + item['Locījums'];
			add_word(words, key, item['Vārds']);
		}

		var result = '<div>';

		for (var gend = 0; gend < genders_all.length; gend++) {
			var tags = gend == 0 ? true : false;

			result += '<div style="display:inline-block">';
			result += formatNumCaseTable(
				words,
				genders_all[gend][LONG] + ' dzimte',
				genders_all[gend][LONG] + '-',
				tags
			);
			result += '</div>';

			// hack - locījumu ģenerētājs nemāk tikt galā ar atšķirību starp vārdiem “viens” un “simts”, vienam ir sieviešu dzimtes formas bet simtam nav
			if (
				data[0]['Vārds'] == 'desmits' ||
				data[0]['Vārds'] == 'simts' ||
				data[0]['Vārds'] == 'miljons' ||
				data[0]['Vārds'] == 'miljards'
			)
				break;
		}

		return result + '</div></div>';
	}

	function formatNumberOnePlurality(data) {
		var words = {};

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var key = item['Dzimte'] + '-' + item['Locījums'];
			add_word(words, key, item['Vārds']);
		}

		var result = '<table class="inflections"><thead>';
		result += '<tr><th class="case-indent">&nbsp;</th>';

		for (var gend = 0; gend < genders_all.length; gend++) {
			result += '<th>' + genders_all[gend][SHORT] + '</th>';
		}

		result += '</tr></thead><tbody>';
		for (var c = 0; c < cases.length; c++) {
			result += '<tr><th scope="row">' + cases[c][SHORT] + '</th>';

			for (var gend = 0; gend < genders_all.length; gend++) {
				var key = genders_all[gend][LONG] + '-' + cases[c][LONG];
				var word = words[key];
				if (word == null) {
					word = '&mdash;';
				}
				result += '<td>' + word + '</td>';
			}
			result += '</tr>';
		}
		result = result + '</tbody></table>';

		return result;
	}

	function formatVerbTenseTable(words, caption, tags) {
		var result = '<table class="inflections"><thead>';

		if (caption != null) {
			result += '<tr>';
			if (tags) {
				result += '<th>&nbsp;</th>';
			}
			result +=
				'<th colspan="2"><div class="sub-title" style="text-align:center;">' + caption + '</div></th></tr>';
		}

		result += '<tr>';

		if (tags) {
			result += '<th class="case-indent">&nbsp;</th>';
		}

		for (var num = 0; num < numbers_2.length; num++) {
			result += '<th>' + numbers_2[num][SHORT] + '</th>';
		}

		result += '</tr></thead><tbody>';

		for (var person = 1; person <= 3; person++) {
			result += '<tr><th scope="row">' + person + '.&nbsp;pers.</th>';

			for (var num = 0; num < numbers_3.length; num++) {
				var key = 'Īstenības-' + caption + '-' + person + '-' + numbers_3[num][LONG];
				var word = '';

				if (words[key]) {
					word = words[key];
				} else if (((person == 1 || person == 2) && num != 2) || (person == 3 && num == 2)) {
					word = '&mdash;';
					// FIXME - kā smukāk realizēt, lai vajadzīgajiem un tikai vajadzīgajiem laukiem ieliek domuzīmes, ja tukši?
				}

				if (person != 3) {
					result += '<td>' + word + '</td>';
				} else if (word != '') {
					result += '<td colspan="2" style="text-align:center">' + word + '</td>';
				}
			}
		}

		return result + '</tbody></table>';
	}

	function formatVerb(data) {
		var words = {};

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			if (item['Vārdšķira'] != 'Darbības vārds') continue;

			var key = '';

			switch (item['Izteiksme']) {
				case 'Īstenības':
					key = item['Izteiksme'] + '-' + item['Laiks'] + '-' + item['Persona'] + '-' + item['Skaitlis'];
					break;
				case 'Pavēles':
					key = item['Izteiksme'] + '-' + item['Skaitlis'];
					break;
				case 'Atstāstījuma':
					key = item['Izteiksme'] + '-' + item['Laiks'];
					break;
				case 'Vēlējuma':
				case 'Vajadzības':
				case 'Vajadzības, astāstījuma paveids':
					key = item['Izteiksme'];
					break;
				default:
					continue;
			}
			var value = item['Vārds'];
			/* TODO FIXME
    		 * Šis ir aprisinājums tam, ka morfoserviss nesaprot pareizi, ja trūkst viena 1. konj. celma.
    		 * Vēl te ir "vajagu" aprisinājums
    		 */
			if (
				value &&
				!/^.*----.*$/.test(value) &&
				!/^(ne)?vaja(g|dz)(u|i|am|at|ēšu|ēsi|ēsim|ēsiet|ēju|ēji|ējām|ējāt|iet)$/.test(value)
			)
				add_word(words, key, value);
		}
		if ($(window).width() > 768) {
			var result = '<div class="sub-morphology">Īstenības izteiksme:';
			result += '<table class="inflections">';
			result += '<thead><tr><th>&nbsp;</th>';

			for (var tense = 0; tense < tenses.length; tense++) {
				result += '<th colspan="2"><div class="sub-title">' + tenses[tense][LONG] + '</div></th>';
			}

			result += '</tr><tr><th>&nbsp;</th>';

			for (var tense = 0; tense < tenses.length; tense++) {
				for (var num = 0; num < numbers_2.length; num++) {
					result += '<th>' + numbers_2[num][SHORT] + '</th>';
				}
			}

			result += '</tr></thead><tbody>';

			for (var person = 1; person <= 3; person++) {
				result += '<tr><th scope="row">' + person + '.&nbsp;pers.</th>';

				for (var tense = 0; tense < tenses.length; tense++) {
					var wordlist = [];

					for (var num = 0; num < numbers_3.length; num++) {
						var key = 'Īstenības-' + tenses[tense][LONG] + '-' + person + '-' + numbers_3[num][LONG];

						if (words[key]) {
							wordlist.push(words[key]);
						} else if (((person == 1 || person == 2) && num != 2) || (person == 3 && num == 2)) {
							wordlist.push('&mdash;');
							// FIXME - kā smukāk realizēt, lai vajadzīgajiem un tikai vajadzīgajiem laukiem ieliek domuzīmes, ja tukši?
						}
					}

					if (wordlist.length > 0) {
						wordlist = wordlist.join('</td><td>');
					} else {
						wordlist = '&mdash;';
					}

					if (person == 3) {
						result += '<td colspan="2" style="text-align:center">';
					} else {
						result += '<td>';
					}
					result += wordlist + '</td>';
				}
			}

			result += '</tbody></table></div>';
		} else {
			var result = '<div class="sub-morphology">Īstenības izteiksme:<br>';

			for (var tense = 0; tense < tenses.length; tense++) {
				result += '<div style="display:inline-block">';
				result += formatVerbTenseTable(words, tenses[tense][LONG], true);
				result += '</div>';
			}
			result += '</div>';
		}

		if (words['Pavēles-Vienskaitlis'] || words['Pavēles-Daudzskaitlis']) {
			result += '<div class="sub-morphology">Pavēles izteiksme: <span class="sub-text">';
			if (words['Pavēles-Vienskaitlis']) {
				result += '<span class="inflection">' + words['Pavēles-Vienskaitlis'] + '</span> (vsk. 2. pers.)';
			}
			if (words['Pavēles-Vienskaitlis'] && words['Pavēles-Daudzskaitlis']) {
				result += ', ';
			}
			if (words['Pavēles-Daudzskaitlis']) {
				result += '<span class="inflection">' + words['Pavēles-Daudzskaitlis'] + '</span>  (dsk. 2. pers.)';
			}
			result += '</span></div>';

			// TODO: dsk. 1. pers.
		}

		if (words['Atstāstījuma-Tagadne'] || words['Atstāstījuma-Nākotne']) {
			result += '<div class="sub-morphology">Atstāstījuma izteiksme: <span class="sub-text">';
			if (words['Atstāstījuma-Tagadne']) {
				result += '<span class="inflection">' + words['Atstāstījuma-Tagadne'] + '</span> (tag.)';
			}
			if (words['Atstāstījuma-Tagadne'] && words['Atstāstījuma-Nākotne']) {
				result += ', ';
			}
			if (words['Atstāstījuma-Nākotne']) {
				result += '<span class="inflection">' + words['Atstāstījuma-Nākotne'] + '</span> (nāk.)';
			}
			result += '</span></div>';
		}

		if (words['Vēlējuma']) {
			result +=
				'<div class="sub-morphology">Vēlējuma izteiksme: <span class="inflection">' +
				words['Vēlējuma'] +
				'</span></div>';
		}

		if (words['Vajadzības']) {
			result +=
				'<div class="sub-morphology">Vajadzības izteiksme: <span class="inflection">' +
				words['Vajadzības'] +
				'</span></div>';
		}

		return result;
	}

	return {
		formatInflections: formatInflections
	};
})();
