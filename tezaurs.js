var delta = 20;
var debug = window.location.protocol == 'file:';
var api_url = 'http://api.tezaurs.lv/v1';
if (debug) api_url = 'http:/localhost:8182/v1';

function isEncodedURIComponent(arg) {
	return decodeURIComponent(arg) !== arg;
}

function multiParadigm(givenParadigm, cogender, optSoundChange, secondThirdConj) {
	if (cogender && optSoundChange && givenParadigm == 9) return [ 9, 44, 10, 47 ];
	if (cogender && optSoundChange && givenParadigm == 10) return [ 10, 47, 9, 44 ];
	if (cogender && optSoundChange && givenParadigm == 44) return [ 44, 9, 47, 10 ];
	if (cogender && optSoundChange && givenParadigm == 47) return [ 47, 10, 44, 9 ];

	if (cogender && givenParadigm == 7) return [ 7, 8 ];
	if (cogender && givenParadigm == 8) return [ 8, 7 ];
	if (cogender && givenParadigm == 9) return [ 9, 10 ];
	if (cogender && givenParadigm == 10) return [ 10, 9 ];
	if (cogender && givenParadigm == 44) return [ 44, 47 ];
	if (cogender && givenParadigm == 47) return [ 47, 44 ];
	if (cogender && givenParadigm == 6) return [ 6, 31 ];
	if (cogender && givenParadigm == 31) return [ 31, 6 ];

	if (secondThirdConj && optSoundChange && givenParadigm == 16) return [ 16, 45, 17 ];
	if (secondThirdConj && optSoundChange && givenParadigm == 17) return [ 17, 45, 16 ];
	if (secondThirdConj && optSoundChange && givenParadigm == 45) return [ 45, 17, 16 ];
	if (secondThirdConj && optSoundChange && givenParadigm == 19) return [ 19, 46, 20 ];
	if (secondThirdConj && optSoundChange && givenParadigm == 20) return [ 20, 46, 19 ];
	if (secondThirdConj && optSoundChange && givenParadigm == 46) return [ 46, 20, 19 ];

	if (secondThirdConj && givenParadigm == 16) return [ 16, 17 ];
	if (secondThirdConj && givenParadigm == 17) return [ 17, 16 ];
	if (secondThirdConj && givenParadigm == 45) return [ 45, 16 ];
	if (secondThirdConj && givenParadigm == 19) return [ 19, 20 ];
	if (secondThirdConj && givenParadigm == 20) return [ 20, 19 ];
	if (secondThirdConj && givenParadigm == 46) return [ 46, 19 ];

	if (optSoundChange && givenParadigm == 17) return [ 17, 45 ];
	if (optSoundChange && givenParadigm == 45) return [ 45, 17 ];
	if (optSoundChange && givenParadigm == 20) return [ 20, 46 ];
	if (optSoundChange && givenParadigm == 46) return [ 46, 20 ];
	if (optSoundChange && givenParadigm == 3) return [ 3, 48 ];
	if (optSoundChange && givenParadigm == 48) return [ 48, 3 ];
	if (optSoundChange && givenParadigm == 9) return [ 9, 44 ];
	if (optSoundChange && givenParadigm == 44) return [ 44, 9 ];
	if (optSoundChange && givenParadigm == 10) return [ 10, 47 ];
	if (optSoundChange && givenParadigm == 47) return [ 47, 10 ];
	if (optSoundChange && givenParadigm == 11) return [ 11, 35 ];
	if (optSoundChange && givenParadigm == 35) return [ 35, 11 ];

	if (givenParadigm != null && givenParadigm > 0) return [ givenParadigm ];
	return [];
}

function updateMorphotable(data, paradigm, pluralEntryWord, secondThirdConj, selector) {
	var inflections = MorphologyTables.formatInflections(data, paradigm, pluralEntryWord, secondThirdConj);
	if (inflections) {
		$(selector).html('<span class="sv_Section">Morfoloģija: </span>' + inflections);

		var indent = parseFloat($('.case-indent').css('width'));
		indent += parseFloat($('.case-indent').css('padding-right'));
		$('.sub-indent').css('margin-left', indent);
		if ($(window).width() > 768) {
			$('.sv_Section').css('font-size', $('.sv_Entry').css('font-size'));
		}
		$('.items', selector).hide();

		$('#toggle_Morphology', selector).click(function() {
			// TODO: jāvispārina kā atsevišķa f-cija
			if ($('.items', selector).is(':hidden')) {
				$('.items', selector).show();
				$(this).attr('src', 'img/collapse.svg');
				$(this).attr('class', 'collapse_SVG');
				$(this).attr('alt', '-');
			} else {
				$('.items', selector).hide();
				$(this).attr('src', 'img/expand.svg');
				$(this).attr('class', 'expand_SVG');
				$(this).attr('alt', '+');
			}
		});
	} else {
		$(selector).css('margin-top', 0);
		if (debug) console.log('Morfoloģijas nav - paradigma ' + paradigm);
	}
}

function loadContent(doc, word) {
	//$("#searchResults").html("");
	$('#mainContent').html("<img src='img/loader.gif'/>");

	$('#mainContent').load(doc + ' #doc', function() {
		document.title = $('#mainContent').find('#doc').data('title');

		if (word != null) {
			$('.sv_Link').each(function() {
				if ($(this).attr('data-hw') && $(this).attr('data-hom')) {
					$(this).attr('href', '#/sv/' + $(this).data('hw') + '/' + $(this).data('hom'));
				} else if ($(this).attr('data-w')) {
					$(this).attr('href', '#/sv/?' + $(this).data('w'));
				}
			});
			// mobile
			if ($(window).width() < 769) {
				$('.sv_Sense:has(>div)>.sv_NO').append(
					' <img src="img/expand.svg" class="toggle_Subsenses expand_SVG" width="14" height="14" alt="+"/>'
				);

				$('.sv_Subsense').hide();
				$('.sv_MWEs').hide();

				$(document).ready(function(e) {
					$('.sv_Sense').on('click', '.sv_NO', function(e) {
						$(e.delegateTarget).find('.sv_Subsense').toggle();
						$(e.delegateTarget).find('.sv_MWEs').toggle();

						if (
							$(e.delegateTarget).find('.sv_Subsense').is(':hidden') ||
							$(e.delegateTarget).find('.sv_MWEs').is(':hidden')
						) {
							$(e.delegateTarget).find('.collapse_SVG').attr('src', 'img/expand.svg');
							$(e.delegateTarget).find('.collapse_SVG').attr('alt', '-');
							$(e.delegateTarget).find('.collapse_SVG').attr('class', 'toggle_Subsenses expand_SVG');
						} else {
							$(e.delegateTarget).find('.expand_SVG').attr('src', 'img/collapse.svg');
							$(e.delegateTarget).find('.expand_SVG').attr('alt', '-');
							$(e.delegateTarget).find('.expand_SVG').attr('class', 'toggle_Subsenses collapse_SVG');
						}
					});
				});
			}

			$('.sv_Section', '.sv_Idioms').append(
				' <img src="img/expand.svg" id="toggle_Idioms" class="expand_SVG" width="14" height="14" alt="+"/>'
			);

			$('.sv_Items', '.sv_Idioms').hide();
			$('#toggle_Idioms').click(function() {
				// TODO: jāvispārina kā atsevišķa f-cija
				if ($('.sv_Items', '.sv_Idioms').is(':hidden')) {
					$('.sv_Items', '.sv_Idioms').show();
					$(this).attr('src', 'img/collapse.svg');
					$(this).attr('class', 'collapse_SVG');
					$(this).attr('alt', '-');
				} else {
					$('.sv_Items', '.sv_Idioms').hide();
					$(this).attr('src', 'img/expand.svg');
					$(this).attr('class', 'expand_SVG');
					$(this).attr('alt', '+');
				}
			});

			$('.tooltip').tooltipster({
				contentAsHTML: true,
				interactive: true,
				position: 'right',
				debug: false
			});

			// Reset search results
			$('#searchResults').load('http://tezaurs.lv/api/searchEntry?w=' + word + ' #doc', function() {
				if ($('#alternatives').length == 0) $('#exactMatch').hide();

				$('.word').each(function() {
					var hw = $(this).data('hw');
					var hom = $(this).data('hom');
					$(this).attr('href', '#/sv/' + hw + (hom == 0 ? '' : '/' + hom));
				});
			});

			// Additional services
			$('.doc').append(
				//'<div id="pronunciation"></div>' +
				//'<div id="tts"></div>' +
				'<div id="morphology"></div>'
			);
			$('#mainContent').append('<div id="examples"></div>');

			/*
            $.get('http://ezis.ailab.lv:8182/phonetic_transcriber/' + word + '?phoneme_set=ipa', function(data) {
                var phonetic_word = data.replace(/ /g, '');
                if (phonetic_word != 'Unrecognizedsymbolsinstring!') {
                    $('#pronunciation').html(
                        '<span class="sv_Section">Izruna: </span>' +
                        '<span class="ipa">' + phonetic_word + '</span>'
                    );
                } else {
                    $('#pronunciation').html('');
                }
				// TODO add 'pronunc' and 'vprefix'
            });

            $.get('http://tezaurs.lv/api/pronounce.jsp?word=' + word, function(data) {
                $('#tts').html(
                    '<audio controls="controls">' +
                        '<source src="' + data + '" type="audio/mpeg">' +
                    '</audio>'
                );
            });
            */

			// Morphology - BEGIN
			$('.doc').each(function() {
				var docId = this.id;
				var givenParadigm = $('.paradigm', '#' + docId).data('id');
				var stem1 = $('.paradigm', '#' + docId).data('stem1');
				var stem2 = $('.paradigm', '#' + docId).data('stem2');
				var stem3 = $('.paradigm', '#' + docId).data('stem3');
				var inflmisc = $('.paradigm', '#' + docId).data('inflmisc');
				var cogender = false;
				var secondThirdConj = false;
				var optSoundChange = false;
				var pluralEntryWord = false;
				var multiInflCompound = false;
				if (typeof inflmisc !== 'undefined') {
					cogender = inflmisc.split(',').indexOf('Kopdzimte') !== -1;
					secondThirdConj = inflmisc.split(',').indexOf('Otrās_un_trešās_konjugācijas_paralelitāte') !== -1;
					optSoundChange = inflmisc.split(',').indexOf('Fakultatīva_mija') !== -1;
					pluralEntryWord = inflmisc.split(',').indexOf('Daudzskaitlis') !== -1;
					multiInflCompound = inflmisc.split(',').indexOf('Vairākos_punktos_lokāms_saliktenis') !== -1;
				}

				var paradigms = multiParadigm(givenParadigm, cogender, optSoundChange, secondThirdConj);
				// FOR NOW: just ignore and to not inflect compounds that must
				//          be inflected in multiple points.
				// TODO: find something starting with "Šablons_salikteņa_vairākpunktu_locīšanai="
				//       in the inflmisc, and use pattern given there to obtain
				//       correct inflection table.
				// PROBLEM: morphology service currently do not support multipoint
				//          inflection.
				if (multiInflCompound) paradigms = [];
				var inflections = [];
				var calls_remaining = paradigms.length;

				for (i = 0; i < paradigms.length; i++) {
					var paradigm = paradigms[i];
					var localID = docId + '-morphology';
					if (cogender) {
						if (paradigm == 6 || paradigm == 8 || paradigm == 10 || paradigm == 47)
							localID = localID + '-masc';
						else localID = localID + '-fem';
						calls_remaining = 0;
					}
					selector = '#' + localID;
					if ($(selector).length == 0) {
						$('#morphology', '#' + docId).html(
							$('#morphology', '#' + docId).html() + '<div id="' + localID + '" class="morphology"></div>'
						);
					}

					if (paradigm > 0) {
						var url = api_url + '/inflections/' + word;
						url = url + '?paradigm=' + paradigms[i];
						/*
						 * TODO FIXME
						 * Šeit ir divi aprisinājumi:
						 * 1) datubāzē apsērst un piesārst ir tagadnes celmi apnull un pienull.
						 * 2) mofoserviss nesaprot, ja nav doti visi trīs celmi.
						 */
						if (
							typeof stem1 !== 'undefined' ||
							typeof stem2 !== 'undefined' ||
							typeof stem3 !== 'undefined'
						) {
							if (typeof stem1 !== 'undefined') url = url + '&stem1=' + stem1;
							else url = url + '&stem1=----';
							if (typeof stem2 !== 'undefined' && stem2 != 'apnull' && stem2 != 'pienull')
								url = url + '&stem2=' + stem2;
							else url = url + '&stem2=----';
							if (typeof stem3 !== 'undefined') url = url + '&stem3=' + stem3;
							else url = url + '&stem3=----';
						}
						if (typeof inflmisc !== 'undefined') url = url + '&inflmisc=' + inflmisc;
						if (!inflections[selector]) inflections[selector] = [];
						(function(selector, paradigm) {
							if (debug) console.log('Calling ' + paradigm + ' to selector ' + selector);
							var morph_call = $.get(url).done(function(data) {
								if (debug) console.log('Got ' + paradigm + ' to selector ' + selector);
								calls_remaining = calls_remaining - 1;
								inflections[selector] = inflections[selector].concat(jQuery.parseJSON(data)[0]);
								if (calls_remaining < 1)
									updateMorphotable(
										inflections[selector],
										paradigm,
										pluralEntryWord,
										secondThirdConj,
										selector
									);
								else if (debug) console.log('Got morphology, remaining calls: ' + calls_remaining);
							});

							morph_call.fail(function() {
								$(selector).css('margin-top', 0);
							});
						})(selector, paradigm);
					}
				}
			});
			// Morphology - END

			// Examples - BEGIN
			$.get(api_url + '/examples/' + word, function(data) {
				if (data && data.length > 0) {
					var more = data.length > 3;
					data = data.slice(0, 3);
					example_html = '';

					for (var i = 0; i < data.length; i++) {
						if (debug) console.log(data[i]);

						if ('reference' in data[i]) {
							// atsauču formāts LVK2018 datos no webservisu 2.0.5 versijas
							reference = '<i>' + data[i]['reference'] + '</i>';
						} else {
							// Atsauču formāts LVK13 datos līdz webservisu 2.0.4 versijai
							var source = data[i]['source'];
							if (source.startsWith('http')) {
								source = '';
							} else {
								source = ', <i>' + source + '</i>';
							}
							var author = data[i]['author'];
							if (!author) author = '';
							sourceauthor = author + source;
							if (sourceauthor) sourceauthor = ' &mdash; ' + sourceauthor;
							reference = '<i>' + data[i]['title'] + '</i>' + sourceauthor;
						}

						example_html += '<div class="example">';
						example_html += '<span class="sv_PI">«' + data[i]['example'].trim() + '»</span> ';
						example_html += '<small>(' + reference + ')</small>';
						example_html += '</div>';
					}

					example_html +=
						"<div class='disclaimer'>Piemēri ir atlasīti automātiski un var būt neprecīzi.</div>";

					if (more) {
						// var bonito = "http://bonito.korpuss.lv/bonito/run.cgi/first?corpname=LUMII_lidzsvarotais&iquery=" + word;
						var bonito = 'http://nosketch.korpuss.lv/run.cgi/first?corpname=LVK2018&iquery=' + word;
						example_html +=
							'<div class="example"><a href="' + bonito + '" target="_blank">Vairāk...</a></div>';
					}

					$('#examples').html(
						'<div class="sv_Section"><span>Korpusa piemēri: </span>' +
							'<img src="img/expand.svg" id="toggle_Examples" class="expand_SVG" width="14" height="14" alt="+"/></div>' +
							'<div class="items">' +
							example_html +
							'</div>'
					);
					if ($(window).width() > 768) {
						$('.sv_Section').css('font-size', $('.sv_Entry').css('font-size'));
					}
					$('.items', '#examples').hide();
					$('#toggle_Examples').click(function() {
						// TODO: jāvispārina kā atsevišķa f-cija
						if ($('.items', '#examples').is(':hidden')) {
							$('.items', '#examples').show();
							$(this).attr('src', 'img/collapse.svg');
							$(this).attr('class', 'collapse_SVG');
							$(this).attr('alt', '-');
						} else {
							$('.items', '#examples').hide();
							$(this).attr('src', 'img/expand.svg');
							$(this).attr('class', 'expand_SVG');
							$(this).attr('alt', '+');
						}
					});
				} else {
					if (debug) console.log('Piemēru nav');
				}
			});
			// Examples - END

			// Feedback form - BEGIN
			$('#mainContent').append(
				'<div class="toolbar">' +
					'<form>' +
					'<div>' +
					'<input type="button" class="twitter-button" id="twitterButton" value="Dalīties"/>' +
					'<div class="separator"></div>' +
					'<input type="button" class="feedback-submit" id="feedbackButton" value="Ziņot"/>' +
					'<div class="separator"></div>' +
					'<span id="feedbackResponse" class="feedback-status"></span>' +
					'</div>' +
					'<textarea class="feedback-text" id="feedbackText" placeholder="Vai pamanījāt šajā šķirklī kādu kļūdu vai nepilnību?"></textarea>' +
					'</form>' +
					'</div>'
			);

			$('#feedbackText').hide();

			$('#twitterButton').click(function() {
				var tweet =
					'https://twitter.com/intent/tweet?text=Sk.&url=' +
					encodeURIComponent(location.href) +
					'&via=AILab_lv';

				var width = 550,
					height = 420;
				var left = ($(window).width() - width) / 2;
				var top = ($(window).height() - height) / 2;
				var opts = 'status=yes,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;

				window.open(tweet, '', opts);

				$('#twitterButton').blur();

				return false;
			});

			$('#feedbackButton').click(function() {
				if ($('#feedbackText').is(':hidden')) {
					$('#feedbackText').show();
					$('#feedbackText').focus();
					$('#feedbackButton').val('Nosūtīt');
					$('#feedbackResponse').html('');
				} else {
					var formData = {
						word: decodeURIComponent(word),
						comment: $('#feedbackText').val()
					};

					$.post('http://tezaurs.lv/api/feedback', formData, function() {
						if ($('#feedbackText').val().trim()) {
							$('#feedbackResponse')
								.html('<span class="status-ok">Paldies!</span>')
								.show()
								.delay(3000)
								.fadeOut();
						}
						$('#feedbackText').val('');
						$('#feedbackText').hide();
						$('#feedbackButton').blur();
						$('#feedbackButton').val('Ziņot');
					}).fail(function() {
						$('#feedbackResponse')
							.html('<span class="status-fail">Neizdevās...</span>')
							.show()
							.delay(3000)
							.fadeOut();
						$('#feedbackButton').blur();
					});
				}
			});
			// Feedback form - END
		}
		if ($(window).width() > 768) {
			$('#searchField').select();
		}
	});
}

function loadResults(doc) {
	$('#mainContent').html('');
	$('#searchResults').html("<img src='img/loader.gif'/>");

	$('#searchResults').load(doc + ' #doc', function() {
		document.title = $('#searchResults').find('#doc').data('title');

		if ($('#alternatives').length == 0) $('#exactMatch').hide();

		var hw = $('#retrieve').data('hw');
		if (typeof hw !== 'undefined') {
			var link = 'sv/' + hw;

			var hom = $('#retrieve').data('hom');
			if (typeof hom !== 'undefined' && hom > 0) link = link + '/' + hom;

			$.address.history(false); // Replace the last history entry:
			$.address.value(link); // #/sv/?w with #/sv/hw[/hom]
			$.address.history(true); // to avoid looping
		}

		$('.word').each(function() {
			hw = $(this).data('hw');
			hom = $(this).data('hom');
			$(this).attr('href', '#/sv/' + hw + (hom == 0 ? '' : '/' + hom));
		});

		if ($(window).width() > 768) {
			$('#searchField').select();
		}
	});
}

$(document).ready(function() {
	$('#jsonly').css('visibility', 'visible');

	if ($(window).width() > 768) {
		$('#searchField').select();
	}

	$('#searchForm').submit(function() {
		var w = $('#searchField').val();
		$('#searchField').val('');
		if ($(window).width() > 768) {
			$('#searchField').select();
		} else {
			$('#searchField').blur();
		}
		$('#keyboard').hide();
		$.address.value('sv/?' + w);
		return false;
	});

	$('.blank').click(function() {
		$('#searchResults').html('');
		$('#sideNotes').html('');
		$('#keyboard').hide();
	});

	$('#keyboard').hide();
	$('#keyboard_SVG').click(function() {
		$('#keyboard').toggle();
		$('#searchField').focus();
	});

	$('.key').click(function() {
		$('#searchField').val($('#searchField').val() + $(this).data('letter'));
		$('#searchField').focus();
	});

	$('.img-hover')
		.mouseover(function() {
			$(this).css('opacity', 0.85);
		})
		.mouseout(function() {
			$(this).css('opacity', 1.0);
		});

	if (!Modernizr.svg) {
		$('#Tezaurs_SVG').attr('src', 'img/Tezaurs.png');
		$('#keyboard_SVG').attr('src', 'img/keyboard.png');
		$('#LU_SVG').attr('src', 'img/LU.png');
		$('#MII_SVG').attr('src', 'img/MII.png');
		$('#AILab_SVG').attr('src', 'img/AILab.png');
		$('.expand_SVG').attr('src', 'img/expand.png');
		$('.collapse_SVG').attr('src', 'img/collapse.png');
	}
});

$.address.change(function(event) {
	if (event.value.match(/\/sv\//)) {
		var w = event.value.substring('/sv/'.length).split('/');

		if (w[0].charAt(0) == '?') {
			w[0] = w[0].substring(1);
			var word = !isEncodedURIComponent(w[0]) ? encodeURIComponent(w[0]) : w[0];
			loadResults('http://tezaurs.lv/api/searchEntry?w=' + word);
		} else {
			var word = !isEncodedURIComponent(w[0]) ? encodeURIComponent(w[0]) : w[0];
			var query = 'hw=' + word + (w.length == 2 ? '&hom=' + w[1] : '');
			loadContent('http://tezaurs.lv/api/retrieveEntry?' + query, word);
		}
	} else if (event.value != '/') {
		loadContent(event.value.substring(1) + '.html', null);
	} else {
		$('#searchResults').html('');
		$('#mainContent').html('');
		$('#sideNotes').html('');
		$(document).prop('title', 'Tēzaurs');
	}
});
