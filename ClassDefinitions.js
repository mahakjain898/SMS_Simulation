class Producer 
//Producer instance generates the number of messsages that is specified. Each message body contains
// phoneNumber and message(text). 
{
    constructor(totalMessageCount = 1000)  // configurable number of messages with default 1000 (TASK 1)
    {
        this.totalMessageCount = totalMessageCount;
        this.messages = this.createAllMessages();
    }

    createAllMessages() 
    {
        const messages = [];
        for (let i = 0; i < this.totalMessageCount; i++) {
            const phoneNumber = this.newPhoneNumberGenerator();
            const message = this.newMessageGenerator();
            messages.push({ phoneNumber, message });
        }
        return messages;
    }

    newPhoneNumberGenerator() 
    {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    newMessageGenerator() 
    {
        const length = Math.floor(Math.random() * 99) + 1;
        let message = '';
        const characters = '0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < length; i++) 
        {
            message += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return message;
    }
}

class Sender 
// Sender's instance creates a new sender which can load the this.producer.messages which contains 
// all the remaining messages to process. It can asynchronously process it, we can specify the 
// meanTime, failureRate and label(optional), And it currently increments the counts accordingly
// if it was successfull or if it failed, after a setTimeout() of time near the meanTime.
{
    constructor(producer, meanTime, failureRate, label) 
    {
        this.producer = producer;
        this.meanTime = meanTime;
        this.failureRate = failureRate;
        this.msgSent = 0;
        this.msgFail = 0;
        this.totalTimeElapsed = 0;
        this.label = label
    }

    async sendMessages() 
    {
        while (this.producer.messages.length > 0) 
        {
            const message = this.producer.messages.pop();
            await this.sendMessage(message);
        }
    }

    async sendMessage(message) 
    {
        return new Promise(resolve => {
            const time = Math.random() * this.meanTime * 2;
            this.totalTimeElapsed += time
            setTimeout(() => {
                //Uncomment to see messages are being sent to which sender
                // console.log(this.label) 
                if (Math.random() < this.failureRate) {
                    this.msgFail++;
                    // pushing failed messages back, Kindly uncomment the below line if this is needed.
                    // this.producer.messages.push(message); 
                } else {
                    this.msgSent++;
                }
                resolve();
            }, time);
        });
    }
}

class ProgressMonitor 
// Tracks the current state of the messages and average time, taking input from all the 
// senderInstances and calculating the total and average accordingly and running continiously 
// at the given configurable time interval
{
    constructor(senderInstances, interval) 
    {
        this.senderInstances = senderInstances;
        this.interval = interval;
        this.intervalId = null; //variable for storing Interval ID
    }

    start() 
    {
        this.intervalId = setInterval(() => { // storing interval ID here
            let totalSent = 0;
            let totalFailed = 0;
            let totalTimeElapsed = 0;

            for (const sender of this.senderInstances) 
            {
                totalSent += sender.msgSent;
                totalFailed += sender.msgFail;
                totalTimeElapsed += sender.totalTimeElapsed;
            }
            console.log('\n');
            console.log(`Total time :                                      ${totalTimeElapsed}`);
            const totalMessagesProcessed = totalSent + totalFailed;
            const averageTime = totalMessagesProcessed ? (totalTimeElapsed / totalMessagesProcessed) / 1000 : 0;

            console.log(`Total number of messages sent so far:             ${totalSent}`); //messages sent so far
            console.log(`Total number of failed messages so far:           ${totalFailed}`); //messages failed so far
            console.log(`Average time per message so far:                  ${averageTime.toFixed(4)} seconds`); // average so far
        }, this.interval * 1000);
    }
    
    stop() // for clearing interval
    {
        if (this.intervalId) 
        {
            clearInterval(this.intervalId);
        }
    }
}

module.exports.Producer = Producer
module.exports.Sender = Sender
module.exports.ProgressMonitor = ProgressMonitor