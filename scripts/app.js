// make an app that:
// Description of project
// Let the user enter their own words then unscramble the words for the user to spell.

// MVP
// 1. the user input an infinite number of words
// 2. the user to submit the words
// 3. randomize each character in each word and store the word in a new array
// 4. generate html that shows the user the randomized words and allow the user to input the correct spelling
// 5. The user submit their answers
// 6. calculate the result

// Stretch goals
// 1. Allow the user to select if they want to unscramble the words or if they want to fill in the blanks instead.
// 2. Show a list of words that the user has entered after they add a new word
// 3. Add play again feature

// pseudoCode
// 1. Add event listener for when the user click 'add word'
    // push each word to a words array
    // display the words on the screen for the user to see
    // display the total number of words entered
    // clear the input field and add focus

// 2. Add event listener for when the user click 'Submit & Play!'
    // scramble the words and store in a new array
    // Take the user to a new page to unscramble the words
    // generate a list of inputs for the user to unscramble their words
    
// 3. Add event listener for when the user click 'Submit your answers'
    // compare the user's input with the words that are in the original array
    // Calculate how much they got right
    // calculate the percentage
    // display result
        

const spellingApp = {};
spellingApp.words = [];
spellingApp.scrambledWords = [];
spellingApp.faIdCount = 0;

// take a word and shuffles the characters
spellingApp.shuffleLetters =  (word) => {
    let wordLength = word.length;
    let scrambledWord = '';

    //character array
    const charArray = word.split('');

    while(wordLength !== 0){
        const randomNumber = Math.floor(Math.random() * wordLength);
        scrambledWord += charArray[randomNumber];
        charArray.splice(randomNumber, 1); // remove 1 character from random index
        wordLength--;
    }

    // call back the function if the word did not scramble
    if(word === scrambledWord){
        spellingApp.shuffleLetters(scrambledWord);
    }

    return scrambledWord;
}

// generate a list of scrambled words for the user to spell
spellingApp.generateListItems = (word, index) => {
    const listItem = `
        <li class="word-container input-container">
            <label for="shuffle-${index}">${word}</label>
            <input type="text" autocomplete="off" class="unscrambled-word" id="shuffle-${index}" placeholder="spell your word" required>
        </li>
    `

    $('#scrambledWords').append(listItem);
}

// calculate and return the percentage of correct answers
spellingApp.calculatePercentage = (correctAnswers = 0) => {
    const result = correctAnswers !== 0 ? (correctAnswers / spellingApp.words.length) * 100 : 0;
    return result.toFixed(2);
}

spellingApp.resetGame = () => {
    spellingApp.words = [];
    spellingApp.scrambledWords = [];
    spellingApp.displayResult(0);
    spellingApp.swapForms1st();
    spellingApp.setWordCount();
    $('.words').empty();
    $('#scrambledWords').empty();
}

spellingApp.displayResult = (correctAnswersCount) => {
    // display result
    $('.result span').text(`${correctAnswersCount}/${spellingApp.words.length}`);
    $('.result-percentage span').text(spellingApp.calculatePercentage(correctAnswersCount) +'%');
}

// Display forms to display the initial form for the user to enter new words
spellingApp.swapForms1st = () => {
    $('#form-1-container').removeClass('hide-section')
    .attr('aria-hidden', true);
    $('#form-2-container').removeClass('show-section')
    .attr('aria-hidden', false);
}

// Display forms to display the the second form for the user to spell their words to be compared
spellingApp.swapForms2nd = () => {
    $('#form-1-container').addClass('hide-section')
    .attr('aria-hidden', true);
    $('#form-2-container').addClass('show-section')
    .attr('aria-hidden', false);
}

$('.words').on('click', '.fa-minus-circle', function() {
    const wordToDelete = $(this).siblings('p').text();
    const indexToDelete = spellingApp.words.findIndex((element) => {
        return element.toLowerCase() == wordToDelete.toLowerCase();
    });
    spellingApp.words.splice(indexToDelete, 1);
    spellingApp.setWordCount();
    $(this).parent().removeClass('list-item').empty();
})

// new game
$('#new-game').on('click', function() {
    spellingApp.resetGame();
});

// play again
$('#play-again').on('click', function() {
    $('#answer-submit').attr('disabled', false).removeClass('disable');
    // clear all input field
    $('.unscrambled-word').each(function (){
        const unscrambledWord = $(this).val('');

        //remove class from all input
        $(this).removeClass('wrongAnswer correctAnswer').attr('disabled', false);
    });

    $('#play-again').attr('disabled', true).addClass('disable');

    //reset calculation
    $('.result span').text(`0/${spellingApp.words.length}`)
    $('.result-percentage span').text('0.00%')
});

// Add event listener for when the user click 'Submit your answers'
$('#form-2').on('submit', function(e){
    e.preventDefault();
    let correctAnswersCount = 0;
    let index = 0;

    $('.unscrambled-word').each(function (){
        const unscrambledWord = $(this).val().toLowerCase();

        $(this).attr('disabled', true);
        // compare the user's input with the words that are in the original array
        if (spellingApp.scrambledWords[index].userWord == unscrambledWord){
            // Calculate how much they got right
            correctAnswersCount++;
            // add a class to identify that the answer is correct
            $(this).addClass('correctAnswer').removeClass('wrongAnswer');

        }else{
            // add a class to identify that the answer is incorrect
            $(this).addClass('wrongAnswer').removeClass('correctAnswer');
        }

        index++;
    });

    $('#answer-submit').attr('disabled', true).addClass('disable');
    $('#play-again').attr('disabled', false).removeClass('disable');

    // display result
    spellingApp.displayResult(correctAnswersCount);
})

// 2. Add event listener for when the user click 'Submit & Play!'
$('.letsPlay').on('click', function(e){
    e.preventDefault();
    // scramble the words and store in a new array
    spellingApp.words.forEach((word) => {
        let scrambledWord = spellingApp.shuffleLetters(word)

        spellingApp.scrambledWords.push({
            scrambledWord: scrambledWord,
            userWord: word,
        });
    });

    // Take the user to a new page to unscramble the words
    spellingApp.swapForms2nd();
    
    spellingApp.scrambledWords.forEach((wordSet, index) => {
        spellingApp.generateListItems(wordSet.scrambledWord, index);
    })
});
    
// caching selectors   
const $userInput = $('#user-word');
const $wordCount = $('.word-count');
const $wordIndex = $('.word-index')
// 1. Add event listener for when the user click 'add word'
$('#form-1').on('submit', function(e){
    e.preventDefault();
    $('.err-container').empty();

    const word = $userInput.val();
    if(word !== ''){
        // push each word to a words array
        spellingApp.words.push(word.toLowerCase());
    
        const newWord = `
        <li class="list-item">
            <i id="fa${++spellingApp.faIdCount}" class="fas fa-minus-circle"></i>
            <p>${word}</p> 
        </li>`;
    
        // print a list of all the words entered
        $('.words').append(newWord);
    
        // clear the input field and add focus
        $userInput.val('');
        $userInput.focus();
        $('.letsPlay').attr('disabled', false).removeClass('disable');
        spellingApp.setWordCount();

    }else{
        // this block should never run
        // alert('You did not enter a word!');
        $('.err-container').html('<p>You did not enter a word!</p>')
    }
});

// set word count on the page
spellingApp.setWordCount = () => {
    $wordCount.text(spellingApp.words.length + 1);
    $wordIndex.text(spellingApp.words.length);
}

// initializing app
spellingApp.init = function (){
    spellingApp.setWordCount() ;
    $('.letsPlay, #play-again').attr('disabled', true).addClass('disable');
    // $('#form-2-container').addClass('show-section');
}

// wait for DOM to be ready
$(() => {
    spellingApp.init();
})

//TODO: create a json file that stores the predefined words and have the ability to add new words from the user input