const intents = [
  {
    patterns: [
      "how to donate",
      "donate medicine",
      "donation",
      "give medicine"
    ],
    response: "To donate medicines, login as Donor, complete your profile, and add available medicines."
  },

  {
    patterns: [
      "need medicine",
      "want medicine",
      "get medicine",
      "find medicine",
      "find donor",
      "medicine help"
    ],
    response: "Go to the Find Medicine page, use AI recommendation or select city and medicine to see donors."
  },

  {
    patterns: [
      "expired",
      "expiry",
      "old medicine"
    ],
    response: "Expired medicines are not allowed for safety reasons."
  },

  {
    patterns: [
      "ai",
      "ai recommendation",
      "how ai works",
      "recommend"
    ],
    response: "Our AI analyzes symptoms using NLP and recommends suitable medicines."
  }
];


function getBotReply(msg) {
  msg = msg.toLowerCase().trim();

  for (let intent of intents) {
    for (let p of intent.patterns) {
      if (msg.includes(p)) {
        return intent.response;
      }
    }
  }

  return "I can help with donating medicine, finding medicines, AI recommendations, or safety guidelines.";
}


module.exports = { getBotReply };
