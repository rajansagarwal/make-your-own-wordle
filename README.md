So, you want to make your own wordle? I've got your back.

## Wordle Template

Wordle has taken the world by storm, but so has its clones. From [Heardle](https://www.heardle.app/), where you can listen to snippets of songs, or [Worldle](https://worldle.teuteuf.fr/), which makes you guess a country based on its geography, this is the peak of knowledge-based games. So, here's how you can make one yourself.

Once you fork this repository, open it in this [Replit](https://replit.com/@rajnagrwl/make-your-own-wordle), fork the repository and click "Run". Or, you can fork this Github Repository, open it in your preferred IDE and open it on your local host. 

Once completed, head to your `index.html` file and start changing some of the data. You can change the `<title>` and the content within the `<h1>` and `<h4>` to customize it however you want! 

Then, go to your `guess.js` file and you will see an array of values. These are all the correct possible options, one of which will be randomly selected every time someone opens the game. When selected, the length of this value will automatically be considered and will change the number of columns in the game. 

Once you have added your own words, run the code and at every refresh, a word will appear and all is ready to guess! And just like that, you've made your own version of wordle.

Notes:
- The only library being installed is Toastr: this is what helps us make notifications depending on the number of words, incorrect responses or success modals!
- All the styling is done in `styles.css`, except for the three colours of for correct, wrong location and wrong letter. If you want to theme your colours differently, just update the hex codes in `script.js`

Thanks, and happy hacking!