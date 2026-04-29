const QuoteCard = () => {
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Education is the most powerful weapon to change the world.", author: "Nelson Mandela" },
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
    { text: "Study hard what interests you the most in the most undisciplined way.", author: "Richard Feynman" },
  ];

  // Pick quote based on day of year for consistency within a day
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const quote = quotes[dayOfYear % quotes.length];

  return (
    <div className="glass-card p-5 bg-gradient-to-br from-primary-500/5 to-accent-500/5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-200 italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-xs text-surface-400 mt-2 font-semibold">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
