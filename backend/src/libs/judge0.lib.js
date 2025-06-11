import axios from "axios";

// 1. Setup Judge0 axios instance with RapidAPI headers
const judge0 = axios.create({
  baseURL: process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com",
    "Content-Type": "application/json",
  },
});

// 2. Language Map
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    "PYTHON": 71,
    "JAVA": 62,
    "JAVASCRIPT": 63,
  };

  return languageMap[language.toUpperCase()];
};

// 3. Sleep utility
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 4. Poll results for all tokens until done
export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await judge0.get(`/submissions/batch`, {
      params: {
        tokens: tokens.join(","),
        base64_encoded: false,
      },
    });

    const results = data.submissions;

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return results;
    await sleep(1000);
  }
};

// 5. Submit code batch
export const submitBatch = async (submissions) => {
  const { data } = await judge0.post(`/submissions/batch?base64_encoded=false`, {
    submissions,
  });

  console.log("Submission Results: ", data);
  return data; // [{token}, {token}, ...]
};

// 6. Map languageId back to readable name
export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };

  return LANGUAGE_NAMES[languageId] || "Unknown";
}
