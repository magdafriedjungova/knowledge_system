var $booleanSubmit = $("#booleanSubmit");
var $setSubmit = $("#setSubmit");
var $numberSubmit = $("#numberSubmit");
var $question = $("#question");
var $result = $("#result");
var $dunnoSubmit = $("[name=dunnoSubmit]");
var $stepBack = $("[name=stepBack]");

$("form").on("click","[name=numberSubmit]", function() {
	if($("[name=number]").val() == "" ) {
		$("name='number'").focus();
		return false;
	}
	var _question = $question.attr("name");
	var _answer = $("[name=number]").val();
	$numberSubmit.hide();
	$dunnoSubmit.hide();
	say(_question,_answer,1);
	play();
});

$("form").on("keypress","[name=number]", function(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
});

$("form").on("click","[name=set]", function() {
	var _question = $question.attr("name");
	var _answer = $(this).text();
	$setSubmit.hide();
	$dunnoSubmit.hide();
	say(_question,_answer,1);
	play();
});
$("form").on("click", "[name=boolean]", function() {
	var _question = $question.attr("name");
	var _probability = $(this).val();
	var _answer = (_probability > 0.5?true:false);
	$booleanSubmit.hide();
	say(_question,_answer,_probability);
	play();
});

$("form").on("click", "[name=dunnoSubmit]", function() {
	var _question = $question.attr("name");
	var _answer = false;
	$numberSubmit.hide();
	$setSubmit.hide();
	$booleanSubmit.hide();
	$dunnoSubmit.hide();
	say(_question,_answer,0.5);
	play();
});

$("[name=stepBack]").on("click", "", function() {
	stepBack();
	$(".jumbotron").css("align-items","center");
	$question.show();
	$result.hide();
	$("p").show();
	$("img").show();
	$(".jumbotron").attr("class","jumbotron");
	$numberSubmit.hide();
	$setSubmit.hide();
	$booleanSubmit.hide();
	$dunnoSubmit.hide();
	$("form").show();
	$result.hide();
	play(true);
	$("[name=stepBack]").prop("disabled",true);
});

$("form").submit(function(event) {
	event.preventDefault();
	if( $("[name=numberSubmit]").length != 0 ) {
		if($("[name=number]").val() == "" ) {
			$("name='number'").focus();
			return false;
		}
		var _question = $question.attr("name");
		var _answer = $("[name=number]").val();
		$numberSubmit.hide();
		$dunnoSubmit.hide();
		say(_question,_answer,1);
		play();
	}
});

function generateQuestion(question) {
	var _output;
	$question.attr("name", question);
	if( meta[question].question != undefined ) {
		_output = meta[question].question;
	} else {
		switch(meta[question].type) {
			case "id":
				break;
			case "number":
				_output = "How many "+ question +" are on the flag?";
				break;
			case "set":
				_output = "Choose "+ question +" on the flag.";
				break;
			case "boolean":
				_output = "Is "+ question +" on the flag?";
				break;
			default:
				throw Exception("Unsupported type.");
				break;
		}
	}
	$question.html(_output);
}

function generateInputs(question) {
	switch(meta[question].type) {
		case "id":
			break;
		case "number":
			generateNumberInputs(question);
			break;
		case "set":
			generateSetInputs(question);
			break;
		case "boolean":
			generateBooleanInputs(question);
			break;
		default:
			throw Exception("Unsupported type.");
			break;
	}
}

function generateNumberInputs(question) {
	$("[name=number]").val("");
	$dunnoSubmit.show();
	$("[name=number]").focus();
	$numberSubmit.show();
}

function generateSetInputs(question) {
	$setSubmit.find(".input-group").html("");
	$.each(meta[question].values, function(_key, _value) {
		_span = generateInputGroup();
		_elem = document.createElement("button");
		_elem.setAttribute('type',"button");
		_elem.setAttribute('name',"set");
		_elem.setAttribute('class',"btn btn-primary btn-lg");
		_elem.setAttribute('value',_value);
		_elem.innerHTML=_value;
		_span.appendChild(_elem);
		$setSubmit.find(".input-group").append(_span);
	});
	$dunnoSubmit.show();
	$setSubmit.show();
}

function generateBooleanInputs(question, data, metainfo) {
	$booleanSubmit.find(".input-group").html("");
	_possibilities = {
		"Yes": 1,
		"Probably": 0.75,
		"I don't know": 0.5,
		"Probably not": 0.25,
		"No": 0
	};
	$.each(_possibilities, function(_name, _possibility) {
		_span = generateInputGroup();
		_elem = document.createElement("button");
		_elem.setAttribute('type',"button");
		_elem.setAttribute('name',"boolean");
		_elem.setAttribute('value', _possibility );
		_elem.setAttribute('class',"btn btn-primary btn-lg");
		_elem.innerHTML = _name;
		_span.appendChild(_elem);
		$booleanSubmit.find(".input-group").append(_span);
	});
	$booleanSubmit.show();
}

function generateInputGroup() {
	_elem = document.createElement("span");
	_elem.setAttribute("class","input-group-btn");
	return _elem;
}

function endGame(found,answer) {
	$question.hide();
	$numberSubmit.hide();
	$setSubmit.hide();
	$booleanSubmit.hide();
	$dunnoSubmit.hide();
	$("#form").hide();
	$result.show();
	$(".jumbotron").css("align-items","flex-end");
	$("[name=stepBack]").prop("disabled",false);
	$result.show();
	if(found) {
		if(answer == "USA") {
			$result.find('#funnyImage').attr("src","css/sheldonUSA.png");
			$result.find('#funnyImage').css("width","50%");
		} else if(answer == "Czechoslovakia") {
			$result.find('#funnyImage').attr("src","css/sheldonCzechoslovakia.png");
			$result.find('#funnyImage').css("width","80%");
		} else {
			$result.find('#funnyImage').attr("src","css/sheldonandamy.png");
			$result.find('#funnyImage').css("width","80%");
		}
		$result.find("#answer").text("I think it is flag of "+answer+".");
		if( flagsShortcuts[answer] != undefined ) {
			$result.find('#flag').attr("src",'data/flags-normal/'+flagsShortcuts[answer]);
		} else {
			$result.find('#flag').hide();
		}
	} else {
		$(".jumbotron").css("align-items","center");
		$result.find("#answer").text("No flag has these attributes.");
		$result.find('#flag').hide();
		$result.find('#funnyImage').attr("src","css/notfound.jpg");
		$result.find('#funnyImage').css("width","70%");
	}
}