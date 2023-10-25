const { Producer, Sender, ProgressMonitor } = require('./ClassDefinitions'); 

( async function main() 
{
    const producer = new Producer(1000); //configurable number of messages
    //Uncomment to see the message bodies that are being sent
    // console.log(producer.messages);  
    const no_of_sender = 5; // configurable no of sender (TASK 2)

    const mean_proc_times = [1200, 1000, 2000, 1500, 1800] //configurable mean processing times (TASK 2)
    const fail_rates = [0.15, 0.05, 0.20, 0.10, 0.30] // configurable failure rates (TASK 2)

    const senders = [];
    for (let i = 0; i < no_of_sender; i++) 
    {
        const send_name = `Sender ${i+1}`;
        const sender = new Sender(producer, mean_proc_times[i], fail_rates[i], send_name);
        senders.push(sender);
    }

    //TASK 3
    const monitor = new ProgressMonitor(senders, 5); //second arg is the time interval, it updates every n seconds, here n=5 seconds 
    monitor.start();

    const sendingProcesses = senders.map(sender => sender.sendMessages());
    await Promise.all(sendingProcesses);

    monitor.stop(); // stopping after all messages are sent
})();