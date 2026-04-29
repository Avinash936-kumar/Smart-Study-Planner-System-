const roadmaps = {
  javascript: "JS Roadmap:\\n1. Variables & Data Types\\n2. Functions & Scope\\n3. DOM Manipulation\\n4. Promises & Async/Await\\n5. ES6+ Features",
  python: "Python Roadmap:\\n1. Syntax & Variables\\n2. Lists, Tuples, Dictionaries\\n3. Functions & Modules\\n4. OOP\\n5. Web frameworks (Django/Flask)",
  java: "Java Roadmap:\\n1. Basic Syntax\\n2. OOP Concepts (Inheritance, Polymorphism)\\n3. Collections Framework\\n4. Multithreading\\n5. Spring Boot",
  c: "C Roadmap:\\n1. Data Types & Variables\\n2. Control Flow\\n3. Functions & Pointers\\n4. Memory Management (malloc/free)\\n5. File I/O",
  react: "React Roadmap:\\n1. JSX & Components\\n2. State & Props\\n3. Hooks (useState, useEffect)\\n4. Context API\\n5. React Router"
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();
    
    let reply = "I'm your Study Assistant! I can help you with study plans, reminders, or generate roadmaps for programming languages (e.g., 'roadmap python').";

    // Simple Rule-Based Engine
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply = "Hello! Ready to crush your goals today? How can I help?";
    } else if (lowerMsg.includes('roadmap')) {
      let found = false;
      for (const key in roadmaps) {
        if (lowerMsg.includes(key)) {
          reply = roadmaps[key];
          found = true;
          break;
        }
      }
      if (!found) reply = "I don't have a roadmap for that language yet. Try 'roadmap javascript', 'python', 'java', 'c', or 'react'.";
    } else if (lowerMsg.includes('exam') || lowerMsg.includes('test')) {
      reply = "Make sure you check the 'Spaced Repetition' page to revise topics efficiently before your exam!";
    } else if (lowerMsg.includes('plan') || lowerMsg.includes('schedule')) {
      reply = "I suggest completing your High Priority tasks first. You can use the Pomodoro timer on the Focus page to stay productive.";
    } else if (lowerMsg.includes('tired') || lowerMsg.includes('break')) {
      reply = "It's important to rest! Take a 15-minute break. Grab some water, stretch, and come back refreshed.";
    }

    // Simulate network delay for AI feel
    setTimeout(() => {
      res.status(200).json({ success: true, data: reply });
    }, 1000);

  } catch (error) {
    res.status(500).json({ success: false, message: 'AI Error' });
  }
};
