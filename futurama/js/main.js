$(document).ready(function(){		


var baseUrl = "https://mockapi-unadjzzymg.now.sh"; 
var questions;
var userName;
var questionIndex;
var userScore;

var questionsAjax = {
	url: baseUrl + '/questions',
	method: 'GET'
};

$.when($.ajax( questionsAjax ) )
.done(function(q){
	questions = q;
	init();
})
.fail(function(err){
	console.log(err);
	console.log('Seems we have a ' + err.status + ' on one or more ajax requests');
});

//DOM
var $userName = $('#userName');
var $currentQuestionNumber = $('#currentQuestionNumber');
var $totalQuestions = $('#totalQuestions');
var $userScore = $('#userScore');
var $questionBlock = $('#questionBlock');
var $questionDisplay = $('#questionDisplay');
var $possibleAnswersDisplay = $('#possibleAnswersDisplay');
var $finalAnswer = $('#finalAnswer');
var $questionBtn = $('#questionBtn');
var $resetBtn = $('#resetBtn');

//events
$finalAnswer.click(function(e){
		checkAnswer();
});

$questionBtn.click(function(e){
	$questionBtn.addClass('hidden');
	if(questionIndex == questions.length){
		endOfQuiz();
	} else {
		nextQuestion();
		$finalAnswer.removeClass('hidden');
	}
});

$resetBtn.click(function(e){
	$resetBtn.addClass('hidden');
	$finalAnswer.removeClass('hidden')
	init();
});
//end of events

//functions
function init() {

	$possibleAnswersDisplay.empty();
	$totalQuestions.text(questions.length);
	questionIndex = 0;
	userScore = 0;
	$userScore.text(userScore);
	getUserName();
	nextQuestion();

}


function getUserName() {

	$("#getNameModal").modal('show');

	$('#getNameModal').on('submit', function(e){
		e.preventDefault();
		userName = $('#name').val();
		$('.modal').modal('hide');
	});//end on submit

	$("#getNameModal").on("hidden.bs.modal", function () {
  		if(typeof userName == 'undefined' || userName.length == 0){
  			userName = "Dr.Anonymous";
  		}
  		$userName.text(userName);
	})//end on modal close
	
}
	
function nextQuestion() {

	$currentQuestionNumber.text(questionIndex + 1);
	flipDiv();
	var current = questions[questionIndex];
	$questionDisplay.text(current.question);
	$.each(current.possibleAnswers, function(index, value){
	$possibleAnswersDisplay.append('<div class="radio-button"><input type="radio" id="answer'+index+'"name="finalAnswer" value="'+ value +'" /><label for="answer'+index+'">'+ value +'</label></div>');
	});

}
	
function flipDiv() {

	$questionBlock.toggleClass('flipped');

}

function checkAnswer(){

	var answer = $('input[name=finalAnswer]:radio:checked').val();
	
	if(answer == undefined){ 
		alert('you did not choose an answer');
	} else {
		$finalAnswer.addClass('hidden');	
		$questionDisplay.empty();
		$possibleAnswersDisplay.empty();
		if(answer == questions[questionIndex].correctAnswer) {
		$questionDisplay.text('CORRECT!');
		userScore++;	
		} else {
		$questionDisplay.text('NOPE');
		}
		questionIndex ++;
		$userScore.text(userScore);
		$questionBtn.removeClass('hidden');
	}

}

function endOfQuiz() {

	$questionDisplay.html('<h1>That\'s all Folks!</h1>');
	var finalScore = ~~((userScore / questions.length) * 100);
	$possibleAnswersDisplay.html('<h2>You got '+ finalScore +'% correct</h2>');
	if(finalScore <= 50) {
		$possibleAnswersDisplay.append('<p>Pretty sure you\'ve never seen this show before.  Clear your schedule and get watching ASAP.</p>'); 
	} else if (finalScore > 50 && finalScore < 85) {
		$possibleAnswersDisplay.append('<p>Not bad, but we recommend a refresher.  Netflix and Chill with Ziodberg this weekend?</p>');
	} else if (finalScore >= 85) {
		$possibleAnswersDisplay.append('<p>Well well, aren\'t we fancy with our super high score.  Congratulations, you\'re a showoff, are you happy now?</p>');

	}
	$resetBtn.removeClass('hidden');

}

}); 


