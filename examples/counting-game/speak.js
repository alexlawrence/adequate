const voices = window.speechSynthesis.getVoices();
const voicesByLanguage = {
  german: voices.find(voice => voice.lang == 'de-DE') || voices[0],
  english: voices.find(voice => voice.lang == 'en-EN') || voices[0],
};

export default (text, language) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.3;
  utterance.voice = voicesByLanguage[language];
  window.speechSynthesis.speak(utterance);
};
