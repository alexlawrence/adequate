import '../../dist/adequate';
import german from './translations/german';
import english from './translations/english';
import useFlashMessage from './use-flash-message';
import pictures from './pictures';
import speak from './speak';

const { e: element, h: html, u: useState } = window.adequate;

const translations = { german, english };

const generateRandomNumber = (minimum, maximum) =>
  minimum + Math.round(Math.random() * (maximum - minimum));

const generateRandomNumbers = (minimum, maximum, count) =>
  Array.from({ length: count }, () => generateRandomNumber(minimum, maximum));

const possibleCounts = Array.from({ length: 11 }, (_, index) => index);

customElements.define(
  'x-counting-game',
  element(() => {
    const [gameState, setGameState] = useState({
      numberList: [],
      numberToCount: 0,
    });
    const [language, setLanguage] = useState('german');
    const [isMuted, setIsMuted] = useState(false);
    const currentTranslations = translations[language];
    const startNewRound = () => {
      const numberToCount = generateRandomNumber(1, 10);
      setGameState({
        numberList: generateRandomNumbers(1, 10, 10),
        numberToCount,
      });
      const text = currentTranslations.question.replace(
        '$1',
        currentTranslations.words[numberToCount - 1]
      );
      if (!isMuted) speak(text, language);
    };
    if (!gameState.numberList.length) startNewRound();
    const [flashMessage, showFlashMessage] = useFlashMessage(2000);

    const guessCount = guessedCount => {
      const isCountRight =
        guessedCount ==
        gameState.numberList.filter(number => number == gameState.numberToCount).length;
      if (isCountRight) {
        if (!isMuted) speak(currentTranslations.rightGuessMessage, language);
        showFlashMessage('🎉😃🎉', startNewRound);
      } else {
        if (!isMuted) speak(currentTranslations.wrongGuessMessage, language);
        showFlashMessage('😟😟😟');
      }
    };

    return html`
      <div class="languages">
        <button onclick="${() => setIsMuted(!isMuted)}">
          ${isMuted ? '🔇' : '🔈'}
        </button>
        <button onclick="${() => setLanguage('german')}">🇩🇪</button>
        <button onclick="${() => setLanguage('english')}">🇺🇸</button>
      </div>
      <div class="picture-to-count">
        ${pictures[gameState.numberToCount - 1]}
      </div>
      <div class="pictures">
        ${gameState.numberList.map(number => pictures[number - 1])}
      </div>
      <div class="count-buttons">
        ${possibleCounts.map(
          count => html`
            <button onclick="${() => guessCount(count)}">${count}</button>
          `
        )}
      </div>
      <div class="flash-message ${flashMessage ? 'visible' : ''}">
        ${flashMessage}
      </div>
    `;
  })
);
