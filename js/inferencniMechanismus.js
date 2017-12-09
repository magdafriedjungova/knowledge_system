function say(question, answer, probability) {
	i++;
	dataStepBack = jQuery.extend(true, {}, data);
	$.each(data, function(_key,_element) {
		if(_element[question] == answer) {
			delete _element[question];
			_element.probability += parseFloat(probability);
		} else {
			if( probability == 1 || probability == 0 ) {
				delete data[_key];
			} else {
				delete _element[question];
				_element.probability += parseFloat(1-probability);
			}
		}
	});
}

function shouldContinueInGame() {
	var _possibilities = Object.keys(data).length;
	if( _possibilities == 0) {
		endGame(false);
		return false;
	} else if( _possibilities == 1) {
		endGame(true, Object.keys(data)[0]);
		return false;
	} else if (_possibilities < 50) {
		var _maximum1 = 0;
		var _maximum2 = 0;
		var _answer;
		$.each(data, function(_key, _elem) {
			if( _elem.probability >= _maximum1) {
				_maximum2 = _maximum1;
				_maximum1 = _elem.probability;
				_answer = _key;
			}
		});

		if( (_maximum1-_maximum2) >= 2) {
			endGame(true, _answer);
			return false;
		}
	}

	if(Object.keys(data[Object.keys(data)[0]]).length == 1) {
		var _maximum1 = 0;
		var _answer;
		var _sameProbabilityElements = 0;
		var _sum = 0;
		var _results = [];
		$.each(data, function(_key, _elem) {
			if( _elem.probability > _maximum1 ) {
				_maximum1 = _elem.probability;
				_answer = _key;
				_sameProbabilityElements = 1;
			} else if(_elem.probability == _maximum1) {
				_sameProbabilityElements++;
			}
			_sum += _elem.probability;
			_results.push({"name":_key,"probability":_elem.probability});
		});

		if( _sameProbabilityElements > 1) {
			_results.sort(function(a,b) {return (a.probability > b.probability) ? -1 : ((b.probability > a.probability) ? 1 : 0)});
			endGame(false, _sameProbabilityElements,_results,_sum);
		} else {
			endGame(true, _answer);
		}
		return false;
	}
	return true;
}

function stepBack() {
	data = jQuery.extend(true, {}, dataStepBack);
	i--;
}

function play(back) {
	if( !shouldContinueInGame() ) {
		previousQuestion = tmpQuestion;
		return;
	}
	var question;
	if(back != undefined) {
		_question = previousQuestion;
	} else {
		_question = Object.keys(data[Object.keys(data)[0]])[getRandomInt(0,Object.keys(data[Object.keys(data)[0]]).length-1)];
	}

	previousQuestion = tmpQuestion;
	tmpQuestion = _question;

	generateQuestion(_question);
	generateInputs(_question);
	if(i == 0) {
		$("[name=stepBack]").prop("disabled",true);
	} else {
		$("[name=stepBack]").prop("disabled",false);
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var i=0;
$("form").show();
$("#result").hide();
$("#multipleResults").hide();
$("#numberSubmit").hide();
$("[name=dunnoSubmit]").hide();

$.each(data, function(key, attrs) {
	$.each(attrs, function(attrkey, attr) {
		if( meta[attrkey] == undefined ) {
			$.each(data, function(key, element) {
				delete element[attrkey];
			});
		}
	});
	attrs["probability"] = 0;
	return;
});

var tmpQuestion;
var previousQuestion;
play();