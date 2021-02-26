const {EventEmitter} = require('events');
const {Worker, MessageChannel, parentPort} = require('worker_threads');

const WORKER_STATUS = {
    IDLE: Symbol('idle'),
    BUSY: Symbol('busy'),
};

module.exports.WorkerPool = class WorkerPool extends EventEmitter{
    constructor(script, size) {
        super();
        this.script = script;
        this.size = size;
        this.pool = [];
        this._initialize();
    }

    /**
     * Create an initialize workers of the worker pool
     */
    _initialize() {
        for (let i = 0; i < this.size; i++) {

            const worker = new Worker(this.script);
            this.pool.push({
                status: WORKER_STATUS.IDLE,
                worker
            });
            worker.once('exit', () => {
                this.emit(`worker ${worker.threadId} terminated`);
            });
        }
    }

    /**
     * Return one idle worker from the pool
     */
    getIdleWorker() {
        const idleWorker = this.pool.find(w => w.status === WORKER_STATUS.IDLE);
        if (idleWorker) return idleWorker.worker;
        // All workers are busy, grab a random worker
        return this.pool[Math.floor(Math.random() * this.size)].worker;
    }

    /**
     * Set worker's status to idle
     * @param {Worker} worker 
     */
    setWorkerIdle(worker) {
        const currWorker = this.pool.find(w => w.worker === worker);
        if (currWorker) {
            currWorker.status = WORKER_STATUS.IDLE
        }
    }

    /**
     * Set worker's status to busy
     * @param {Worker} worker 
     */
    setWorkerBusy(worker) {
        const currWorker = this.pool.find(w => w.worker === worker);
        if (currWorker) {
            currWorker.status = WORKER_STATUS.BUSY
        }
    }

    /**
     * Run worker script with the provided argument 
     * @param {*} data 
     * @param {Function} cb 
     */
    runWithArg(data, cb) {
        const worker = this.getIdleWorker();
        this.setWorkerBusy(worker);
        const {port1, port2} = new MessageChannel();

        worker.postMessage({data, port: port1}, [port1]);
        port2.once('message', (result) => {
            this.setWorkerIdle(worker);
            cb(null, result);
        });
        port2.once('error', (err) => {
            this.setWorkerIdle(worker);
            cb(err);
        });
    }
}
/**
 * Wrap a function to be run as a worker
 */
module.exports.wrapAsWorker = (workerFunc) => {
    parentPort.on('message', ({data, port}) => {
        // console.log(workerFunc(data))
        try {
                port.postMessage(workerFunc(data));
        } catch (error) {
            console.error(error);
        }

    });
}

module.exports.wrapAsWorkerPromise = (workerFunc) => {
    parentPort.on('message', ({data, port}) => {
        // console.log(workerFunc(data))
        try {
            workerFunc(data).then((result) => {
                port.postMessage(result);

            })
           
        } catch (error) {
            console.error(error);
        }

    });
}