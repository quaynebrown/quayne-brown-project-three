const spellingApp = {};
spellingApp.words = [];
spellingApp.scrambledWords = [];

//font awesome ID counter
spellingApp.faIdCount = 0;

// take a word and shuffle the characters
spellingApp.shuffleLetters =  (word) => {
    let wordLength = word.length;
    let scrambledWord = '';

    //character array
    const charArray = word.split('');

    // take a random character from the given word and concat to a new string then
    // delete that character from the array
    while(wordLength !== 0){
        const randomNumber = Math.floor(Math.random() * wordLength);
        scrambledWord += charArray[randomNumber];
        charArray.splice(randomNumber, 1); // remove 1 character from random index
        wordLength--;
    }

    // call back the function if the word did not scramble
    if(word == scrambledWord){
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

// reset the game when the user press 'new game'
spellingApp.resetGame = () => {
    spellingApp.words = [];
    spellingApp.scrambledWords = [];
    spellingApp.displayResult(0);
    spellingApp.swapForms1st();
    spellingApp.setWordCount();
    $('.words').empty();
    $('#scrambledWords').empty();
}

// display the result after the user submit their answers
spellingApp.displayResult = (correctAnswersCount) => {
    // display result
    $('.result span').text(`${correctAnswersCount}/${spellingApp.words.length}`);
    $('.result-percentage span').text(spellingApp.calculatePercentage(correctAnswersCount) +'%');
}

// set word count and display them on the page
spellingApp.setWordCount = () => {
    $wordCount.text(spellingApp.words.length + 1);
    $wordIndex.text(spellingApp.words.length);
}

// Swap between the two forms
// show form 1 and hide form 2
spellingApp.swapForms1st = () => {
    $('#form-1-container').removeClass('hide-section')
    .attr('aria-hidden', true);
    $('#form-2-container').removeClass('show-section')
    .attr('aria-hidden', false);
}

// swap between the two forms
// show form 2 and hide form 1
spellingApp.swapForms2nd = () => {
    $('#form-1-container').addClass('hide-section')
    .attr('aria-hidden', true);
    $('#form-2-container').addClass('show-section')
    .attr('aria-hidden', false);
}

// Allow the user to delete a word after they click on the 'fa-minus-circle'
$('.words').on('click', '.fa-minus-circle', function() {
    // store the text that is in the <p> tag next to 'this' fa-minus-circle
    const wordToDelete = $(this).siblings('p').text();

    // find the index in the array that contains this word
    const indexToDelete = spellingApp.words.findIndex((element) => {
        return element.toLowerCase() == wordToDelete.toLowerCase();
    });

    // delete 1 word from the given index
    spellingApp.words.splice(indexToDelete, 1);

    // update the new word count
    spellingApp.setWordCount();

    // remove the container of the deleted word
    $(this).parent().removeClass('list-item').empty();
})

// event listener for when the user click 'new game'
$('#new-game').on('click', function() {
    spellingApp.resetGame();
});

// event listener for when the user click 'play again'
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

// event listener for when the user click 'Submit your answers'
$('#form-2').on('submit', function(e){
    e.preventDefault();
    let correctAnswersCount = 0;
    let index = 0;

    $('.unscrambled-word').each(function (){
        const unscrambledWord = $(this).val().toLowerCase().trim();

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

    $('#play-again').attr('disabled', false).removeClass('disable');

    // display result
    spellingApp.displayResult(correctAnswersCount);
})

// 2. event listener for when the user click 'Let's Play!'
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

    const word = $userInput.val().trim();
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
0

// initializing app
spellingApp.init = function (){
    spellingApp.setWordCount() ;
    $('.letsPlay, #play-again').attr('disabled', true).addClass('disable');
}

// wait for DOM to be ready
$(() => {
    spellingApp.init();
})
