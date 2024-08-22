(async () => {
  const res = await fetch("https://api.neuroengine.ai/Neuroengine-Fast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "no-cors",
    body: JSON.stringify({
      message:
        "Here is a post: 'Lamborghini is my favourite car brand'. Give me three words that describe this post, only the words separated by commas. Send only the three words, no explanations, no punctuation other than commas, no capitalization, no extra spaces, and no additional text.",
    }),
  });
  const data = await res.json();
  // delete all the data from the database

  console.log(data);
})();
