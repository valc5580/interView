# interView

As university students who have had interviews for summer job opportunities, we are very much aware of the nerve wracking task of presenting yourself in the best way. We have become aware that body language and non-verbal queues are paramount in impressing an interviewer. As such, we have tried to create a software for users to practice with mock interviews and provide feedback based on computer vision and speech analysis.

The current iteration asks the user 2 interview questions, displays their emotions, eye contact, level of movement, the number of stall words used, and pace of speech in real time on a dashboard. Once the user completes their session, they can see all of their results as well as tips on which areas to improve.

This was built using a Node server, using Express for routing, socket.io for communicating between the front end and the backend, a mongodb database, as well as microsoft FACE api and their Bing Speech api.

Simply clone the repository, add your Bing Speech API and Microsoft FACE API subscription keys in the home.ejs file, and replace "http://localhost:3000" in all filed with whatever URL you like.
