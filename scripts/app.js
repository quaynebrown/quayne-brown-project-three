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
    if(spellingApp.words.includes(scrambledWord)){
        spellingApp.shuffleLetters(scrambledWord);
    }
    console.log(scrambledWord)
    return scrambledWord;
}


//get the amount of <li>'s currently on the page
spellingApp.getAmountOfLi = function() {
    spellingApp.listCount = spellingApp.listCount ? $('li').length + 1 : 0;
    console.log(spellingApp.listCount)
}


// 2. Add event listener for when the user click 'Submit & Play!'
$('.letsPlay').on('click', function(e){
    e.preventDefault();
    // scramble the words and store in a new array
    
    // Take the user to a new page to unscramble the words

    // generate a list of inputs for the user to unscramble their words
});
    
    
const $userInput = $('#user-word');
const $wordCount = $('.word-count');
// 1. Add event listener for when the user click 'add word'
$('.add-word').on('click', function(e){
    e.preventDefault();
    const word = $userInput.val();
    // push each word to a words array
    spellingApp.words.push(word);

    // clear the input field and add focus
    $userInput.val('');
    $userInput.focus();
    spellingApp.getWordCount();
});
    // display the words on the screen for the user to see
    // display the total number of words entered

// get word count plus 1
spellingApp.getWordCount = () => {
    $wordCount.text(spellingApp.words.length + 1);
}



spellingApp.init = function (){
    spellingApp.getWordCount();
    $('.letsPlay').attr('disabled', true);
}

// wait for DOM to be ready
$(() => {
    spellingApp.init();
    console.log('ready');
})

//TODO: create a json file that stores the predefined words and have the ability to add new words from the user input