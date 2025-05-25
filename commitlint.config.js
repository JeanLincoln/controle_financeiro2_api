export default {
  rules: {
    "CF2-RULE": [2, "always"]
  },
  plugins: [
    {
      rules: {
        "CF2-RULE": ({ header }) => {
          const commitRegex = /^CF2-\d{2,}: .*/;
          return [
            commitRegex.test(header),
            `
            
            🚨 Wrong commit message! 😕
            
            Your commit message is wrong, the correct pattern is:
            
            ✅ "CF2-ID: description"
            
            ✅ full example: 
            
            git commit -m "CF2-999: Writing correctly a commit message"

            your message was :

            ❌ "${header}"
            `
          ];
        }
      }
    }
  ]
};
