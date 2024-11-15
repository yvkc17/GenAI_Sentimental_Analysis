import React, { useState } from "react";
import { analyzeSentiments } from "../../api/sentimentAPI";
import "../../components/SentimentAnalyzer/index.css";

const SentimentAnalyzer = () => {
  const [reviewText, setReviewText] = useState("");
  const [file, setFile] = useState(null);
  const [inputMethod, setInputMethod] = useState("text");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);

    try {
      let payload = { inputMethod };
      if (reviewText.trim()) {
        payload.reviewText = reviewText;
      } else if (file) {
        const fileContent = await file.text();
        payload.fileContent = fileContent;
      }

      const result = await analyzeSentiments(payload);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error during sentiment analysis:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container">
      <h1>Sentiment Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <div className="radio-container">
          <label>
            <input
              type="radio"
              value="text"
              checked={inputMethod === "text"}
              onChange={(e) => setInputMethod(e.target.value)}
            />
            Enter Text
          </label>
          <label>
            <input
              type="radio"
              value="file"
              checked={inputMethod === "file"}
              onChange={(e) => setInputMethod(e.target.value)}
            />
            Upload File
          </label>
        </div>

        {inputMethod === "text" && (
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Enter your review here"
          />
        )}

        {inputMethod === "file" && (
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        )}

        <button type="submit">Analyze Sentiment</button>
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing sentiment... Please wait.</p>
        </div>
      )}

      {analysisResult && (
        <div className="results-container">
          <h3>Sentiment Analysis Results</h3>
          <p>Overall Sentiment: {analysisResult.overallSentiment}</p>
          <p>Summary: {analysisResult.summary}</p>
          <ul>
            {analysisResult.sentiments.map(
              ([review, sentiment, score], index) => (
                <li key={index}>
                  <strong>{sentiment}</strong> ({score.toFixed(2)}): {review}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalyzer;
