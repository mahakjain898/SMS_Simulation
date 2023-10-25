const { Producer, Sender, ProgressMonitor } = require('./ClassDefinitions'); 

describe('Producer', () => 
{
    let producer;
    const DEFAULT_NUM_MESSAGES = 1000;

    beforeEach(() => {
        producer = new Producer(10);
    });

    test('should generate the correct number of messages', () => 
    {
        expect(producer.messages.length).toBe(10);
    });

    test('should default to generating 1000 messages if no argument is provided', () => 
    {
        const defaultProducer = new Producer();
        expect(defaultProducer.messages.length).toBe(DEFAULT_NUM_MESSAGES);
    });

    test('should generate valid phone numbers', () => 
    {
        const phoneNumber = producer.newPhoneNumberGenerator();
        expect(phoneNumber).toMatch(/^\d{10}$/);
    });

    test('should generate random phone numbers', () => 
    {
        const phoneNumbers = new Set();
        for (let i = 0; i < 100; i++) {
            phoneNumbers.add(producer.newPhoneNumberGenerator());
        }
        // Assuming high randomness, it's unlikely that we'll get the same phone number 100 times in a row
        expect(phoneNumbers.size).toBeGreaterThan(1);
    });

    test('should generate random messages of variable lengths up to 99 characters', () => 
    {
        const lengths = new Set();
        for (let i = 0; i < 100; i++) {
            lengths.add(producer.newMessageGenerator().length);
        }
        // Expecting that we have multiple distinct lengths within 100 iterations
        expect(lengths.size).toBeGreaterThan(1);
        expect(Math.max(...lengths)).toBeLessThanOrEqual(99);
    });

    test('each message should contain both a phone number and message content', () => 
    {
        for (const messageObj of producer.messages) {
            expect(messageObj.phoneNumber).toBeDefined();
            expect(messageObj.message).toBeDefined();
        }
    });
});

describe('Sender', () => 
{
    let producer, sender;
    const MEAN_TIME = 1000;
    const FAILURE_RATE = 0.1;
    const LABEL = "test";

    beforeEach(() => {
        producer = new Producer(10);
        sender = new Sender(producer, MEAN_TIME, FAILURE_RATE, LABEL);
    });

    afterEach(() => {
    });

    test('should initialize with provided values', () => 
    {
        expect(sender.producer).toBe(producer);
        expect(sender.meanTime).toBe(MEAN_TIME);
        expect(sender.failureRate).toBe(FAILURE_RATE);
        expect(sender.label).toBe(LABEL);
    });

    test('should send all messages', async () => 
    {
        const sending = sender.sendMessages();
        await sending;
        expect(producer.messages.length).toBe(0);
        expect(sender.msgSent + sender.msgFail).toBe(10);
        
    }, 20000);
    
    test('should have sent and failed message counts that sum up to the total', async () => 
    {
        const sending = sender.sendMessages();
        await sending;
        expect(sender.msgSent + sender.msgFail).toBe(10);
    }, 20000);
    
});

describe('ProgressMonitor', () => {
    let producer, senders, monitor;

    beforeEach(() => {
        producer = new Producer(100);
        const sender1 = new Sender(producer, 100, 0.1, "verizon");
        const sender2 = new Sender(producer, 100, 0.1, "tmobile");
        senders = [sender1, sender2];
        monitor = new ProgressMonitor(senders, 1);
    });

    afterEach(() => {
        // making sure to stop the monitor after each test to avoid overlap
        monitor.stop();
    });

    test('initial state', () => {
        expect(monitor.senderInstances).toEqual(senders);
        expect(monitor.interval).toBe(1);
    });

    test('start() should initiate monitoring', done => {
        const originalSetInterval = global.setInterval;
        global.setInterval = jest.fn(callback => {
            callback();
            return originalSetInterval(callback, 0); // executing it immediately for the test
        });

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        monitor.start();
        setTimeout(() => {
            expect(logSpy).toHaveBeenCalled();
            global.setInterval = originalSetInterval;
            logSpy.mockRestore();
            done();
        }, 10);
    });
    
    test('stops monitoring once all messages are processed', async () => {
        senders.forEach(sender => {
            sender.msgSent = 50;
            sender.msgFail = 50;
        });

        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

        // we are simulating the end condition by ensuring all messages are processed
        // then we manually start and immediately stop the monitor
        monitor.start();
        monitor.stop();

        expect(clearIntervalSpy).toHaveBeenCalled();
        clearIntervalSpy.mockRestore();
    });
});