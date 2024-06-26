import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const response = await fetch('https://strong-mature-tick.ngrok-free.app/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryResult: {
          parameters: { test_param: input },
          queryText: input,
        },
      }),
    });

    const responseData = await response.json();
    setResponse(responseData.fulfillmentText);
  };

  return (
    <div>
      <h1>Speak to your Virtual Assistance</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="user-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" id="submit-button">Submit</button>
      </form>
      <div id="response-output">{response}</div>
    </div>
  );
}

export default App;
