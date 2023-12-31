SMS Simulation Exercise
-

How to run solution?
---

Step 0. Kindly make sure node is installed

Step 1. Install Dependencies: Execute ```npm install``` to download all required node modules.

Step 2. Run the Application: Start the application by running ```node index.js``` or ```npm start```.

Step 3. Run Unit Tests: Execute ```npm test``` to run unit tests for the exercise.

File Descriptions
---

**ClassDefinitions.js** - Contains three classes namely Producer, Sender and ProgressMonitor

   &nbsp;• Producer's instance generates the number of messsages that is specified. Each message body contains phoneNumber and message(text). 
   
   &nbsp;• Sender's instance creates a new sender which can load the this.producer.messages which contains all the remaining messages to process. It can asynchronously process it, we can specify the meanTime, failureRate and label(optional), And it currently increments the counts accordingly if it was successfull or if it failed, after a setTimeout() of time near the meanTime.
   
   &nbsp;• ProgressMonitor tracks the current state of the messages and average time, taking input from all the senderInstances and calculating the total and average accordingly and running continiously at the given configurable time interval

**index.js** - Entry point of solution where we are creating instances of abovementioned classes to solve the problem statement

**index.test.js** - Contains unit tests in Jest

**package.json** - Contains configurational information to install dependecies, set scripts...


Exercise Statement:
---

The objective is to simulate sending a large number of SMS alerts, like for an emergency alert serviceThe simulation consists of three parts:

1. Producer that generates a configurable number of messages (default 1000) to random phone numbersEach message contains up to 100 random characters.

2. Configurable number of senders who pick up messages from the producer and simulate sending messages by waiting a random period of time distributed around a configurable mean. Senders also have a configurable failure rate.

3. Progress monitor that displays the following and updates it every N seconds(configurable):

   &nbsp;• Number of messages sent so far 

   &nbsp;• Number of messages failed so far

   &nbsp;• Average time per message so far

One instance each for the producer and the progress monitor will be started while a variable number of senders can be started with different mean processing time and error rate settings
